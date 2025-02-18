"use server";

import { getServerSession } from "next-auth";
import { getPayrollEmployees } from "@/data/getEmployees";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import { PaymentStatus } from "@prisma/client";
import { handlePrismaError } from "@/lib/error-handler";
import fs from "fs";
import path from "path";



export async function exportPayrollToCSV(query: string, currentPage: number) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized");
  }

  const { payroll } = await getPayrollEmployees(session.user.email, query, currentPage);

  const headers = ["ID", "Names", "Basic Salary", "Fringe Benefits", "Additions", "Taxes", "Other Expenses", "Net Salary"];

  const rows = payroll?.processedEmployees?.map((employee) => [
    employee.id,
    `${employee.firstName} ${employee.secondName}`,
    employee.monthlyGross,
    employee.benefits.map((benefit) => benefit.benefit).join(", "),
    employee.additionalIncomes.map((income) => `${income.id} ${income.type} (${(income.amount).toFixed(1)}%)`).join(", "),  
    employee.appliedTaxes.map((tax) => `${tax.tax.name} (${(tax.tax.rate * 100).toFixed(1)}%)`).join(", "),
    employee.deductions.map((deduction) => `${deduction.reason} (${(deduction.amount).toFixed(1)}%)`).join(", "),,   
    employee.monthlyGross - employee.appliedTaxes.reduce((sum, tax) => sum + employee.monthlyGross * tax.tax.rate, 0),
  ]);
  const csvContent = [headers, ...rows||[]].map((row) => row.join(",")).join("\n");
 
  const filePath = path.join(process.cwd(), "public", "exports", `payroll_export_${Date.now()}.csv`);
 
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
 
  fs.writeFileSync(filePath, csvContent);
 
  return filePath;
}

 

export async function exportPayrollToJSON(query: string, currentPage: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  const { payroll } = await getPayrollEmployees(session.user.email, query, currentPage);
  // const data = payroll?.processedEmployees?.map((employee) => ({
  //   id: employee.id,
  //   name: `${employee.firstName} ${employee.secondName}`,
  //   basicSalary: employee.monthlyGross,
  //   fringeBenefits: employee.benefits.map((benefit) => benefit.benefit),
  //   additions: employee.additionalIncomes, 
  //   taxes: employee.appliedTaxes,
  //   otherExpenses:employee.deductions,  
  //   netSalary:employee.netSalary
  // }));
  const filePath = path.join(process.cwd(), "public", "exports", `payroll_export_${Date.now()}.json`);

  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(payroll, null, 2));

  return filePath;
}


export async function SavePayroll() {
  const session = await getServerSession(authOptions);
   if (!session?.user?.email) {
     throw new Error("Unauthorized");
   }

  try {
    return await prisma.$transaction(async (tx) => {
      const company = await prisma.company.findUnique({
        where: { adminEmail: session.user?.email || "" },
      });
  
      if (!company) {
        throw new Error("Company not found");
      }

      const employees = await tx.employee.findMany({
        where: {
          companyId: company.id,
        },
        include: {
          appliedTaxes: {
            include: {
              tax: true
            }
          },
          benefits: true,
          additionalIncomes: {
            where: {
              payment_status: PaymentStatus.Pending
            }
          },
          deductions: {
            where: {
              status: PaymentStatus.Pending
            }
          }
        }
      });

      const processedPayrollEmployees = employees.map((employee) => {
        const totalAdditions = employee.additionalIncomes.reduce(
          (sum, income) => sum + income.amount,
          0
        );
        const totalDeductions = employee.deductions.reduce(
          (sum, deduction) => sum + deduction.amount,
          0
        );
        const totalTaxes = employee.appliedTaxes.reduce(
          (sum, tax) => sum + (employee.monthlyGross * tax.tax.rate),
          0
        );
        const netSalary = employee.monthlyGross - (totalTaxes + totalDeductions) + totalAdditions;

        return {
          employeeId: employee.id,
          paymentDate: new Date().toISOString(),
          additionalIncomes: employee.additionalIncomes,
          taxes: employee.appliedTaxes,
          deductions: employee.deductions,
          salary: employee.monthlyGross,
          netSalary: netSalary,
        };
      });

      const mainPayroll = await tx.mainPayroll.create({
        data: {
          paymentDate: new Date().toISOString()
        }
      });

      await Promise.all(
        processedPayrollEmployees.map(async (employee) => {
          const payroll = await tx.payroll.create({
            data: {
              mainPayollId: mainPayroll.id,
              employeeId: employee.employeeId,
              salary: employee.salary,
              netSalary: employee.netSalary
            }
          });

          await Promise.all([
            ...employee.taxes.map((tax) =>
              tx.appliedTax.update({
                where: { id: tax.id },
                data: { 
                  payrollId: payroll.id,
                }
              })
            ),
            ...employee.deductions.map((deduction) =>
              tx.deduction.update({
                where: { id: deduction.id },
                data: {
                  payrollId: payroll.id,
                  status: PaymentStatus.Pending
                }
              })
            ),
            ...employee.additionalIncomes.map((income) =>
              tx.additionalIncome.update({  
                where: { id: income.id },
                data: {
                  payroll_id: payroll.id,
                  payment_status: PaymentStatus.Pending  
                }
              })
            )
          ]);
        })
      );

      return {
        message: "Payroll saved successfully"
      };
    });
  } catch (error) {
    handlePrismaError(error);
  }
}



export async function getPayrollHistory(
  userEmail: string,
  page: number = 1,
  pageSize: number = 5,
  id?: string
) {
  if (!userEmail) {
    throw new Error("Unauthorized: User email is required");
  }

  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const company = await prisma.company.findUnique({
      where: { adminEmail: userEmail },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    const employees = await prisma.mainPayroll.findMany({
      
      skip,
      take,
      include:{
        payrolls:{
          include:{
            employee:true,
            additionalIncomes:true,
            benefits:true,
            deductions:true,
            taxes:true
          }
        },
        benefits:true,
        additionalIncomes:{
          where:{
            payment_status: {
              equals: PaymentStatus.Pending,
            }
          }
        },
        deductions:{
          where:{
            status: {
              equals: PaymentStatus.Pending,
            }
          }
        }
        
      }
    });
 
    const processedEmployees = employees.map((employee) => {
    const totalAdditions = employee.additionalIncomes.reduce((sum, income) => sum + income.amount, 0);
    const totalDeductions= employee.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
    const totalTaxes = employee.appliedTaxes.reduce((sum, tax) => sum + (employee.monthlyGross * tax.tax.rate), 0);
    const netSalary = employee.monthlyGross - (totalTaxes+totalDeductions) + totalAdditions;
 
    return {
      ...employee,
      additionalIncomes: employee.additionalIncomes.map((income) => ({
        id:income.id,
        type: income.income_type,
        amount: income.amount,
      })),
      taxes: employee.appliedTaxes.map((tax) => ({
        id:tax.id,
        rate:tax.tax.rate,
        type: tax.tax.name,
        amount: employee.monthlyGross * tax.tax.rate,
      })),
      netSalary: netSalary,
    };
  });
 
    const totalCount = await prisma.employee.count({
      where: { companyId: company.id },
    });
    const totalMonthlyGross= processedEmployees.reduce((sum, employee) => sum + employee.monthlyGross, 0)
    const totalAdditionalIncomes = processedEmployees
    .flatMap((employee) => 
      employee.additionalIncomes.map((income) => ({
        id: income.id,
        incomeType: income.type,
        amount: income.amount
      }))
    )
    .reduce((acc: { id: string; type: string; amount: number; }[], income) => {
      const existing = acc.find((i) => i.type=== income.incomeType);
      if (existing) {
        existing.amount += income.amount;
      } else {
        acc.push({ id: income.id, type: income.incomeType, amount: income.amount });
      }
      return acc;
    }, []);
  
    const totalDeductions = processedEmployees
    .flatMap((employee) => 
      employee.deductions.map((deduction) => ({
        id: deduction.id,
        reason: deduction.reason,
        amount: deduction.amount
      }))
    )
    .reduce((acc: { id: string; reason: string; amount: number; }[], deduction) => {
      const existing = acc.find((i) => i.reason=== deduction.reason);
      if (existing) {
        existing.amount += deduction.amount;
      } else {
        acc.push({ id: deduction.id, reason: deduction.reason, amount: deduction.amount });
      }
      return acc;
    }, []);

    const totalTaxes= processedEmployees
    .flatMap((employee) => employee.taxes.map((tax) => ({
      id:tax.id,
      name: tax.type,
      rate: tax.rate,
      amount: tax.amount
    })))
    .reduce((acc: { id: string; name: string; rate: number; amount: number }[], tax) => {
       const existing = acc.find((i) => i.name === tax.name);
      if (existing) {
        existing.amount += tax.amount;
      } else {
        acc.push({ id: tax.id, name: tax.name, rate: tax.rate, amount: tax.amount });
      }
      return acc;
    }, [])
    const totalNetSalary=processedEmployees.reduce((sum, employee) => sum +  employee.netSalary, 0)
    const totalTaxesAmount= totalTaxes.reduce((sum, tax) => sum + tax.amount, 0)
    const totalAdditonalIncomesAmount= totalAdditionalIncomes.reduce((sum, income) => sum + income.amount, 0)
    const totalDeductionsAmount= totalDeductions.reduce((sum, deduction) => sum + deduction.amount, 0)
    const currency= "RWF"
    const payroll= {processedEmployees, totalMonthlyGross, totalAdditionalIncomes, totalDeductions,totalTaxes, totalNetSalary, totalAdditonalIncomesAmount, totalTaxesAmount, totalDeductionsAmount,currency}
    return id
      ? { employee: employees[0] || null }  
      : {
           payroll: payroll,
          pagination: {
            page,
            pageSize,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
          },
        };
  } catch (error) {
    handlePrismaError(error);  
    throw error;  
  }
}







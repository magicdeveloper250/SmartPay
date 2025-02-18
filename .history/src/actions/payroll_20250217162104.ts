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
  page: number = 1,
  pageSize: number = 5,
  id?: string
) {
  

  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const payrolls = await prisma.mainPayroll.findMany({
      
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
        
      }
    });

    const totalCount = await prisma.mainPayroll.count( );
 
    return {payrolls, pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    }}
  } catch (error) {
    handlePrismaError(error);  
    throw error;  
  }
}







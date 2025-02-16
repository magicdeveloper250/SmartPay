import { prisma } from "@/utils/prismaDB";
import { handlePrismaError } from "@/lib/error-handler";
import { PaymentStatus } from "@prisma/client";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";

export async function getEmployees(
  userEmail: string,
  query?: string,
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
      include: {
        employees: {
          where: id
            ? { id }  
            : {
                OR: query
                  ? [
                      { firstName: { contains: query, mode: "insensitive" } },
                      { secondName: { contains: query, mode: "insensitive" } },
                      { department: { contains: query, mode: "insensitive" } },
                      { jobTitle: { contains: query, mode: "insensitive" } },
                      { bankName: { contains: query, mode: "insensitive" } },
                      { employeeID: { contains: query, mode: "insensitive" } },
                    ]
                  : undefined,
              },
          skip,
          take,
        },
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    const employees = company.employees;
    const totalCount = await prisma.employee.count({
      where: { companyId: company.id },
    });

    return id
      ? { employee: employees[0] || null }
      : {
          employees,
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



 

export async function getPayrollEmployees(
  userEmail: string,
  query?: string,
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

    const employees = await prisma.employee.findMany({
      where: {
        companyId: company.id,  
        ...(id
          ? { id }  
          : query
          ? {
              OR: [
                { firstName: { contains: query, mode: "insensitive" } },
                { secondName: { contains: query, mode: "insensitive" } },
                { department: { contains: query, mode: "insensitive" } },
                { jobTitle: { contains: query, mode: "insensitive" } },
                { bankName: { contains: query, mode: "insensitive" } },
                { employeeID: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      // skip,
      // take,
      include:{
        appliedTaxes:{
          include:{
            tax:true
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







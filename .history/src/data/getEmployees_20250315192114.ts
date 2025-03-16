import { prisma } from "@/utils/prismaDB";
import { handlePrismaError } from "@/lib/error-handler";
import { PaymentStatus, SupportedTaxes } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { calculateRwandaIncomeTax, getCurrentSupportedTaxYear } from "@/types/incomeTaxes";

export async function getEmployees(
  userEmail: string,
  query?: string,
  page: number = 1,
  pageSize: number = 5,
  id?: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: "Unauthorized" }
  }

  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
      company:{
        include:{
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
        }
      }
      },
    });

    if (!user ||!user.company) {
      throw new Error("Company not found");
    }

    const employees = user.company.employees;
    const totalCount = await prisma.employee.count({
      where: { companyId: user.company.id },
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
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: "Unauthorized" }
  }
  const taxYear= getCurrentSupportedTaxYear();
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const user = await prisma.user.findUnique({
      where: { email:session.user.email },
     include:{
      company:{
        select:{
          id:true,
          settings:{
            select:{
              defaultCurrency:true
            }
          }
        }
      }
     }
    });

    if (!user||!user.company) {
      throw new Error("Company not found");
    }

    const employees = await prisma.employee.findMany({
      where: {
        companyId: user.company.id,  
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
            paymentStatus: {
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
          const totalTaxes = employee.appliedTaxes.reduce((sum, tax) =>tax.tax.name == SupportedTaxes.PIT ?sum+ calculateRwandaIncomeTax({
            taxYear: taxYear,
            taxableAnnualIncome: employee.monthlyGross,  
            personalAllowance: 0,    
          }).total: sum, 0);
          const netSalary = employee.monthlyGross - (totalTaxes+totalDeductions) + totalAdditions;
      
          return {
            ...employee,
            additionalIncomes: employee.additionalIncomes.map((income) => ({
              id:income.id,
              type: income.incomeType,
              amount: income.amount,
            })),
            taxes: employee.appliedTaxes.map((tax) => ({
              id:tax.id,
          
              type: tax.tax.name,
              
            })),
            netSalary: netSalary,
          };
  });
 
    const totalCount = await prisma.employee.count({
      where: { companyId: user.company.id },
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
      amount:tax.type == SupportedTaxes.PIT ?calculateRwandaIncomeTax({
        taxYear: taxYear,
        taxableAnnualIncome: employee.monthlyGross,  
        personalAllowance: 0,    
      }).total: 0
  
    })))
    .reduce((acc: { id: string; name: string; amount:number }[], tax) => {
       const existing = acc.find((i) => i.name === tax.name);
      if (existing) {
        existing.amount += tax.amount;
      } else {
        acc.push({ id: tax.id, name: tax.name, amount: tax.amount });
      }
      return acc;
    }, [])
    const totalNetSalary=processedEmployees.reduce((sum, employee) => sum +  employee.netSalary, 0)
    const totalTaxesAmount= totalTaxes.reduce((sum, tax) => sum + tax.amount, 0)
    console.log("Taxesss", calculateRwandaIncomeTax({
      taxYear: taxYear,
      taxableAnnualIncome: 10000,  
      personalAllowance: 0,    
    }).total)
    const totalAdditonalIncomesAmount= totalAdditionalIncomes.reduce((sum, income) => sum + income.amount, 0)
    const totalDeductionsAmount= totalDeductions.reduce((sum, deduction) => sum + deduction.amount, 0)
    const currency= user.company.settings?.defaultCurrency || "USD"
    const payroll= {processedEmployees, totalMonthlyGross, totalAdditionalIncomes, totalDeductions,totalTaxes, totalNetSalary, totalAdditonalIncomesAmount, totalTaxesAmount, totalDeductionsAmount,currency}
    return id
      ? { employee: employees[0] || null }  
      : {
           payroll: payroll,
           taxYear:taxYear,
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







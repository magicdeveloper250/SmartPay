"use server";

import { getServerSession } from "next-auth";
import { getPayrollEmployees } from "@/data/getEmployees";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import { PaymentStatus, PayrollType } from "@prisma/client";
import { handlePrismaError, handleActionsPrismaError } from "@/lib/error-handler";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { SupportedTaxes } from "@prisma/client";
import { calculateRwandaIncomeTax } from "@/types/incomeTaxes";
import { SupportedRwandaTaxYear, TaxYear, } from "@/types/taxes";
import { getCurrentSupportedTaxYear } from "@/types/incomeTaxes";



export async function exportPayrollToCSV(
  query: string, 
  page: number,
 
) {
  // const session = await getServerSession(authOptions);
  // if (!session || !session.user || !session.user.email) {
  //   throw new Error("Unauthorized");
  // }

  // const { payroll } = await getPayrollEmployees(session.user.email, query, page);

  // const headers = ["ID", "Names", "Basic Salary", "Fringe Benefits", "Additions", "Taxes", "Other Expenses", "Net Salary"];

  // const rows = payroll?.processedEmployees?.map((employee) => [
  //   employee.id,
  //   `${employee.firstName} ${employee.secondName}`,
  //   employee.monthlyGross,
  //   employee.benefits.map((benefit) => benefit.benefit).join(", "),
  //   employee.additionalIncomes.map((income) => `${income.id} ${income.type} (${(income.amount).toFixed(1)}%)`).join(", "),  
  //   employee.appliedTaxes.map((tax) => `${tax.tax.name} (${(tax.tax.rate * 100).toFixed(1)}%)`).join(", "),
  //   employee.deductions.map((deduction) => `${deduction.reason} (${(deduction.amount).toFixed(1)}%)`).join(", "),,   
  //   employee.monthlyGross - employee.appliedTaxes.reduce((sum, tax) => sum + employee.monthlyGross * tax.tax.rate, 0),
  // ]);
  // const csvContent = [headers, ...rows||[]].map((row) => row.join(",")).join("\n");
 
  // const filePath = path.join(process.cwd(), "public", "exports", `payroll_export_${Date.now()}.csv`);
 
  // const dirPath = path.dirname(filePath);
  // if (!fs.existsSync(dirPath)) {
  //   fs.mkdirSync(dirPath, { recursive: true });
  // }
 
  // fs.writeFileSync(filePath, csvContent);
 
  return "filePath";
}

 

export async function exportPayrollToJSON(
  query: string, 
  page: number,
  
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  const { payroll } = await getPayrollEmployees(session.user.email, query, page);
 
  const filePath = path.join(process.cwd(), "public", "exports", `payroll_export_${Date.now()}.json`);

  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(payroll, null, 2));

  return filePath;
}


export async function SavePayroll(
  payDate: Date,
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email || "" },
        include:{
          company:true
        }
      });
  
      if (!user||!user.company) {
        throw new Error("Company not found");
      }

      const existingPayroll = await tx.mainPayroll.findFirst({
        where: { 
          AND: [
            {
              paymentDate: {
                equals: payDate.toISOString(),
              }
            },
            {
              payrollType: {
                equals: PayrollType.EMPLOYEE
              }
            },
            {
              companyId: user.company.id
            }
          ]
        },
      });
   
      if (existingPayroll) {
        return {
          error: "Payroll for this date already exists"
        }
      }

      const employees = await tx.employee.findMany({
        where: {
          companyId: user.company.id,
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
              paymentStatus: PaymentStatus.Pending
            }
          },
          deductions: {
            where: {
              status: PaymentStatus.Pending
            }
          }
        }, 
       
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

        const taxYear= getCurrentSupportedTaxYear();
       
        
        const totalTaxes = employee.appliedTaxes.reduce(
          (sum, tax) => tax.tax.name == SupportedTaxes.PIT ?sum+ calculateRwandaIncomeTax({
            taxYear: taxYear,
            taxableAnnualIncome: employee.monthlyGross,  
            personalAllowance: totalDeductions,    
          }).total: sum,
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
          totalAdditions:totalAdditions,
          totalTaxes:totalTaxes,
          totalDeductions:totalDeductions
        };
      });

      const totolGrossAmount=  processedPayrollEmployees.reduce(
        (sum, employee) => sum +employee.salary,
        0
      );


      const totolNetAmount=  processedPayrollEmployees.reduce(
        (sum, employee) => sum +employee.netSalary,
        0
      );
      const totolTaxesAmount=  processedPayrollEmployees.reduce(
        (sum, employee) => sum +employee.totalTaxes,
        0
      );

      const totolAdditionalAmount=  processedPayrollEmployees.reduce(
        (sum, employee) => sum +employee.totalAdditions,
        0
      );
      const  totolDeductions=  processedPayrollEmployees.reduce(
        (sum, employee) => sum +employee.totalDeductions,
        0
      );
      const mainPayroll = await tx.mainPayroll.create({
        data: {
          paymentDate:  payDate.toISOString(),
          companyId: user.company.id,
          payrollType: PayrollType.EMPLOYEE,
          totalGrossAmount: totolGrossAmount,
          totalAdditionalIncomeAmount:totolAdditionalAmount,
          totalNetAmount:totolNetAmount,
          totalTaxesAmount:totolTaxesAmount,
          totalDeductionAmount:totolDeductions

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
                  status:  PaymentStatus.Ready 
                }
              })
            ),
            ...employee.additionalIncomes.map((income) =>
              tx.additionalIncome.update({  
                where: { id: income.id },
                data: {
                  payrollId: payroll.id,
                  paymentStatus: PaymentStatus.Ready 
                }
              })
            )
          ]);
        })
      );

      return {
        message: "Payroll saved successfully", payroll:mainPayroll
      };
    }, {maxWait:parseInt(process.env.DATABASE_MAX_WAIT_TIME || "10000"), timeout:parseInt(process.env.DATABASE_TIMEOUT || "10000")});
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}




export async function SaveContractorPayroll(payDate: Date) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email: session.user?.email || "" },
        include:{
          company:true
        }
      });

      if (!user || !user.company) {
        throw new Error("Company not found");
      }

      const existingPayroll = await tx.mainPayroll.findFirst({
        where: { 
          AND: [
            {
              paymentDate: {
                equals: payDate.toISOString(),
              }
            },
            {
              payrollType: {
                equals: PayrollType.CONTRACTOR
              }
            },
            {
              companyId: user.company.id
            }
          ]
        },
      });
  
      if (existingPayroll) {
        return {
          error: "Payroll for this date already exists" 
        }
      }
 
      const contractors = await tx.contractor.findMany({
        where: {
          companyId: user.company.id,
          contractsTerms: {
            some: {
              AND: [
                { endDate: { gte: payDate } },
                { startDate: { lte: payDate } },
                { status: { not: PaymentStatus.Paid } }
              ]
            }
          }
        },
        include: {
          contractsTerms: {
            where: {
              AND: [
                { endDate: { gte: payDate } },
                { startDate: { lte: payDate } },
                { status: { not: PaymentStatus.Paid } }
              ]
            }
          },
          appliedTaxes: {
            include: {
              tax: true
            }
          },
          benefits: true
        }
      });

      if (contractors.length === 0) {
        return {
          error: "No eligible contractors found for payroll"
        };
      }

      const processedPayrollContractors = contractors.map((contractor) => {
        const currentContract = contractor.contractsTerms[0];  
        if (!currentContract) return null;
        const taxYear= getCurrentSupportedTaxYear();
        const totalTaxes = contractor.appliedTaxes.reduce(
          (sum, tax) => tax.tax.name == SupportedTaxes.PIT ?sum+ calculateRwandaIncomeTax({
            taxYear: taxYear,
            taxableAnnualIncome: currentContract.salary,  
            personalAllowance: 0,    
          }).total: sum,
          0
        );
        const netSalary = currentContract.salary - totalTaxes;

        return {
          contractorId: contractor.id,
          contractTermId: currentContract.id,
          salary: currentContract.salary,
          netSalary: netSalary,
          taxes: contractor.appliedTaxes
        };
      }).filter((item): item is NonNullable<typeof item> => item !== null);

      const mainPayroll = await tx.mainPayroll.create({
        data: {
          paymentDate: payDate.toISOString(),
          companyId: user.company.id,
          payrollType: PayrollType.CONTRACTOR
        }
      });

      await Promise.all(
        processedPayrollContractors.map(async (contractor) => {
          const payroll = await tx.payroll.create({
            data: {
              mainPayollId: mainPayroll.id,
              contractorId: contractor.contractorId,
              salary: contractor.salary,
              netSalary: contractor.netSalary,
              contractId:contractor.contractTermId
            }
          });

          await Promise.all([
            ...contractor.taxes.map((tax) =>
              tx.appliedTax.update({
                where: { id: tax.id },
                data: { 
                  payrollId: payroll.id
                }
              })
            ),
            tx.contractTerms.update({
              where: { id: contractor.contractTermId },
              data: {
                mainPayollId: mainPayroll.id,
                status: PaymentStatus.Ready
              }
            })
          ]);
        })
      );

      return {
        message: "Contractor payroll saved successfully", payroll:mainPayroll
      };
    }, {
      maxWait: parseInt(process.env.DATABASE_MAX_WAIT_TIME || "10000"), 
      timeout: parseInt(process.env.DATABASE_TIMEOUT || "10000")
    });
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}



export async function getPayrollHistory(
  payrollType: PayrollType,
  status: PaymentStatus,
  page: number = 1,
  pageSize: number = 5,
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "Unauthorized" }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include:{
        company:true
      }
    });

    if (!user ||!user.company) {
      return { error: "Company not found" };
    }

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const payrolls = await prisma.mainPayroll.findMany({
      where: {
        status: status === PaymentStatus.All ? 
          { in: [PaymentStatus.Pending, PaymentStatus.Paid, PaymentStatus.Cancelled, PaymentStatus.Failed] } 
          : status,
        payrollType: payrollType === PayrollType.MIXED ? 
          { in: [PayrollType.EMPLOYEE, PayrollType.CONTRACTOR] } 
          : payrollType,
        companyId: user.company.id
      },
      skip,
      take,
      include: {
        payrolls: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                secondName: true,
                monthlyGross: true,
              }
            },
            contractor: {
              select: {
                id: true,
                firstName: true,
                secondName: true,
                contractsTerms: {
                  select: {
                    salary: true,
                    status: true
                  }
                }
              }
            },
            additionalIncomes: true,
            benefits: true,
            deductions: true,
            taxes: {
              include: {
                tax: true
              }
            }
          }
        },
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    const totalCount = await prisma.mainPayroll.count({
      where: {
        status: status === PaymentStatus.All ? 
          { in: [PaymentStatus.Pending, PaymentStatus.Paid, PaymentStatus.Cancelled, PaymentStatus.Failed] } 
          : status,
        payrollType: payrollType === PayrollType.MIXED ? 
          { in: [PayrollType.EMPLOYEE, PayrollType.CONTRACTOR] } 
          : payrollType,
        companyId: user.company.id
      }
    });

    return {
      history: payrolls, 
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      }
    }
  } catch (error) {
    handlePrismaError(error);
    throw error;
  }
}

export async function getPayrollById(payrollId: string) {

  try {
    const payroll = await prisma.mainPayroll.findUnique({
      where: { id: payrollId, payrollType:PayrollType.EMPLOYEE },
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
    }});
    
    if (!payroll) {
      return { error: "payroll not found" };
    }

    return payroll;  
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

export async function getContractorPayrollById(payrollId: string) {

  try {
    const payroll = await prisma.mainPayroll.findUnique({
      where: { id: payrollId, payrollType:PayrollType.CONTRACTOR },
      include:{
        payrolls:{
          include:{
            contractor:{
              include:{
                contractsTerms:true
              }
            },
            additionalIncomes:true,
            taxes:true,
            
          }
        },
    }});
   
    if (!payroll) {
      return { error: "payroll not found" };
    }


    return payroll;  
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}




export async function payPayrollById(mainPayrollId: string, payrollId: string) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const payroll = await prisma.payroll.update({
        where: { id: payrollId, status: {
          notIn:[ PaymentStatus.Paid, PaymentStatus.Cancelled],
        }, },
        data: { status: PaymentStatus.Paid },
      });

      if (!payroll) {
        throw new Error("Payroll not found");
      }

      const unpaidPayrolls = await prisma.payroll.findMany({
        where: {
          mainPayollId: mainPayrollId,
          status: {
            not: PaymentStatus.Paid,
          },
        },
      });

      if (unpaidPayrolls.length === 0) {
        await prisma.mainPayroll.update({
          where: { id: mainPayrollId },
          data: { status: PaymentStatus.Paid },
        });
      }

      return payroll;
    });

    revalidatePath(`/history/${mainPayrollId}/detail`);
     
    return result;
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

 


export async function payPayrollAll(mainPayrollId: string) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const payroll = await prisma.payroll.updateMany({
        where: {
          mainPayollId:mainPayrollId,
          status: {
          notIn:[ PaymentStatus.Paid, PaymentStatus.Cancelled],
          
        }, },
        data: { status: PaymentStatus.Paid },
      });

      if (!payroll) {
        throw new Error("Payroll not found");
      }

      const unpaidPayrolls = await prisma.payroll.findMany({
        where: {
          mainPayollId: mainPayrollId,
          status: {
            not: PaymentStatus.Paid,
          },
        },
      });

      if (unpaidPayrolls.length === 0) {
        await prisma.mainPayroll.update({
          where: { id: mainPayrollId },
          data: { status: PaymentStatus.Paid },
        });
      }

      return payroll;
    });

    revalidatePath(`/history/${mainPayrollId}/detail`);
    return result;
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}





export async function cancellPayrollAll(mainPayrollId: string) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const payroll = await prisma.payroll.updateMany({
        where: {mainPayollId:mainPayrollId,status: {
          notIn:[ PaymentStatus.Paid],
          
        }, },
        data: { status: PaymentStatus.Cancelled },
      });

      if (!payroll) {
        throw new Error("Payroll not found");
      }

      await prisma.mainPayroll.update({
        where: { id: mainPayrollId },
        data: { status: PaymentStatus.Cancelled },
      });

      return payroll;
    });

    revalidatePath(`/history/${mainPayrollId}/detail`);
    return result;
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}


export async function cancellPayrollById(mainPayrollId: string, payrollId:string) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const payroll = await prisma.payroll.update(
        {
        where: {
          mainPayollId:mainPayrollId,id:payrollId,status: {
          notIn:[ PaymentStatus.Paid],
          
        }, },
        data: { status: PaymentStatus.Cancelled },
      });

      if (!payroll) {
        throw new Error("Payroll not found");
      }

      return payroll;
    });

    revalidatePath(`/history/${mainPayrollId}/detail`);
     
    return result;
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

export async function activatePayroll(mainPayrollId: string) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const payroll = await prisma.payroll.updateMany({
        where: {mainPayollId:mainPayrollId,status: {
          in:[ PaymentStatus.Pending, PaymentStatus.Cancelled, PaymentStatus.Failed],
          
        }, },
        data: { status: PaymentStatus.Pending },
      });

      if (!payroll) {
        throw new Error("Payroll not found");
      }

      await prisma.mainPayroll.update({
        where: { id: mainPayrollId },
        data: { status: PaymentStatus.Pending },
      });

      return payroll;
    });

    revalidatePath(`/history/${mainPayrollId}/detail`);
     
    return result;
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

export async function activatePayrollById(mainPayrollId: string, payrollId:string) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const payroll = await prisma.payroll.update({
        where: {
          mainPayollId:mainPayrollId,
          id: payrollId,
          status: {
          in:[ PaymentStatus.Pending, PaymentStatus.Cancelled, PaymentStatus.Failed],
          
        }, },
        data: { status: PaymentStatus.Pending },
      });

      if (!payroll) {
        throw new Error("Payroll not found");
      }

      return payroll;
    });

    revalidatePath(`/history/${mainPayrollId}/detail`);
     
    return result;
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}






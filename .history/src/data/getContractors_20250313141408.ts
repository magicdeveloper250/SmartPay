import { prisma } from "@/utils/prismaDB";
import { handlePrismaError } from "@/lib/error-handler";
import { PaymentStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export async function getContractors(
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
      where: { email: session.user.email },
     include:{
      company: {
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

    if (!user ||!user.company) {
      throw new Error("Company not found");
    }

    const contractors = await prisma.contractor.findMany({
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
                { contractorID: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        appliedTaxes: {
          include: {
            tax: true
          }
        },
        benefits: true,
        contractsTerms: {
          where: {
            status: {
              equals: PaymentStatus.Pending
            }
          }
        },
        payrolls: {
          include: {
            mainPayroll: true,
            taxes: {
              include: {
                tax: true
              }
            }
          }
        }
      }
    });

    const processedContractors = contractors.map((contractor) => {
      const contractsWithTaxes = contractor.contractsTerms.map((contract) => {
        const totalTaxes = contractor.appliedTaxes.reduce((sum, appliedTax) => {
          return sum + (contract.salary * appliedTax.tax.rate);
        }, 0);
        const netSalary = contract.salary - totalTaxes;
        return {
          ...contract,
          taxes: contractor.appliedTaxes.map((appliedTax) => ({
            ...appliedTax.tax,
            amount: contract.salary * appliedTax.tax.rate,
          })),
          totalTaxes: totalTaxes,
          netSalary: netSalary,
        };
      });

      const TotalOverallTaxes = contractsWithTaxes.reduce((sum, contract) => sum + contract.totalTaxes, 0);
      const TotalContractsSalaries = contractsWithTaxes.reduce((sum, contract) => sum + contract.salary, 0);
      const NetOverallSalary = TotalContractsSalaries - TotalOverallTaxes;

      return {
        contractor: {
          ...contractor,
          contracts: contractsWithTaxes,
        },
        TotalOverallTaxes,
        TotalContractsSalaries,
        NetOverallSalary,
      };
    });

    const totalCount = await prisma.contractor.count({
      where: { companyId: user.company.id },
    });

    const totalTaxes = processedContractors.reduce((sum, contractor) => sum + contractor.TotalOverallTaxes, 0);
    const totalNetSalary = processedContractors.reduce((sum, contractor) => sum + contractor.NetOverallSalary, 0);
    const TotalOverallSalaries = processedContractors.reduce((sum, contractor) => sum + contractor.TotalContractsSalaries, 0);
    const currency = user.company?.settings?.defaultCurrency ||"USD";
    const payrollContractors = { processedContractors, totalTaxes, totalNetSalary, TotalOverallSalaries, currency };

    return id
      ? { contractor: contractors[0] || null }
      : {
          contractors: payrollContractors,
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

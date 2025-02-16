import { prisma } from "@/utils/prismaDB";  
import { handlePrismaError } from "@/lib/error-handler";  

export async function getEmployees(userEmail: string, id?: string) {
  if (!userEmail) {
    throw new Error("Unauthorized: User email is required");
  }

  try {
    const company = await prisma.company.findUnique({
      where: { adminEmail: userEmail },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    if (id) {
      const employee = await prisma.employee.findFirst({
        where: {
          id,
          companyId: company.id,
        },
      });

      if (!employee) {
        throw new Error("Employee not found");
      }

      return { employee };
    }

    const employees = await prisma.employee.findMany({
      where: { companyId: company.id },
    });

    return { employees };
  } catch (error) {
    // Handle any errors that occur during the process
    handlePrismaError(error);
    throw error; // Re-throw the error after handling it
  }
}
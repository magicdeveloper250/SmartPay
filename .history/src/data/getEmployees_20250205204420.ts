import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth"; // Adjust the import path as needed
import { prisma } from "@/utils/prismaDB"; // Adjust the import path as needed
import { handlePrismaError } from "@/lib/error-handler"; // Adjust the import path as needed

export async function getEmployees(userEmail: string, id?: string) {
  // Validate the user's session
  if (!userEmail) {
    throw new Error("Unauthorized: User email is required");
  }

  try {
    // Fetch the company associated with the user's email
    const company = await prisma.company.findUnique({
      where: { adminEmail: userEmail },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    // If an ID is provided, fetch a single employee
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

    // If no ID is provided, fetch all employees for the company
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
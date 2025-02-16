import { prisma } from "@/utils/prismaDB";  
import { handlePrismaError } from "@/lib/error-handler";  

export async function getEmployees(
  userEmail: string, 
  query?: string, 
  page: number = 1, 
  pageSize: number = 10, 
  id?: string
) {
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

    const whereClause: any = {
      companyId: company.id,
    };

    if (query) {
      whereClause.OR = [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        // Add other fields you want to search by
      ];
    }

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [employees, totalCount] = await Promise.all([
      prisma.employee.findMany({
        where: whereClause,
        skip,
        take,
      }),
      prisma.employee.count({
        where: whereClause,
      }),
    ]);

    return { 
      employees, 
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  } catch (error) {
    // Handle any errors that occur during the process
    handlePrismaError(error);
    throw error; // Re-throw the error after handling it
  }
}
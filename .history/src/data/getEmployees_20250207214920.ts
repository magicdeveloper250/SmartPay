import { prisma } from "@/utils/prismaDB";
import { handlePrismaError } from "@/lib/error-handler";

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
            ? { id } // Fetch specific employee if ID is provided
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

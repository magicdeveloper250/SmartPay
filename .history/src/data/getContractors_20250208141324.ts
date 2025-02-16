import { prisma } from "@/utils/prismaDB";
import { handlePrismaError } from "@/lib/error-handler";

export async function getContractors(
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
        contractTerms:true,
        contractors: {
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
                      { contractorID: { contains: query, mode: "insensitive" } },
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

    const contractors = company.contractors;
    const totalCount = await prisma.contractor.count({
      where: { companyId: company.id },
    });

    return id
      ? { contractor: contractors[0] || null }
      : {
          contractors,
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

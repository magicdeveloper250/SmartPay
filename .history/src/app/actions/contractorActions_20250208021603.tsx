"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/utils/prismaDB";
import { contractorSchema, contractorSchemaType } from "@/validations/contractorSchema";
import { handleActionsPrismaError } from "@/lib/error-handler";

export async function createContractor(formData: contractorSchemaType) {
      const result = contractorSchema.safeParse(formData);

      if (!result.success) {
        const errorMessages = result.error.issues.reduce((prev, issue) => {
          return (prev += issue.message);
        }, '');
        return {
          error: errorMessages,
        };
      }
  
    try {
      const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "Unauthorized" }
    }
     
      const { salary, startDate, endDate, notes, ...contractorData } = formData;
  
      const company = await prisma.company.findUnique({
        where: { adminEmail: session.user.email },
      });
  
      if (!company) {
        return { error: "Company not found" };
      }
  
      const result = await prisma.$transaction(async (tx) => {
        const newContractor = await tx.contractor.create({
          data: { ...contractorData, companyId: company.id },
        });
  
        const contract = await tx.contractTerms.create({
          data: {
            salary,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            notes,
            companyId: company.id,
            contractorId: newContractor.id,  
          },
        });
   
        const updatedCompany = await tx.company.update({
          where: { id: company.id },
          data: { onBoardingFinished: true },
        });
  
        revalidatePath("/dashboard/employees/contractors");
      });
  
      
    } catch (error) {
      return handleActionsPrismaError(error);
    }
}
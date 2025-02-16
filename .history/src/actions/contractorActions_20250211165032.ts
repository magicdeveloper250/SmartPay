"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/utils/prismaDB";
import { contractorSchema, contractorSchemaType } from "@/validations/contractorSchema";
import { handleActionsPrismaError } from "@/lib/error-handler";


export async function getContractor(contractorId: string) {

  try {
    const contractor = await prisma.contractor.findUnique({
      where: { id:contractorId },
      include: {
        benefits: true,
        salaries: true,
        contractsTerms:true,
        appliedTaxes:true
      },
    });

    if (!contractor) {
      return { error: "Contractor not found" };
    }

    return contractor;  
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

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
  
       await prisma.$transaction(async (tx) => {
        const newContractor = await tx.contractor.create({
          data: { ...contractorData, companyId: company.id },
        });
  
        await tx.contractTerms.create({
          data: {
            salary,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            notes,
            companyId: company.id,
            contractorId: newContractor.id,  
          },
        });
   
         await tx.company.update({
          where: { id: company.id },
          data: { onBoardingFinished: true },
        });
  
        revalidatePath("/dashboard/employees/contractors");
      });
  
      
    } catch (error) {
      return handleActionsPrismaError(error);
    }
}



export async function updateContractor(contractorId:string,contractId:string, formData:contractorSchemaType) {
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
   const company = await prisma.company.findUnique({
          where: { adminEmail: session.user.email },
        });
    
        if (!company) {
          return { error: "Company not found" };
        }
        const { salary, startDate, endDate, notes, ...contractorData } = formData;
        await prisma.$transaction([  prisma.contractor.update({
          where:{id: contractorId},
          data: { ...contractorData, companyId: company.id },
        }), prisma.contractTerms.update({
          where:{id:contractId, contractorId:contractId},
          data: {
            salary,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            notes,
            companyId: company.id,
            contractorId: contractId,  
          },
        })]);

    revalidatePath(`/contractor/internal/${contractorId}`);
} catch (error) {
return  handleActionsPrismaError(error)
}
}

export async function addContractorBenefit(contractorId: string, benefit:string) {

  try {
    const contractorBenefit = await prisma.contractorBenefit.create({
    data:{
       contractorId:contractorId,
      benefit:benefit
    }
    });

    if (!contractorBenefit) {
      return { error: "Contractpr benefot not found" };
    }

    revalidatePath(`/contractor/internal/${contractorId}`);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}


export async function deleteContractorBenefit(id:string, contractorId: string) {

  try {
    const benefit = await prisma.contractorBenefit.delete({
    where:{
      id:id,
      contractorId:contractorId,
    }
    });

    if (!benefit) {
      return { error: "Benefit not found" };
    }

    revalidatePath(`/contractor/internal/${contractorId}`);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}



 
export async function addContractorTax(contractorId: string, taxId:string) {

  try {
     await prisma.appliedTax.create({
    data:{
      contractorId:contractorId,
      taxId:taxId

    }
    });

    
    revalidatePath(`/contractor/internal/${contractorId}`);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

export async function deleteContractorTax( taxId: string, contractorId: string,) {

  try {
    await prisma.appliedTax.delete({
    where:{
      id:taxId,
      contractorId:contractorId
    }
    });

    revalidatePath(`/contractor/internal/${contractorId}`);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/utils/prismaDB";
import { contractorSchema, contractorSchemaType, editContractorSchemaType } from "@/validations/contractorSchema";
import { handleActionsPrismaError } from "@/lib/error-handler";


export async function Update(contractorId: string) {

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
  
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }, include:{
          company:true
        }
      });
  
      if (!user||!user.company) {
        return { error: "Company not found" };
      }
  
       await prisma.$transaction(async (tx) => {
        const newContractor = await tx.contractor.create({
          data: { ...contractorData, companyId: user.company.id },
        });
  
        await tx.contractTerms.create({
          data: {
            salary,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            notes,
            companyId: user.company.id,
            contractorId: newContractor.id,  
          },
        });
   
         await tx.company.update({
          where: { id: user.company.id },
          data: { onBoardingFinished: true },
        });
  
        revalidatePath("/dashboard/employees/contractors");
        revalidatePath("/dashboard/payroll/internal?tab=contractors");
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
   const user = await prisma.user.findUnique({
          where: { email: session.user.email }, include:{company:true}
        });
    
        if (! user || !user.company) {
          return { error: "Company not found" };
        }
        const { salary, startDate, endDate, notes, ...contractorData } = formData;
        
        await prisma.$transaction([  prisma.contractor.update({
          where:{id: contractorId},
          data: { ...contractorData, companyId: user.company.id },
        }), 
        prisma.contractTerms.update({
          where:{id:contractId, contractorId:contractorId},
          data: {
            salary,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            notes,
            companyId: user.company.id,
            contractorId: contractorId,  
          },
        })]);

    revalidatePath(`/contractor/internal/${contractorId}`);
    revalidatePath("/dashboard/payroll/internal?tab=contractors");
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
    revalidatePath("/dashboard/payroll/internal?tab=contractors");
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
    revalidatePath("/dashboard/payroll/internal?tab=contractors");
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
    revalidatePath("/dashboard/payroll/internal?tab=contractors");
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
    revalidatePath("/dashboard/payroll/internal?tab=contractors");
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}



export async function getUpdateContractor(contractId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: "Unauthorized" }
  }

  try {
  
    const id = contractId;
 
    if (id) {
      const contractor = await prisma.contractor.findFirst({
        where: { id },
      });

      if (!contractor) {
        return  handleActionsPrismaError(new Error("Contractor not found."))
      }

      return contractor;
    }

    return handleActionsPrismaError(new Error("Contractor id not found."))
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}


export async function updateContractorData(contractorId:string, contractorData: editContractorSchemaType) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return {"error":"Unauthorized"};
    }

    const user = await prisma.user.findFirstOrThrow({ 
      where: { email: session.user.email as string }, include:{
        company:true
      }
    
    });
    if (!user ||! user.company)  
      return {"error": "Company not found"}
    await prisma.contractor.update({
      where:{id:contractorId},
      data:{
        firstName:contractorData.firstName,
        secondName:contractorData.secondName,
        email:contractorData.email,
        phoneNumber:contractorData.phoneNumber,
        address:contractorData.address,
        contractorID:contractorData.contractorID,
        nationalID:contractorData.nationalID,
        jobTitle:contractorData.jobTitle,
        department:contractorData.department,
      }

    })
   
    revalidatePath(`/contractor/internal/${contractorData.id}`);
    return Promise.resolve(contractorData);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

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

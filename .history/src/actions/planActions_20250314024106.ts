"use server"
import { prisma } from "@/utils/prismaDB";
import { revalidatePath } from "next/cache";
import { handleActionsPrismaError } from "@/lib/error-handler";
import {
  CompanyTierFormSchema,
  CompanyTierFormValues,
  PlanFormSchema,
  PlanFormValues,
 
} from '@/validations/plansSchema';
 


export async function addNewPlan(formData: PlanFormValues) {
  const result =  PlanFormSchema.safeParse(formData);

  if (!result.success) {
    const errorMessages = result.error.issues.reduce((prev, issue) => {
      return (prev += issue.message);
    }, '');
    return {
      error: errorMessages,
    };
  }

  try {
   
    const plan=await prisma.plan.create({
      data: { 
        name:formData.plan.name,
        companyTierId:formData.plan.companyTierId,
        price:formData.plan.price,
        isActive:formData.plan.isActive,
      }
    })
    
    formData.features.features.forEach(async(feature)=>{
      return await prisma.feature.create({data:{
        name:feature.name,
        description:feature.description,
        planId: plan.id

      }})
    })

     
    revalidatePath(`/management/plans`);
    return {message: "New plan created successfully"}
  } catch (error) {
    return handleActionsPrismaError(error)
  }
}


 


export async function addNewCompanyTier(formData: CompanyTierFormValues) {
  const result =  CompanyTierFormSchema.safeParse(formData);

  if (!result.success) {
    const errorMessages = result.error.issues.reduce((prev, issue) => {
      return (prev += issue.message);
    }, '');
    return {
      error: errorMessages,
    };
  }

  try {
   
    await prisma.companyTier.create({
      data: { 
        name:formData.companyTier.name,
        minEmployees:formData.companyTier.minEmployees,
        maxEmployees:formData.companyTier.maxEmployees,
      
      }
    })
    
   

     
    revalidatePath(`/management/plans`);
    return {message: "New plan created successfully"}
  } catch (error) {
    return handleActionsPrismaError(error)
  }
}


export async function getCompanyTiers() {
  try {
    const companyTiers = await prisma.companyTier.findMany()

    return companyTiers
  } catch (error) {
    return handleActionsPrismaError(error)
  }
}



 
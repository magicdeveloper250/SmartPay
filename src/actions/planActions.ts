"use server"
import { prisma } from "@/utils/prismaDB";
import { revalidatePath } from "next/cache";
import { handleActionsPrismaError } from "@/lib/error-handler";
import {
  CompanyTierFormSchema,
  CompanyTierFormValues,
  FeatureFormSchema,
  FeatureFormValues,
  OfferFormSchema,
  OfferFormValues,
  PlanFormSchema,
  PlanFormValues,
 
} from '@/validations/plansSchema';
 

export async function addNewPlan(formData: PlanFormValues) {
  const result = PlanFormSchema.safeParse(formData);

  if (!result.success) {
    const errorMessages = result.error.issues.map(issue => issue.message).join(', ');
    return { error: errorMessages };
  }

  try {
    const plan = await prisma.plan.create({
      data: { 
        name: formData.plan.name,
        companyTierId: formData.plan.companyTierId,
        price: formData.plan.price,
        isActive: formData.plan.isActive,
        isRecommended: formData.plan.isRecommended,
        features: {
          create: formData.features?.features?.map(feature => ({
            feature: {
              connect: { id: feature.id }
            }
          })) || []
        }
      },
      include: { features: true }
    });

    revalidatePath(`/management/plans`);
    return { message: "New plan created successfully", plan };
  } catch (error) {
 
    return handleActionsPrismaError(error);
  }
}



export async function addNewOffer(formData: OfferFormValues) {
   
  const result = OfferFormSchema.safeParse(formData);
  console.log(result.error?.errors)

  if (!result.success) {
    const errorMessages = result.error.issues.map((issue) => issue.message).join(', ');
    return { error: errorMessages };
  }

  try {
 
    const newOffer = await prisma.offer.create({
      data: {
        name: formData.offer.name,
        description: formData.offer.description,
        discountPercentage: formData.offer.discountPercentage,
        startDate: formData.offer.startDate,
        endDate: formData.offer.endDate,
        plan: { connect: { id: formData.plans.plans[0].id } },  
        includes: {
          create: [
            
            ...formData.plans.plans.map((plan) => ({
              plan: { connect: { id: plan.id } },
            })),
           
            ...formData.features.features.map((feature) => ({
              feature: { connect: { id: feature.id } },
            })),
          ],
        },
      },
      include: {
        includes: true,  
      },
    });
 
    revalidatePath('/management/plans');
 
    return { message: 'New offer created successfully', newOffer };
  } catch (error) {
    return handleActionsPrismaError(error);
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


export async function addNewFeature(formData: FeatureFormValues) {
  const result =  FeatureFormSchema.safeParse(formData);

  if (!result.success) {
    const errorMessages = result.error.issues.reduce((prev, issue) => {
      return (prev += issue.message);
    }, '');
    return {
      error: errorMessages,
    };
  }

  try {
   
     await prisma.feature.create({
      data: {
        name: formData.feature.name,
        description: formData.feature.description
      }
    });
    
   

     
    revalidatePath(`/management/plans`);
    return {message: "New Feature added successfully."}
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


export async function getFeatures() {
  try {
    const features = await prisma.feature.findMany()

    return features
  } catch (error) {
    return handleActionsPrismaError(error)
  }
}

export async function getPlansWithFeatures() {
  try {
    const plans = await prisma.plan.findMany({
      include: {
        features: {
          include:{
            feature:true
          }
        }
      }
    });

    return plans;
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}



export async function getPlans() {
  try {
    const plans = await prisma.plan.findMany( );

    return plans;
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}


export async function getOffersWithPlansAndFeatures() {
  try {
    const offers = await prisma.offer.findMany({
      include: {
        includes: {
          include: {
            plan: true,  
            feature: true,  
          },
        },
      
      },
    });

    return offers;
  } catch (error) {
    console.error('Error fetching offers:', error);
    return { error: 'Failed to fetch offers' };
  }
}


 
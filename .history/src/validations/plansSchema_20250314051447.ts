import { z } from 'zod'
 
export const PlanSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Plan name is required"),
  companyTierId: z.string().min(2, "Company tier id is required"),
  price:  z.number().min(1, "Plan price is required"),
  isActive: z.boolean(),
 
  
})
 
export const FeatureSchema = z.object({
  id: z.string().optional(), 
  name: z.string().min(3, "Name is required"),  
  description: z.string().min(3, "Description is required").optional(),  
});

 
export const PlanFeatureSchema = z.object({
  id: z.string().optional(),
  planId: z.string().min(1),
  featureId: z.string().min(1),
})

const CompanyTierSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Tax name is required"),
  minEmployees: z.number().min(0, "Minimum value must be at least 0"),
  maxEmployees:  z.number().min(0, "Max value must be at least 0")
});
 
const OfferSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Offer is required"),
  description: z.string().min(1, "Offer description is required"),
  discountAmount: z.number().min(0, "Discount amount is required."),
  discountPercentage:z.number().min(0, "Discount amount is required."),
  startDate: z.date(),
  endDate:z.date(),
  includes: z.array(z.string()),
  prerequisites:z.array(z.string())
});
 
const CompanyTiersArraySchema = z.object({
  companyTiers: z.array(CompanyTierSchema)
});
const OfferIncludeSchema = z.object({
  id: z.string().optional(),
  offerId: z.string().min(1, "Offer id is required"),
  planId: z.number().min(0, "Plan id is required"),
 
});
const FeaturesArraySchema = z.object({
  features: z.array(FeatureSchema)
});
const OfferArraySchema = z.object({
  includes: z.array(OfferSchema)
});



const PrerequisitesSchema = z.object({
  id: z.string().optional(),
  offerId: z.string().min(1, "Offer id is required"),
  planId: z.number().min(0, "Plan id is required"),
 
});

 
export const PlanFormSchema = z.object({
  plan: PlanSchema,
  features: FeaturesArraySchema,
 
 
})

export const FeatureFormSchema = z.object({
  feature: FeatureSchema
})

export const PlanFeatureFormSchema = z.object({
  planFeature: PlanFeatureSchema
})
 
export const CompanyTierFormSchema = z.object({
  companyTier: CompanyTierSchema
})
export const OfferFormSchema = z.object({
  offer: OfferSchema
})

export const OfferIncludeFormSchema = z.object({
  offerInclude: OfferSchema
})
export const prerequisitesFormSchema = z.object({
  prerequisites: PrerequisitesSchema
})
 

export type PlanFormValues = z.infer<typeof PlanFormSchema>
export type FeatureFormValues = z.infer<typeof FeatureFormSchema>
export type CompanyTierFormValues = z.infer<typeof CompanyTierFormSchema>
export type OfferFormValues = z.infer<typeof OfferFormSchema>  
export type Prerequisities = z.infer<typeof prerequisitesFormSchema >  
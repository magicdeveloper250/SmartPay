import { Prisma } from '@prisma/client';

 const OfferWithPlanAndFeatureData = Prisma.validator<Prisma.OfferFindFirstArgs>()({
    include: {
        
         includes:true,
         
        


        

         
   
      },
  })

  const PlanWithFeaturesData = Prisma.validator<Prisma.PlanFindFirstArgs>()({
   include: {
       
        features:{
         include:{
            feature:true
         }
        },
        
       


       

        
  
     },
 })

 

export type PlanWithFeaturesAndOffers = Prisma.PlanGetPayload<typeof PlanWithFeaturesAndOffersData>
export type PlanWithFeatures = Prisma.PlanGetPayload<typeof PlanWithFeaturesData>
import { Prisma } from '@prisma/client';

 const PlanWithFeaturesAndOffersData = Prisma.validator<Prisma.PlanFindFirstArgs>()({
    include: {
        
         features:true,
         offers:true,
        


        

         
   
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
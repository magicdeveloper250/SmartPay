import { Prisma } from '@prisma/client';

 const PlanWithFeaturesAndOffersData = Prisma.validator<Prisma.PlanFindFirstArgs>()({
    include: {
        
         features:true,
         offers:true,
        


        

         
   
      },
  })


 

export type PlanWithFeaturesAndOffers = Prisma.PlanGetPayload<typeof PlanWithFeaturesAndOffersData>
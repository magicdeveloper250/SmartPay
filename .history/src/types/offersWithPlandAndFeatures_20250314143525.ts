import { Prisma } from '@prisma/client';

 const OfferWithPlanAndFeatureData = Prisma.validator<Prisma.OfferFindFirstArgs>()({
    include: {
        
         includes:true,
 
   
      },
  })

  

 

export type OfferWithPlanAndFeature = Prisma.OfferGetPayload<typeof OfferWithPlanAndFeatureData>
 
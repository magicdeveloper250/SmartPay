import { Prisma } from '@prisma/client';

 const OfferWithPlanAndFeatureData = Prisma.validator<Prisma.OfferFindFirstArgs>()({
  include: {
    includes: {
      include: {
        plan: true,  
        feature: true,  
      },
    },
  
  },
  })

  

 

export type OfferWithPlanAndFeature = Prisma.OfferGetPayload<typeof OfferWithPlanAndFeatureData>
 
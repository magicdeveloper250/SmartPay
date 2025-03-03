import { Contractor, ContractTerms, } from "@prisma/client";
import { Prisma } from '@prisma/client';

 const ContractorWithContractorTermsData = Prisma.validator<Prisma.ContractorFindFirstArgs>()({
    include: {
        benefits: true,
        salaries: true,
        contractsTerms:true,
        appliedTaxes:true
      },
  })


 

export type ContractorWithContractorTerms = Prisma.ContractorGetPayload<typeof ContractorWithContractorTermsData>
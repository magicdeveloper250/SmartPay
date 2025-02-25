import { Prisma } from '@prisma/client';

const contractWithCompanyAndContractData = Prisma.validator<Prisma.ContractTermsArgs>()({
  include: {
    contractor: true,
    company: true
  }
})

export type contractWithCompanyAndContract = Prisma.ContractTermsGetPayload<typeof contractWithCompanyAndContractData>
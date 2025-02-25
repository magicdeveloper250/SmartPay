import { ContractTerms, Contractor, Company , Prisma} from '@prisma/client';


const contractWithCompanyAndContractData = Prisma.validator<Prisma.ContractTermsDefaultArgs>()({
  include: { contractor: true },
})
export type contractWithCompanyAndContract =  Prisma.PayrollGetPayload<typeof contractWithCompanyAndContractData>
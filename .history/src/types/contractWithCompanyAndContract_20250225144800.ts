import { ContractTerms, Contractor, Company } from '@prisma/client';

export type contractWithCompanyAndContract = ContractTerms & {
  contractor: Contractor;
  company: Company;
}
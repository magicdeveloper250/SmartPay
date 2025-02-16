import { Contractor, ContractTerms } from "@prisma/client";

export type ContractorWithContractorTerms = Contractor & {
  contractorTerms: {
    contractsTerms:ContractTerms
  };
};
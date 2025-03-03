import { Company } from "@prisma/client";

export type CompanyWithCount = Company & {
  _count?: {
    employees: number;
    contractors: number;
  };
};



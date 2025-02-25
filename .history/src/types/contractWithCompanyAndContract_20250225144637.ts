import { MainPayroll, Payroll, Employee, AdditionalIncome, Benefit, Deduction, AppliedTax, Prisma } from "@prisma/client";
const contractWithCompanyAndContractData = Prisma.validator<Prisma.ContractTermsDefaultArgs>()({
  include: { contractor: true, company:true },
})

export type contractWithCompanyAndContract = Prisma.PayrollGetPayload<typeof contractWithCompanyAndContractData>
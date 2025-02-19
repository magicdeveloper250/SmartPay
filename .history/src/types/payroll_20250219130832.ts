import {   MainPayroll, Payroll, Employee, AdditionalIncome, Benefit, Deduction, AppliedTax } from "@prisma/client";
export type MainPayrollWithRelations = MainPayroll & {
  payrolls: (Payroll & {
    employee: Employee;
    additionalIncomes: AdditionalIncome[];
    benefits: Benefit[];
    deductions: Deduction[];
    taxes: AppliedTax[];
  })[];
};
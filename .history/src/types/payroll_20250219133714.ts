import { MainPayroll, Payroll, Employee, AdditionalIncome, Benefit, Deduction, AppliedTax } from "@prisma/client";


type MainPayrollWithRelations = MainPayroll & {
  payrolls: ({
    employee: Employee | null; // Allow null values here
    additionalIncomes: AdditionalIncome[];
    benefits: Benefit[];
    deductions: Deduction[];
    taxes: AppliedTax[];
  })[];
};


export type PrismaErrorResponse = {
  error: string;
  code?: string;
  details?: unknown;
};

export type PayrollReturnType =
  | MainPayrollWithRelations
  | PrismaErrorResponse;
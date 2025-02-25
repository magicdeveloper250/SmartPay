import { MainPayroll, Payroll, Employee, AdditionalIncome, Benefit, Deduction, AppliedTax, Prisma } from "@prisma/client";

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


 const payrollWithEmployeeData = Prisma.validator<Prisma.PayrollDefaultArgs>()({
    include: { employee: true },
  })

  export type payrollWithEmployee = Prisma.PayrollGetPayload<typeof payrollWithEmployeeData>

  const payrollWithContractorData = Prisma.validator<Prisma.PayrollDefaultArgs>()({
    include: { contractor: true },
  })

  export type payrollWithContractor = Payroll & {
    contractor: {
      id: string;
      firstName: string;
      secondName: string;
      company: {
        name: string;
      };
    } | null;
  };

  export type PayrollWithPerson = payrollWithEmployee | payrollWithContractor;
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

  export type payrollWithContractor = Prisma.PayrollGetPayload<typeof payrollWithContractorData>

  export type PayrollWithPerson = payrollWithEmployee | payrollWithContractor;
  export type PayrollHistoryData = {
    months: string[];
    paidAmounts: number[];
    dueAmounts: number[];
    totalPaid: number;
    totalDue: number;
    currency:string;
  };

  export enum PayrollTimeRange {
    THISMONTH = "THISMONTH",
    LASTMONTH = "LASTMONTH",
    THISYEAR = "THISYEAR",
    LASTYEAR = "LASTYEAR",
    LAST3MONTHS = "LAST3MONTHS",
    LAST6MONTHS = "LAST6MONTHS",
    LAST12MONTHS = "LAST12MONTHS",
  }
  
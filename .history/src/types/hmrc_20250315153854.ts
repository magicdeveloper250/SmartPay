import type {  SupportedRwandaTaxYear,
  Country,
  RwandaTaxRates, } from "./taxes";

const rwandaTaxRates: Record<SupportedRwandaTaxYear, RwandaTaxRates> = {
  "2023": {
    COUNTRY: "Rwanda",
    // Income tax
    DEFAULT_PERSONAL_ALLOWANCE: 300_000,
    LOWER_BRACKET: 360_000,
    MIDDLE_BRACKET: 1_200_000,
    UPPER_BRACKET: 3_000_000,
    LOWER_RATE: 0.2,
    MIDDLE_RATE: 0.3,
    UPPER_RATE: 0.4,
    // Pension contributions
    PENSION_EMPLOYEE_RATE: 0.05,
    PENSION_EMPLOYER_RATE: 0.05,
    PENSION_TOTAL_RATE: 0.1,
    PENSION_ANNUAL_ALLOWANCE: 1_000_000,
    PENSION_MINIMUM_ANNUAL_ALLOWANCE: 100_000,
  },
  "2024": {
    COUNTRY: "Rwanda",
    // Income tax
    DEFAULT_PERSONAL_ALLOWANCE: 300_000,
    LOWER_BRACKET: 360_000,
    MIDDLE_BRACKET: 1_200_000,
    UPPER_BRACKET: 3_000_000,
    LOWER_RATE: 0.2,
    MIDDLE_RATE: 0.3,
    UPPER_RATE: 0.4,
    // Pension contributions
    PENSION_EMPLOYEE_RATE: 0.05,
    PENSION_EMPLOYER_RATE: 0.05,
    PENSION_TOTAL_RATE: 0.1,
    PENSION_ANNUAL_ALLOWANCE: 1_000_000,
    PENSION_MINIMUM_ANNUAL_ALLOWANCE: 100_000,
  },
  "2025": {
    COUNTRY: "Rwanda",
    // Income tax
    DEFAULT_PERSONAL_ALLOWANCE: 300_000,
    LOWER_BRACKET: 360_000,
    MIDDLE_BRACKET: 1_200_000,
    UPPER_BRACKET: 3_000_000,
    LOWER_RATE: 0.2,
    MIDDLE_RATE: 0.3,
    UPPER_RATE: 0.4,
    // Pension contributions
    PENSION_EMPLOYEE_RATE: 0.05,
    PENSION_EMPLOYER_RATE: 0.05,
    PENSION_TOTAL_RATE: 0.1,
    PENSION_ANNUAL_ALLOWANCE: 1_000_000,
    PENSION_MINIMUM_ANNUAL_ALLOWANCE: 100_000,
  },
};

interface Options {
  taxYear?: SupportedRwandaTaxYear;
  country?: Country | undefined;
}

export const getRwandaTaxRates = (
  options?: Options
): RwandaTaxRates => {
  const taxYearToUse = options?.taxYear ?? "2024";

  if (!rwandaTaxRates.hasOwnProperty(taxYearToUse)) {
    throw new Error(
      `Tax Year ${taxYearToUse} is not currently supported for Rwanda`
    );
  }

  return rwandaTaxRates[taxYearToUse];
};

export function isRwandaTaxRates(
  taxRates: RwandaTaxRates
): taxRates is RwandaTaxRates {
  return taxRates.COUNTRY === "Rwanda";
}

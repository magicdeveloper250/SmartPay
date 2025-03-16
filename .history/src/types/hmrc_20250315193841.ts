import type {  SupportedRwandaTaxYear,
  Country,
  RwandaTaxRates, } from "./taxes";

  

  const rwandaTaxRates: Record<SupportedRwandaTaxYear, RwandaTaxRates> = {
    "2023": {
      COUNTRY: "Rwanda",
      // Income tax
      DEFAULT_PERSONAL_ALLOWANCE: 60_000, // Updated to reflect the new tax-free threshold
      LOWER_BRACKET: 100_000, // Updated to reflect the new lower bracket
      MIDDLE_BRACKET: 200_000, // Updated to reflect the new middle bracket
      UPPER_BRACKET: 200_001, // Updated to reflect the new upper bracket
      LOWER_RATE: 0.1, // Updated to reflect the new tax rate for the lower bracket
      MIDDLE_RATE: 0.2, // Updated to reflect the new tax rate for the middle bracket
      UPPER_RATE: 0.3, // Updated to reflect the new tax rate for the upper bracket
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
      DEFAULT_PERSONAL_ALLOWANCE: 60_000, // Updated to reflect the new tax-free threshold
      LOWER_BRACKET: 100_000, // Updated to reflect the new lower bracket
      MIDDLE_BRACKET: 200_000, // Updated to reflect the new middle bracket
      UPPER_BRACKET: 200_001, // Updated to reflect the new upper bracket
      LOWER_RATE: 0.1, // Updated to reflect the new tax rate for the lower bracket
      MIDDLE_RATE: 0.2, // Updated to reflect the new tax rate for the middle bracket
      UPPER_RATE: 0.3, // Updated to reflect the new tax rate for the upper bracket
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
      DEFAULT_PERSONAL_ALLOWANCE: 60_000, // Updated to reflect the new tax-free threshold
      LOWER_BRACKET: 100_000, // Updated to reflect the new lower bracket
      MIDDLE_BRACKET: 200_000, // Updated to reflect the new middle bracket
      UPPER_BRACKET: 200_001, // Updated to reflect the new upper bracket
      LOWER_RATE: 0.1, // Updated to reflect the new tax rate for the lower bracket
      MIDDLE_RATE: 0.2, // Updated to reflect the new tax rate for the middle bracket
      UPPER_RATE: 0.3, // Updated to reflect the new tax rate for the upper bracket
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

export interface RwandaIncomeTax {
  incomeTaxType: "Rwanda";
  total: number;
  breakdown: {
    lowerBracketTax: number;
    middleBracketTax: number;
    upperBracketTax: number;
  };
}

export type SupportedRwandaTaxYear = "2023" | "2024" | "2025";

export type TaxYear = SupportedRwandaTaxYear;

// Rwanda has its own income tax structure
export type Country = "Rwanda";

interface BasicTaxRates {
  COUNTRY: Country;

  // Income Tax
  // Based on Rwandan tax brackets (current rates can be found at RRA: https://www.rra.gov.rw/)
  DEFAULT_PERSONAL_ALLOWANCE: number;
  LOWER_BRACKET: number;
  LOWER_RATE: number;
  MIDDLE_BRACKET: number;
  MIDDLE_RATE: number;
  UPPER_BRACKET: number;
  UPPER_RATE: number;

  // Pension allowances (if applicable)
  PENSION_ANNUAL_ALLOWANCE: number;
  PENSION_MINIMUM_ANNUAL_ALLOWANCE: number;
}

export interface RwandaTaxRates extends BasicTaxRates {
  COUNTRY: "Rwanda";

  // Tax brackets
  LOWER_BRACKET: number;
  LOWER_RATE: number;

  MIDDLE_BRACKET: number;
  MIDDLE_RATE: number;

  UPPER_BRACKET: number;
  UPPER_RATE: number;
  PENSION_EMPLOYEE_RATE: number,  
  PENSION_EMPLOYER_RATE: number, 
  PENSION_TOTAL_RATE: number, 
  DEFAULT_PERSONAL_ALLOWANCE:number
}

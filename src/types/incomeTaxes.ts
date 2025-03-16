import { getRwandaTaxRates, isRwandaTaxRates } from "./hmrc";

import type { RwandaIncomeTax, TaxYear, Country, RwandaTaxRates, SupportedRwandaTaxYear } from "./taxes";

function calculateRwandaTaxes({
  taxRates,
  taxableAnnualIncome,
  personalAllowance,
}: {
  taxRates: RwandaTaxRates;
  taxableAnnualIncome: number;
  personalAllowance: number;
}): RwandaIncomeTax {
  const {
    DEFAULT_PERSONAL_ALLOWANCE,
    LOWER_BRACKET,
    MIDDLE_BRACKET,
    UPPER_BRACKET,
    LOWER_RATE,
    MIDDLE_RATE,
    UPPER_RATE,
  } = taxRates;

  const adjustedTaxableIncome =
    taxableAnnualIncome <= DEFAULT_PERSONAL_ALLOWANCE
      ? 0
      : taxableAnnualIncome - personalAllowance;
 

  let lowerBracketTax = 0;
  let middleBracketTax = 0;
  let upperBracketTax = 0;

  if (adjustedTaxableIncome <= 60000) { 
    lowerBracketTax= 0; 
    } else if ((adjustedTaxableIncome > 60000) && (adjustedTaxableIncome <= 100000)) { 
        lowerBracketTax= 0.1 * (adjustedTaxableIncome - 60000); 
    } 
    else if ((adjustedTaxableIncome > 100000) && (adjustedTaxableIncome <= 200000)) { 
        middleBracketTax= 0.2 * (adjustedTaxableIncome - 100000)+ (0.1*40000); 
    }
    else if (adjustedTaxableIncome > 200000){
    upperBracketTax = 0.3 * (adjustedTaxableIncome - 200000)+ (0.2*100000)+ (0.1*40000);
}

  

  return {
    total: lowerBracketTax + middleBracketTax + upperBracketTax,
    incomeTaxType: "Rwanda",
    breakdown: {
      lowerBracketTax,
      middleBracketTax,
      upperBracketTax,
    },
  };
}
function isSupportedTaxYear(year: string): year is SupportedRwandaTaxYear {
  return ["2023", "2024", "2025"].includes(year);
}
export function getCurrentSupportedTaxYear(): TaxYear {
  const currentYear = new Date().getFullYear().toString();
  
  // Check if current year is in supported tax years
  if (isSupportedTaxYear(currentYear)) {
    return currentYear;
  }
  
  // If current year is not supported, return the latest supported year
  return "2025"; // Return the latest supported year as fallback
}
// Rwanda-only tax calculator
export const calculateRwandaIncomeTax = ({
  taxYear,
  taxableAnnualIncome,
  personalAllowance,
}: {
  taxYear?: TaxYear;
  taxableAnnualIncome: number;
  personalAllowance: number;
}): RwandaIncomeTax => {
  const taxRates = getRwandaTaxRates({ taxYear, country: "Rwanda" });

  if (!isRwandaTaxRates(taxRates)) {
    throw new Error("Invalid tax rates for Rwanda");
  }

  return calculateRwandaTaxes({
    taxRates,
    taxableAnnualIncome,
    personalAllowance,
  });
};

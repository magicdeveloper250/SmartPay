import { getRwandaTaxRates, isRwandaTaxRates } from "./hmrc";

import type { RwandaIncomeTax, TaxYear, Country, RwandaTaxRates } from "./taxes";

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

  if (adjustedTaxableIncome > 0) {
    const lowerAmount =
      adjustedTaxableIncome < LOWER_BRACKET
        ? adjustedTaxableIncome
        : LOWER_BRACKET;
    lowerBracketTax = lowerAmount * LOWER_RATE;
  }

  if (adjustedTaxableIncome > LOWER_BRACKET) {
    const middleAmount =
      adjustedTaxableIncome > MIDDLE_BRACKET
        ? MIDDLE_BRACKET - LOWER_BRACKET
        : adjustedTaxableIncome - LOWER_BRACKET;
    middleBracketTax = middleAmount * MIDDLE_RATE;
  }

  if (adjustedTaxableIncome > MIDDLE_BRACKET) {
    const upperAmount = adjustedTaxableIncome - MIDDLE_BRACKET;
    upperBracketTax = upperAmount * UPPER_RATE;
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

// Rwanda-only tax calculator
export const calculateIncomeTax = ({
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

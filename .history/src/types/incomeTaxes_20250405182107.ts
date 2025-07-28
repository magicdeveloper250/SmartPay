import { getRwandaTaxRates, isRwandaTaxRates } from "./hmrc";
import { PredefinedTax } from "@prisma/client";

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



export const displayRwandaIncomeTax = ({
  taxYear,
  salary,
}: {
  taxYear?: TaxYear;
  salary: number;
}) => {

  return ` 
          
  <div className="absolute z-10 bg-white p-4 border border-gray-300 rounded-lg shadow-lg top-10 left-1/2 transform -translate-x-1/2 w-80 max-w-[90vw] overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 border border-gray-300">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" className="px-2 py-3 border border-gray-300">Bracket</th>
          <th scope="col" className="px-2 py-3 border border-gray-300">Income Range</th>
          <th scope="col" className="px-2 py-3 border border-gray-300">Tax Rate</th>
          <th scope="col" className="px-2 py-3 border border-gray-300">Tax Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-white border-b border-gray-300 hover:bg-gray-50">
          <td className="px-2 py-2 border border-gray-300">Lower Bracket</td>
          <td className="px-2 py-2 border border-gray-300">0 - 60,000 RWF</td>
          <td className="px-2 py-2 border border-gray-300">10%</td>
          <td className="px-2 py-2 border border-gray-300">
            ${new Intl.NumberFormat('en-US', { style: 'currency', currency: "RWF" }).format(
              calculateRwandaIncomeTax({
                taxYear: taxYear,
                taxableAnnualIncome: Math.min(salary, 60000),
                personalAllowance: 0,
              }).total
            )}
          </td>
        </tr>
        <tr className="bg-white border-b border-gray-300 hover:bg-gray-50">
          <td className="px-2 py-2 border border-gray-300">Middle Bracket</td>
          <td className="px-2 py-2 border border-gray-300">60,001 - 100,000 RWF</td>
          <td className="px-2 py-2 border border-gray-300">20%</td>
          <td className="px-2 py-2 border border-gray-300">
            ${new Intl.NumberFormat('en-US', { style: 'currency', currency: "RWF" }).format(
              calculateRwandaIncomeTax({
                taxYear: taxYear,
                taxableAnnualIncome: Math.min(salary, 100000),
                personalAllowance: 60000,
              }).total
            )}
          </td>
        </tr>
        <tr className="bg-white hover:bg-gray-50">
          <td className="px-2 py-2 border border-gray-300">Upper Bracket</td>
          <td className="px-2 py-2 border border-gray-300">100,001 RWF and above</td>
          <td className="px-2 py-2 border border-gray-300">30%</td>
          <td className="px-2 py-2 border border-gray-300">
            ${new Intl.NumberFormat('en-US', { style: 'currency', currency: "RWF" }).format(
              calculateRwandaIncomeTax({
                taxYear: taxYear,
                taxableAnnualIncome: salary,
                personalAllowance: 100000,
              }).total
            )}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

          `
}


export function explainTaxCalculation({
  taxRates,
  taxableAnnualIncome,
  personalAllowance,
}: {
  taxRates: RwandaTaxRates;
  taxableAnnualIncome: number;
  personalAllowance: number;
}): string {
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

  let explanation = `Tax Calculation Breakdown:\n\n`;
  explanation += `1. Taxable Annual Income: ${taxableAnnualIncome} RWF\n`;
  explanation += `2. Personal Allowance: ${personalAllowance} RWF\n`;
  explanation += `3. Adjusted Taxable Income: ${adjustedTaxableIncome} RWF\n\n`;

  let lowerBracketTax = 0;
  let middleBracketTax = 0;
  let upperBracketTax = 0;

  if (adjustedTaxableIncome <= 60000) {
    explanation += `- Income falls within the tax-free bracket (0 - 60,000 RWF).\n`;
    explanation += `- Tax on this bracket: 0 RWF\n`;
  } else if (adjustedTaxableIncome > 60000 && adjustedTaxableIncome <= 100000) {
    lowerBracketTax = 0.1 * (adjustedTaxableIncome - 60000);
    explanation += `- Income falls within the lower bracket (60,001 - 100,000 RWF).\n`;
    explanation += `- Taxable amount in this bracket: ${adjustedTaxableIncome - 60000} RWF\n`;
    explanation += `- Tax rate: 10%\n`;
    explanation += `- Tax on this bracket: ${lowerBracketTax} RWF\n`;
  } else if (adjustedTaxableIncome > 100000 && adjustedTaxableIncome <= 200000) {
    lowerBracketTax = 0.1 * 40000; // 10% of the 40,000 RWF in the lower bracket
    middleBracketTax = 0.2 * (adjustedTaxableIncome - 100000);
    explanation += `- Income falls within the middle bracket (100,001 - 200,000 RWF).\n`;
    explanation += `- Taxable amount in the lower bracket: 40,000 RWF\n`;
    explanation += `- Tax rate on lower bracket: 10%\n`;
    explanation += `- Tax on lower bracket: ${lowerBracketTax} RWF\n`;
    explanation += `- Taxable amount in the middle bracket: ${adjustedTaxableIncome - 100000} RWF\n`;
    explanation += `- Tax rate on middle bracket: 20%\n`;
    explanation += `- Tax on middle bracket: ${middleBracketTax} RWF\n`;
  } else if (adjustedTaxableIncome > 200000) {
    lowerBracketTax = 0.1 * 40000; // 10% of the 40,000 RWF in the lower bracket
    middleBracketTax = 0.2 * 100000; // 20% of the 100,000 RWF in the middle bracket
    upperBracketTax = 0.3 * (adjustedTaxableIncome - 200000);
    explanation += `- Income falls within the upper bracket (200,001 RWF and above).\n`;
    explanation += `- Taxable amount in the lower bracket: 40,000 RWF\n`;
    explanation += `- Tax rate on lower bracket: 10%\n`;
    explanation += `- Tax on lower bracket: ${lowerBracketTax} RWF\n`;
    explanation += `- Taxable amount in the middle bracket: 100,000 RWF\n`;
    explanation += `- Tax rate on middle bracket: 20%\n`;
    explanation += `- Tax on middle bracket: ${middleBracketTax} RWF\n`;
    explanation += `- Taxable amount in the upper bracket: ${adjustedTaxableIncome - 200000} RWF\n`;
    explanation += `- Tax rate on upper bracket: 30%\n`;
    explanation += `- Tax on upper bracket: ${upperBracketTax} RWF\n`;
  }

  const totalTax = lowerBracketTax + middleBracketTax + upperBracketTax;
  explanation += `\nTotal Tax Payable: ${totalTax} RWF\n`;

  return explanation;
}



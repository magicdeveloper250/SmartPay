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



export const displayRwandaIncomeTax = ({ taxYear, salary }) => {
  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: "RWF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate total tax amount
  const totalTax = calculateRwandaIncomeTax({
    taxYear,
    taxableAnnualIncome: salary,
    personalAllowance: 0,
  }).total;

  return `
    <div class="group relative">
      <!-- Tax button/trigger -->
      <button class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span>View Tax Breakdown</span>
      </button>

      <!-- Dropdown content -->
      <div class="hidden group-hover:block absolute z-10 mt-2 transform -translate-x-1/4 w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 rounded-t-lg">
          <h3 class="text-lg font-semibold text-white text-center">
            Rwanda Income Tax Breakdown ${taxYear ? `(${taxYear})` : ''}
          </h3>
        </div>

        <!-- Tax table -->
        <div class="p-6">
          <div class="overflow-hidden rounded-lg border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bracket</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income Range (RWF)</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Amount</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-600">Lower Bracket</td>
                  <td class="px-4 py-3 text-sm text-gray-900">0 - 60,000</td>
                  <td class="px-4 py-3 text-sm text-gray-900">10%</td>
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">
                    ${formatCurrency(
                      calculateRwandaIncomeTax({
                        taxYear: taxYear,
                        taxableAnnualIncome: Math.min(salary, 60000),
                        personalAllowance: 0,
                      }).total
                    )}
                  </td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-600">Middle Bracket</td>
                  <td class="px-4 py-3 text-sm text-gray-900">60,001 - 100,000</td>
                  <td class="px-4 py-3 text-sm text-gray-900">20%</td>
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">
                    ${formatCurrency(
                      calculateRwandaIncomeTax({
                        taxYear: taxYear,
                        taxableAnnualIncome: Math.min(salary, 100000),
                        personalAllowance: 60000,
                      }).total
                    )}
                  </td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-600">Upper Bracket</td>
                  <td class="px-4 py-3 text-sm text-gray-900">100,001+</td>
                  <td class="px-4 py-3 text-sm text-gray-900">30%</td>
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">
                    ${formatCurrency(
                      calculateRwandaIncomeTax({
                        taxYear: taxYear,
                        taxableAnnualIncome: salary,
                        personalAllowance: 100000,
                      }).total
                    )}
                  </td>
                </tr>
                ${salary > 100000 ? `
                <tr class="bg-blue-50">
                  <td class="px-4 py-3 text-sm font-semibold text-gray-900" colspan="3">Total Tax</td>
                  <td class="px-4 py-3 text-sm font-bold text-blue-700">
                    ${formatCurrency(totalTax)}
                  </td>
                </tr>
                ` : ''}
              </tbody>
            </table>
          </div>

          ${salary > 0 ? `
          <div class="mt-4 flex items-center justify-between text-sm">
            <div class="text-gray-500">Annual Salary: ${new Intl.NumberFormat('en-US').format(salary)} RWF</div>
            <div class="text-gray-500">Effective Tax Rate: ${((totalTax / salary) * 100).toFixed(1)}%</div>
          </div>
          ` : ''}
        </div>

        <!-- Footer -->
        <div class="px-6 py-3 bg-gray-50 text-xs text-gray-500 rounded-b-lg">
          * Tax rates according to Rwanda Revenue Authority
        </div>
      </div>
    </div>
  `;
};


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



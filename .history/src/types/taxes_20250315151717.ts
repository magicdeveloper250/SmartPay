export interface RwandaIncomeTax {
  incomeTaxType: "Rwanda";
  total: number;
  breakdown: {
    basicRateTax: number;
    higherRateTax: number;
    additionalRateTax: number;
  };
}
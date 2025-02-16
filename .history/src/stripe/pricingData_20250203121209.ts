import { Price } from "@/types/price";

export const pricingData: Price[] = [
  {
    id: "price_1NQk5TLtGdPVhGLecVfQ7mn0",
    unit_amount: 2000, // $20 per month
    nickname: "Payroll Core + Simple Start",
    offers: [
      "Calculate employee payments",
      "Basic accounting tools",
      "Save 50% for the first 3 months",
      "Supports up to 10 employees",
    ],
  },
  {
    id: "price_1NQk55LtGdPVhGLefU8AHqHr",
    unit_amount: 4000, // $40 per month
    nickname: "Payroll Core + Essentials",
    offers: [
      "Calculate employee payments",
      "Direct deposit to employee bank accounts",
      "Lifetime access to basic reports",
      "Save 50% for the first 3 months",
      "Supports up to 50 employees",
    ],
  },
  {
    id: "price_1NQk4eLtGdPVhGLeZsZDsCNz",
    unit_amount: 8000, // $80 per month
    nickname: "Payroll Premium + Plus",
    offers: [
      "Calculate employee payments",
      "Direct deposit to employee bank accounts",
      "Lifetime access to advanced reports",
      "Save 50% for the first 3 months",
      "Overtime and bonuses calculations",
      "Tax compliance and filing assistance",
      "Supports unlimited employees",
    ],
  },
];

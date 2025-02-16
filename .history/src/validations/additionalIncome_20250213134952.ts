import { Currency, IncomeType, PaymentStatus } from "@prisma/client";  
import * as z from "zod";

export const additionalIncomeSchema = z.object({
  amount: z.union([z.string(), z.number()])
    .transform((val) => Number(val))
    .pipe(z.number().positive("Amount must be positive")),
  effective_date: z.string().min(1, "Effective date is required"),
  description: z.string().optional(),
  income_type: z.nativeEnum(IncomeType, { message: "Invalid income type selected" }),
  payment_status: z.nativeEnum(PaymentStatus, { message: "Invalid payment status selected" }).optional(),
  payment_date: z.string().optional(),
  currency: z.nativeEnum(Currency, { message: "Invalid currency selected" }).default("USD"),
  payroll_id: z.string().optional(),
  created_by: z.string().min(1, "Created by is required"),
  updated_by: z.string().optional(),
  is_taxable: z.boolean().default(true),
  tax_id: z.string().optional(),
}).refine((data) => {
  if (data.payment_status === "Paid" && !data.payment_date) {
    return false;
  }
  return true;
}, {
  message: "Payment date is required when payment status is 'Completed'.",
  path: ["payment_date"],
});

export type AdditionalIncomeSchemaType = z.infer<typeof additionalIncomeSchema>;
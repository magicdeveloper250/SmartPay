import { IncomeType, PaymentStatus } from "@prisma/client";  
import * as z from "zod";

export const additionalIncomeSchema = z.object({
  amount: z.union([z.string(), z.number()])
    .transform((val) => Number(val))
    .pipe(z.number().positive("Amount must be positive")),
  effective_date: z.string().min(1, "Effective date is required"),
  description: z.string().optional(),
  income_type: z.nativeEnum(IncomeType, { message: "Invalid income type selected" }),
  payment_status: z.nativeEnum(PaymentStatus, { message: "Invalid payment status selected" }).optional(),
}) 

export type AdditionalIncomeSchemaType = z.infer<typeof additionalIncomeSchema>;
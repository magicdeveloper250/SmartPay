import * as z from "zod";

export const deductionSchema = z.object({
  amount: z.union([z.string(), z.number()])
    .transform((val) => Number(val))
    .pipe(z.number().positive("Amount must be positive")),
 
  reason: z.string().min(1, "Reason is required."),
}) ;

export type deductionSchemaType = z.infer<typeof deductionSchema>;
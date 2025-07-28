import { Currency } from "@prisma/client"; 
import * as z from "zod";

export const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  pensionCode: z.string().min(1, "Company Registration number is required"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  onBoardingFinished: z.boolean().optional().default(true),
  planId: z.string().optional(),
}) 

export type CompanySchemaType = z.infer<typeof companySchema>;

export const editCompanySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  pensionCode: z.string().min(1, "Pension code is required"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  onBoardingFinished: z.boolean().optional(),
  planId: z.string().optional(),
});

export type EditCompanySchemaType = z.infer<typeof editCompanySchema>;
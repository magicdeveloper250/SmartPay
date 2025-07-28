import { Currency } from "@prisma/client";
import * as z from "zod";

export const companySchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  pensionCode: z.string().min(1, "Pension code is required"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  onBoardingFinished: z.boolean().optional().default(true),
  planId: z.string().optional(),
  userPhoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
  adminName: z.string().min(2, "User name must be at least 2 characters").optional(),
  adminnEmail: z.string().email("Invalid user email").optional(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
  adminImage: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  adminEmail: z.string().email("Invalid user email").optional(),
}) 

export type CompanySchemaType = z.infer<typeof companySchema>;

export const editCompanySchema = z.object({
  id: z.string().optional(),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  pensionCode: z.string().min(1, "Pension code is required"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  onBoardingFinished: z.boolean().optional(),
  planId: z.string().optional(),

  adminName: z.string().min(2, "User name must be at least 2 characters").optional(),
  adminEmail: z.string().email("Invalid user email").optional(),
  adminImage: z.string().optional(),
});

export type EditCompanySchemaType = z.infer<typeof editCompanySchema>;

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
  image: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  companyId: z.string().min(1, "Company ID is required"),
});

export type UserSchemaType = z.infer<typeof userSchema>;

export const editUserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
  image: z.string().optional(),
  companyId: z.string().min(1, "Company ID is required").optional(),
});

export type EditUserSchemaType = z.infer<typeof editUserSchema>;
import { Currency, Gender, PaymentFrequency } from "@prisma/client"; // Import Prisma enum
import * as z from "zod";

import { z } from "zod";
import { Gender, Currency, PaymentFrequency } from "./enums"; // adjust import if needed

const baseSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters")
    .regex(/^[A-Za-z-' ]+$/, "Invalid name format"),

  secondName: z.string()
    .min(2, "Second name must be at least 2 characters")
    .max(50, "Second name must be at most 50 characters")
    .regex(/^[A-Za-z-' ]+$/, "Invalid name format"),

  email: z.string().email("Invalid email address"),

  phoneNumber: z.string()
    .regex(/^\+?[0-9\s\-()]{7,15}$/, "Invalid phone number format"),

  address: z.string()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address must be at most 100 characters")
    .regex(/^[A-Za-z0-9\s,.'-]+$/, "Invalid address format"),

  dob: z.coerce.date().refine(date => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= 16 && age <= 120;
  }, "Age must be between 16 and 120"),

  gender: z.nativeEnum(Gender, { message: "Invalid gender selected" }),

  employeeID: z.string().optional(),

  nationalID: z.string()
    .length(16, "National ID must be exactly 16 digits")
    .regex(/^1\d{15}$/, "Invalid Rwandan National ID. Must start with '1'"),

  jobTitle: z.string()
    .min(2, "Job title must be at least 2 characters"),

  currency: z.nativeEnum(Currency, { message: "Invalid currency selected" }),

  paymentFrequency: z.nativeEnum(PaymentFrequency, { message: "Invalid payment frequency selected" }),

  department: z.string()
    .min(2, "Department must be at least 2 characters"),

  Domicile: z.string().optional(),

  startDate: z.coerce.date(),

  monthlyGross: z.union([z.string(), z.number()])
    .transform((val) => Number(val))
    .pipe(z.number().positive("Monthly salary must be positive")),
});

const bankSchema = baseSchema.extend({
  paymentMethod: z.literal("bank"),
  bankName: z.string().min(1, "Bank Name is required"),
  bankAccountNumber: z.string().min(1, "Bank Account Number is required"),
  swiftCode: z.string().min(1, "SWIFT Code is required"),
});

const cryptoSchema = baseSchema.extend({
  paymentMethod: z.literal("crypto"),
  walletAddress: z.string().min(1, "Wallet address is required"),
});

const phoneSchema = baseSchema.extend({
  paymentMethod: z.literal("phone"),
  paymentPhone: z.string()
    .regex(/^\+?[0-9\s\-()]{7,15}$/, "Invalid phone number format"),
});

export const employeeSchema = z.discriminatedUnion("paymentMethod", [
  bankSchema,
  cryptoSchema,
  phoneSchema,
]);

export type employeeSchemaType = z.infer<typeof employeeSchema>;





export const editEmployeeSchema = z.object({
  id: z.string().optional(),
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters")
    .regex(/^[A-Za-z-' ]+$/, "Invalid name format"),

  secondName: z.string()
    .min(2, "Second name must be at least 2 characters")
    .max(50, "Second name must be at most 50 characters")
    .regex(/^[A-Za-z-' ]+$/, "Invalid name format"),

  email: z.string().email("Invalid email address"),

  phoneNumber: z.string()
    .regex(/^\+?[0-9\s\-()]{7,15}$/, "Invalid phone number format"),

 

  address: z.string()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address must be at most 100 characters")
    .regex(/^[A-Za-z0-9\s,.'-]+$/, "Invalid address format"),

  dob: z.coerce.date().refine(date => {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 16 && age <= 120;
    }, "Age must be between 16 and 120"),

  gender: z.nativeEnum(Gender, { message: "Invalid gender selected" }),

  employeeID: z.string()
    .optional(),

  nationalID: z.string()
    .length(16, "National ID must be exactly 16 digits")
    .regex(/^1\d{15}$/, "Invalid Rwandan National ID. Must start with '1'"),

  jobTitle: z.string()
    .min(2, "Job title must be at least 2 characters"),

  currency: z.nativeEnum(Currency, { message: "Invalid currency selected" }),
  paymentFrequency: z.nativeEnum(PaymentFrequency, { message: "Invalid Payment frequency selected" }),

  department: z.string()
    .min(2, "Department must be at least 2 characters"),


  Domicile: z.string().optional(),

 

  startDate: z.coerce.date(),

  monthlyGross: z.union([z.string(), z.number()])
    .transform((val) => Number(val))
    .pipe(z.number().positive("Monthly salary must be positive")),
}) 


export type editEmployeeSchemaType = z.infer<typeof editEmployeeSchema>;

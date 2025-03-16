import { Currency, Gender, PaymentFrequency } from "@prisma/client"; // Import Prisma enum
import * as z from "zod";

export const employeeSchema = z.object({
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

  paymentPhone: z.string()
    .regex(/^\+?[0-9\s\-()]{7,15}$/, "Invalid phone number format")
    .optional(),

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

  bankName: z.string()
    .min(1, "Bank Name is required")
    .optional(),

  bankAccountNumber: z.string()
    .min(1, "Bank Account Number is required")
    .optional(),

  swiftCode: z.string()
    .min(1, "SWIFT Code is required")
    .optional(),

  paymentMethod: z.enum(["crypto", "bank", "phone"]),

  Domicile: z.string().optional(),

  walletAddress: z.string()
    .min(1, "Wallet address is required")
    .optional(),

  startDate: z.coerce.date(),

  monthlyGross: z.union([z.string(), z.number()])
    .transform((val) => Number(val))
    .pipe(z.number().positive("Monthly salary must be positive")),
}).refine((data) => {
  if (data.paymentMethod === "bank") {
    return !!data.bankName && !!data.bankAccountNumber && !!data.swiftCode;
  }
  if (data.paymentMethod === "crypto") {
    return !!data.walletAddress;
  }
  if (data.paymentMethod === "phone") {
    return !!data.paymentPhone;
  }
  return true;
}, {
  message: "Please provide all required details for the selected payment method.",
  path: ["paymentMethod"],  
});
export type employeeSchemaType = z.infer<typeof employeeSchema>;




export const editEmployeeSchema = z.object({
  id:z.string().optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  secondName: z.string().min(2, "Second name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  employeeID: z.string().min(1, "Employee ID is required"),
  nationalID: z.string().min(1, "National ID/Passport is required"),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  startDate: z.string().min(1, "Start Date required."),
  monthlyGross: z.union([z.string(), z.number()])
  .transform((val) => Number(val))
  .pipe(z.number().positive("monthly must be positive")),
}) 

export type editEmployeeSchemaType = z.infer<typeof editEmployeeSchema>;

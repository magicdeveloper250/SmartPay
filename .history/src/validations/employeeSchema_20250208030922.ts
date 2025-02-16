import { Currency } from "@prisma/client"; // Import Prisma enum
import * as z from "zod";

export const employeeSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  secondName: z.string().min(2, "Second name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  paymentPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid payment phone number").optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  employeeID: z.string().min(1, "Employee ID is required"),
  nationalID: z.string().min(1, "National ID/Passport is required"),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  currency: z.nativeEnum(Currency, { message: "Invalid currency selected" }),
  department: z.string().min(2, "Department must be at least 2 characters"),
  bankName: z.string().min(1, "Bank Name is required").optional(),
  bankAccountNumber: z.string().min(1, "Bank Account Number is required").optional(),
  swiftCode: z.string().min(1, "SWIFT Code is required").optional(),
  paymentMethod: z.enum(["crypto", "bank", "phone"]),
  Domicile: z.string().optional(),
  walletAddress: z.string().min(1, "Wallet address is required").optional(),
  startDate: z.string().min(1, "Start Date required."),
  monthlyGross: z.union([z.string(), z.number()])
  .transform((val) => Number(val))
  .pipe(z.number().positive("monthly must be positive")),
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

export type contractorSchemaType = z.infer<typeof employeeSchema>;

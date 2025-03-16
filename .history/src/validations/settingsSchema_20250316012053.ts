import { z } from 'zod'
import { Currency, SupportedContributions, SupportedTaxes } from '@prisma/client'

// Company profile schema
export const CompanyProfileSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  pensionCode: z.string().min(1, "Pension code is required"),
  industry: z.string().min(1, "Industry is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
})

// General settings schema
export const GeneralSettingsSchema = z.object({
  id: z.string().optional(),
  defaultCurrency:z.nativeEnum(Currency, { message: "Invalid currency selected" }),
  payrollStartDate: z.number().min(1).max(31),
  payrollEndDate: z.number().min(1).max(31),
  paymentDay: z.number().min(1).max(31),
})

// Payroll settings schema
export const PayrollSettingsSchema = z.object({
  id: z.string().optional(),
  overtimeRate: z.number().min(1),
  weekendRate: z.number().min(1),
  holidayRate: z.number().min(1),
  maxOvertimeHours: z.number().min(0),
  minWorkingHours: z.number().min(0),
  taxDeductionOrder: z.array(z.string())
})

const TaxSettingsSchema = z.object({
  id: z.string().optional(),
  name: z.nativeEnum(SupportedTaxes),
});


const ContributionSettingsSchema = z.object({
  id: z.string().optional(),
  name: z.nativeEnum(SupportedContributions),
});
// Wrapped schemas (for form sections)

export const TaxFormSchema = z.object({
  tax: TaxSettingsSchema
});

export const contributionFormSchema = z.object({
  contribution: ContributionSettingsSchema
});

export const TaxesArraySchema = z.object({
  taxes: z.array(TaxFormSchema)
});



export const CompanyProfileFormSchema = z.object({
  company: CompanyProfileSchema
})

export const GeneralSettingsFormSchema = z.object({
  generalSettings: GeneralSettingsSchema
})

export const PayrollSettingsFormSchema = z.object({
  payrollSettings: PayrollSettingsSchema
})

// Combined schema for all settings
export const SettingsFormValuesSchema = z.object({
  company: CompanyProfileSchema,
  generalSettings: GeneralSettingsSchema,
  payrollSettings: PayrollSettingsSchema,
  taxes: z.array(TaxSettingsSchema)
})

// Type exports
export type CompanyProfileFormValues = z.infer<typeof CompanyProfileFormSchema>
export type GeneralSettingsFormValues = z.infer<typeof GeneralSettingsFormSchema>
export type PayrollSettingsFormValues = z.infer<typeof PayrollSettingsFormSchema>
export type SettingsFormValues = z.infer<typeof SettingsFormValuesSchema> // Fixed this type inference
export type TaxValues = z.infer<typeof TaxFormSchema >  
export type ContributionValues = z.infer<typeof ContributionFormSchema >  
export type TaxesArrayValues = z.infer<typeof TaxesArraySchema>;
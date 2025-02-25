"use server"
import { prisma } from "@/utils/prismaDB";
import { revalidatePath } from "next/cache";
import { handleActionsPrismaError } from "@/lib/error-handler";
import { additionalIncomeSchema, AdditionalIncomeSchemaType } from "@/validations/additionalIncome";
import { deductionSchema, deductionSchemaType } from "@/validations/deductionSchema";


export async function addAdditionalIncome(formData: AdditionalIncomeSchemaType, employeeId: string) {
  console.log(formData)
  const result = additionalIncomeSchema.safeParse(formData);

  if (!result.success) {
    const errorMessages = result.error.issues.reduce((prev, issue) => {
      return (prev += issue.message);
    }, '');
    return {
      error: errorMessages,
    };
  }

  try {
    await prisma.additionalIncome.create({
      data: { 
        ...formData,
        employeeId,
        incomeType: formData.income_type  // Convert from snake_case to camelCase
      }
    })

    revalidatePath(`/dashboard/employees/internal/${employeeId}`);
  } catch (error) {
    return handleActionsPrismaError(error)
  }
}


export async function addDeduction(formData: deductionSchemaType, employeeId: string) {
  const result = deductionSchema.safeParse(formData);

  if (!result.success) {
    const errorMessages = result.error.issues.reduce((prev, issue) => {
      return (prev += issue.message);
    }, '');
    return {
      error: errorMessages,
    };
  }

  try {
    await prisma.deduction.create({
      data: { ...formData, employeeId: employeeId }
    })

    revalidatePath(`/dashboard/employees/internal/${employeeId}`);
  } catch (error) {
    return handleActionsPrismaError(error)
  }
}




 
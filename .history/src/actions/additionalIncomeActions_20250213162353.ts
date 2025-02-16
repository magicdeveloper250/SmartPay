"use server"
import { prisma } from "@/utils/prismaDB";
import { revalidatePath } from "next/cache";
import { handleActionsPrismaError } from "@/lib/error-handler";
import { additionalIncomeSchema, AdditionalIncomeSchemaType } from "@/validations/additionalIncome";


export async function addAdditionalIncome(formData:AdditionalIncomeSchemaType,employeeId:string ) {
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

      
     await   prisma.additionalIncome.create({
      data: {...formData, employee_id:employeeId}
      
    })

      revalidatePath("/dashboard/employees/internal");
  } catch (error) {
  return  handleActionsPrismaError(error)
  }
}




 
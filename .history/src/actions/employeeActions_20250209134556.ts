"use server"
import { employeeSchema, employeeSchemaType } from "@/validations/employeeSchema";
import { prisma } from "@/utils/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { handleActionsPrismaError } from "@/lib/error-handler";
export async function createEmployee(formData:employeeSchemaType) {
    const result = employeeSchema.safeParse(formData);
  
        if (!result.success) {
          const errorMessages = result.error.issues.reduce((prev, issue) => {
            return (prev += issue.message);
          }, '');
          return {
            error: errorMessages,
          };
        }

  try {

      const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
          return { error: "Unauthorized" }
        }
    const body = formData;
     const company = await prisma.company.findUnique({
            where: { adminEmail: session.user.email },
          });
      
          if (!company) {
            return { error: "Company not found" };
          }
     await prisma.$transaction([ prisma.employee.create({
      data: {...body, startDate: new Date(body.startDate).toISOString(), companyId:company.id}
      
    }),   prisma.company.update({
      where: { id: company.id },
      data: { onBoardingFinished: true },
    })])

      revalidatePath("/dashboard/employees/internal");
  } catch (error) {
  return  handleActionsPrismaError(error)
  }
}



 
export async function getEmployee(employeeId:string) {
   
  try {

      
     const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
            include:{
              benefits:true,
              taxes:true,

            }
          });
      
          if (!employee) {
            return { error: "Company not found" };
          }
    return {
      employee:employee
    }
  } catch (error) {
  return  handleActionsPrismaError(error)
  }
}
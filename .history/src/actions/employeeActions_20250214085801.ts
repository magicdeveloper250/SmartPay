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




export async function updateEmployee(employeeId:string, formData:employeeSchemaType) {
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
   await prisma.$transaction([ prisma.employee.update({
    where:{id:employeeId},
    data: {...body, startDate: new Date(body.startDate).toISOString(), companyId:company.id}
    
  }),   prisma.company.update({
    where: { id: company.id },
    data: { onBoardingFinished: true },
  })])

    revalidatePath(`/employee/internal/${employeeId}`);
} catch (error) {
return  handleActionsPrismaError(error)
}
}



 

export async function getEmployee(employeeId: string) {

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        benefits: true,
        salaries: true,
        appliedTaxes:true,
        additionalIncomes:true
      },
    });

    if (!employee) {
      return { error: "Employee not found" };
    }

    return employee;  
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

export async function addEmployeeBenefit(employeeId: string, benefit:string) {

  try {
    const employee = await prisma.employeeBenefit.create({
    data:{
      benefit:benefit,
      employeeId:employeeId

    }
    });

    if (!employee) {
      return { error: "Employee not found" };
    }

    revalidatePath(`/employee/internal/${employeeId}`);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

export async function deleteEmployeeBenefit(id:string, employeeId: string, benefit:string) {

  try {
    const employee = await prisma.employeeBenefit.delete({
    where:{
      id:id,
      benefit:benefit,
      employeeId:employeeId
    }
    });

    if (!employee) {
      return { error: "Employee not found" };
    }

    revalidatePath(`/employee/internal/${employeeId}`);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}



 
export async function addEmployeeTax(employeeId: string, taxId:string) {

  try {
     await prisma.appliedTax.create({
    data:{
      employeeId:employeeId,
      taxId:taxId

    }
    });

    
    revalidatePath(`/employee/internal/${employeeId}`);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

export async function deleteEmployeeTax( taxId: string, employeeId: string,) {

  try {
    await prisma.appliedTax.delete({
    where:{
      id:taxId,
      employeeId:employeeId
    }
    });

    revalidatePath(`/employee/internal/${employeeId}`);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

export async function deleteEmployeeIncome( incomeId: string, employeeId: string,) {

  try {
    await prisma.additionalIncome.delete({
    where:{
      id:incomeId,
      employee_id:employeeId
    }
    });

    revalidatePath(`/employee/internal/${employeeId}`);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}
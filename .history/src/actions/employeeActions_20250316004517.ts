"use server"
import { editEmployeeSchemaType, employeeSchema, employeeSchemaType } from "@/validations/employeeSchema";
import { prisma } from "@/utils/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { handleActionsPrismaError } from "@/lib/error-handler";
import { PaymentStatus } from "@prisma/client";


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
     const user = await prisma.user.findUnique({
            where: { email: session.user.email }, include:{
              company:true
            }
          });
      
          if (!user|| !user.company) {
            return { error: "Company not found" };
          }
     await prisma.$transaction([ prisma.employee.create({
      data: {...body, companyId:user.company.id}
      
    }),   prisma.company.update({
      where: { id: user.company.id },
      data: { onBoardingFinished: true },
    })])

      revalidatePath("/dashboard/employees/internal");
      revalidatePath(`/dashboard/payroll/internal?tab=employees`);
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
   const user= await prisma.user.findUnique({
          where: { email: session.user.email },
          include:{company:true}
        });
    
        if (!user ||!user.company) {
          return { error: "Company not found" };
        }
   await prisma.$transaction([ prisma.employee.update({
    where:{id:employeeId},
    data: {...body, startDate: new Date(body.startDate).toISOString(), companyId:user.company.id}
    
  }),   prisma.company.update({
    where: { id: user.company.id },
    data: { onBoardingFinished: true },
  })])

    revalidatePath(`/employee/internal/${employeeId}`);
    revalidatePath(`/dashboard/payroll/internal?tab=employees`);
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
        additionalIncomes:true,
        deductions:true
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
    revalidatePath(`/dashboard/payroll/internal?tab=employees`);
    return employee
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
    revalidatePath(`/dashboard/payroll/internal?tab=employees`);
    return employee
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
    revalidatePath(`/dashboard/payroll/internal?tab=employees`);
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
    revalidatePath(`/dashboard/payroll/internal?tab=employees`);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

export async function deleteEmployeeIncome( incomeId: string, employeeId: string,) {

  try {
    await prisma.additionalIncome.delete({
    where:{
      id:incomeId,
      employeeId:employeeId
    }
    });

    revalidatePath(`/employee/internal/${employeeId}`);
    revalidatePath(`/dashboard/payroll/internal?tab=employees`);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

export async function changeEmployeeIncomeStatus( incomeId: string, employeeId: string, newStatus:PaymentStatus) {

  try {
    await prisma.additionalIncome.update({
      where:{
        id:incomeId,
        employeeId:employeeId
      },
        data:{
      paymentStatus:newStatus
    }
    });

    revalidatePath(`/employee/internal/${employeeId}`);
    revalidatePath(`/dashboard/payroll/internal?tab=employees`);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}


export async function deleteEmployeeDeduction( deductionId: string, employeeId: string,) {

  try {
    await prisma.deduction.delete({
    where:{
      id:deductionId,
      employeeId:employeeId
    }
    });

    revalidatePath(`/employee/internal/${employeeId}`);
    revalidatePath(`/dashboard/payroll/internal?tab=employees`);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

export async function changeEmployeeDeductionStatus( deductionId: string, employeeId: string, newStatus:PaymentStatus) {

  try {
    await prisma.deduction.update({
      where:{
        id:deductionId,
        employeeId:employeeId
      },
        data:{
      status:newStatus
    }
    });

    revalidatePath(`/employee/internal/${employeeId}`);
    revalidatePath(`/dashboard/payroll/internal?tab=employees`);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}




export async function updateEmployeeData(employeeId:string, employeeData: editEmployeeSchemaType) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return {"error":"Unauthorized"};
    }

    const user = await prisma.user.findFirstOrThrow({ 
      where: { email: session.user.email as string },
      include:{company:true}
    
    });
    if (!user ||!user.company)  
      return {"error": "Company not found"}
    await prisma.employee.update({
      where:{id:employeeId},
      data:{
        firstName:employeeData.firstName,
        secondName:employeeData.secondName,
        email:employeeData.email,
        phoneNumber:employeeData.phoneNumber,
        address:employeeData.address,
        employeeID:employeeData.employeeID,
        nationalID:employeeData.nationalID,
        jobTitle:employeeData.jobTitle,
        department:employeeData.department,
        startDate:new Date(employeeData.startDate).toISOString(),
        monthlyGross:employeeData.monthlyGross
      }

    })
   
    revalidatePath(`/employee/internal/${employeeData.id}`);
    return Promise.resolve(employeeData);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}
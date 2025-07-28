'use server';

import * as XLSX from 'xlsx';
import { employeeSchema } from '@/validations/employeeSchema';
import { FileUploadSchema } from '@/validations/employeeFIleSchema';
import { prisma } from '@/utils/prismaDB';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth';
import { revalidatePath } from 'next/cache';
import { handleActionsPrismaError } from '@/lib/error-handler';
export async function processExcelFile(input: {
  base64String: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}) {
  try {
    const session = await getServerSession(authOptions);
            if (!session?.user?.email) {
              return { error: "Unauthorized" }
            }
         const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                include:{company:true}
              });
          
              if (!user || !user.company) {
                return { error: "Company not found" };
              }
    const fileValidation = FileUploadSchema.safeParse(input);
    if (!fileValidation.success) {
      return { error: fileValidation.error.errors[0].message };
    }
    const binaryString = atob(input.base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const workbook = XLSX.read(bytes, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
    const body = jsonData.map((row: any, index: number) => {
      const result = employeeSchema.safeParse({
        ...row,
        monthlyGross: Number(row.monthlyGross) || 0
      });

      if (!result.success) {
      
          throw new Error(`Validation error in row ${index + 1}: ${result.error.errors[0].message}`);
          
        
       
      }

      return result.data;
    });
    

      await prisma.$transaction([prisma.employee.createMany({
             data: body.map((emp: any) => ({
               ...emp,
               monthlyGross:Number.parseFloat(emp.monthlyGross),
               startDate: new Date(emp.startDate).toISOString(), 
               companyId:user.company.id,
                
             })),
           }),  prisma.company.update({
             where: { id: user.company.id },
             data: { onBoardingFinished: true },
           })])
     revalidatePath("/dashboard/employees/internal");
  } catch (error: any) {
    
    return handleActionsPrismaError(error)
  }
}
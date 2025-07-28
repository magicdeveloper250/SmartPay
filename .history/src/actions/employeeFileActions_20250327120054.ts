'use server';

import * as XLSX from 'xlsx';
import { employeeSchema } from '@/validations/employeeSchema';
import { FileUploadSchema } from '@/validations/employeeFIleSchema';
import { prisma } from '@/utils/prismaDB';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth';
import { revalidatePath } from 'next/cache';
import { handleActionsPrismaError } from '@/lib/error-handler';
export async function processExcelFile(input: { formData: FormData }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { company: true },
    });

    if (!user || !user.company) {
      return { error: "Company not found" };
    }

    // Validate file input
    const file = input.formData.get("file") as File;
    if (!file) {
      return { error: "No file uploaded" };
    }

    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

    const validEmployees = jsonData
      .map((row: any) => {
        const result = employeeSchema.safeParse({
          ...row,
          monthlyGross: isNaN(Number(row.monthlyGross)) ? 0 : Number(row.monthlyGross),
        });

        return result.success ? result.data : null;
      })
      .filter(Boolean);

    if (validEmployees.length === 0) {
      return { error: "No valid employees found in the file" };
    }

    await prisma.$transaction([
      prisma.employee.createMany({
        data: validEmployees.map((emp: any) => ({
          ...emp,
          monthlyGross: Number.parseFloat(emp.monthlyGross),
          startDate: isNaN(Date.parse(emp.startDate)) ? null : new Date(emp.startDate).toISOString(),
          companyId: user.company.id,
        })),
      }),
      prisma.company.update({
        where: { id: user.company.id },
        data: { onBoardingFinished: true },
      }),
    ]);

    revalidatePath("/dashboard/employees/internal");
  } catch (error: any) {
    console.error(error.stack);
    return handleActionsPrismaError(error);
  }
}


import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

const prisma = new PrismaClient();

function getFieldName(target: string | undefined): string {
  if (!target || !target.length) return 'field';
  const field = target[0].split('_')[1] || target[0];
  return field.charAt(0).toLowerCase() + field.slice(1);
}

function getModelName(target: string[] | undefined): string {
  if (!target || !target.length) return 'record';
  // Extract model name from constraint
  // e.g., "Employee_employeeID_key" -> "Employee"
  return target[0].split('_')[0].toLowerCase();
}

function handlePrismaError(error: any) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const field = getFieldName(error.meta?.target as string[]);
        const model = getModelName(error.meta?.target as string[]);
        return NextResponse.json({ 
          error: `A ${model} with this ${field} already exists.`
        }, { status: 409 });
      }
      case 'P2014':
        return NextResponse.json({ 
          error: "Invalid relationship between records.",
          details: error.meta 
        }, { status: 400 });
      case 'P2003': {
        const field = error.meta?.field_name || 'field';
        return NextResponse.json({ 
          error: `Invalid reference for ${field}.`
        }, { status: 400 });
      }
      default:
        return NextResponse.json({ 
          error: "Database constraint violation",
          code: error.code 
        }, { status: 400 });
    }
  }
  
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json({ 
      error: "Invalid data provided",
      details: error.message 
    }, { status: 400 });
  }
  
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const company = await prisma.company.findUnique({
      where: { adminEmail: session.user.email },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    if (Array.isArray(body.employees)) {
      const employees = await prisma.employee.createMany({
        data: body.employees.map((emp: any) => ({
          ...emp,
          companyId: company.id,
        })),
      });

      await prisma.company.update({
        where: { id: company.id },
        data: { onBoardingFinished: true },
      });

      return NextResponse.json({
        message: "Employees registered successfully!",
        count: employees.count,
      });
    } else {
      const [newEmployee, updatedCompany] = await prisma.$transaction([
        prisma.employee.create({
          data: {
            ...body,
            companyId: company.id,
          },
        }),
        prisma.company.update({
          where: { id: company.id },
          data: { onBoardingFinished: true },
        }),
      ]);

      return NextResponse.json({
        message: "Employee registered successfully!",
        employee: newEmployee,
        company: updatedCompany,
      });
    }
  } catch (error) {
    return handlePrismaError(error);
  }
}
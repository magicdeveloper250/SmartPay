import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import { handlePrismaError } from "@/lib/error-handler";
import { Currency } from "@prisma/client";




export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const company = await prisma.company.findUnique({
      where: { adminEmail: session.user.email }
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    if (id) {
      const employee = await prisma.employee.findFirst({
        where: {
          id,
          companyId: company.id
        }
      });

      if (!employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
      }

      return NextResponse.json({ employee });
    }

    const employees = await prisma.employee.findMany({
      where: { companyId: company.id }
    });

    return NextResponse.json({ employees });
  } catch (error) {
    return handlePrismaError(error);
  }
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
      const [employees, updatedCompany] = await prisma.$transaction([prisma.employee.createMany({
        data: body.employees.map((emp: any) => ({
          ...emp,
          companyId: company.id,
        })),
      }),  prisma.company.update({
        where: { id: company.id },
        data: { onBoardingFinished: true },
      })])


      return NextResponse.json({
        message: "Employees registered successfully!",
        count: employees.count,
      });
    } else {
       
     
     const[newEmployee, updatedCompany]=  await prisma.$transaction([ prisma.employee.create({
      data: {...body, startDate: new Date(body.startDate).toISOString(), companyId:company.id}
      
    }),   prisma.company.update({
      where: { id: company.id },
      data: { onBoardingFinished: true },
    })])

      return NextResponse.json({
        message: "Employee registered successfully!",
        employee: newEmployee,
        company: updatedCompany,
      });
    }
  } catch (error) {
   
  return  handlePrismaError(error)
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    const company = await prisma.company.findUnique({
      where: { adminEmail: session.user.email },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const employee = await prisma.employee.findFirst({
      where: { 
        id,
        companyId: company.id
      }
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Employee updated successfully!",
      employee: updatedEmployee,
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    const company = await prisma.company.findUnique({
      where: { adminEmail: session.user.email },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const employee = await prisma.employee.findFirst({
      where: { 
        id,
        companyId: company.id
      }
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    await prisma.employee.delete({
      where: { id }
    });

    return NextResponse.json({
      message: "Employee deleted successfully!"
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}
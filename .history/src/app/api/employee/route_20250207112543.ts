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
    console.log("Request body:", body);
    if (!body) {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 });
    }

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
      // Validate required fields
      const requiredFields = [
        'firstName',
        'secondName',
        'employeeID',
        'currency',
        'department',
        'jobTitle',
        'monthlyGross',
        'nationalID',
        'startDate'
      ];

      for (const field of requiredFields) {
        if (!body[field]) {
          return NextResponse.json(
            { error: `Missing required field: ${field}` },
            { status: 400 }
          );
        }
      }

      const employeeData = {
        firstName: body.firstName,
        secondName: body.secondName,
        email: body.email || null,
        phoneNumber: body.phoneNumber || null,
        address: body.address || null,
        employeeID: body.employeeID,
        nationalID: body.nationalID,
        startDate: body.startDate,
        department: body.department,
        jobTitle: body.jobTitle,
        currency: body.currency,
        monthlyGross: Number(body.monthlyGross),
        companyId: company.id,
        // Optional fields with null fallbacks
        bankName: body.bankName || null,
        bankAccountNumber: body.bankAccountNumber || null,
        swiftCode: body.swiftCode || null,
        Domicile: body.Domicile || null,
        walletAddress: body.walletAddress || null
      };

      try {
        const newEmployee = await prisma.employee.create({
          data: employeeData,
        });

        return NextResponse.json({
          success: true,
          message: "Employee registered successfully!",
          employee: newEmployee,
        });
      } catch (prismaError: any) {
        console.error("Prisma error:", prismaError);
        return NextResponse.json({
          success: false,
          error: prismaError.message
        }, { status: 400 });
      }
    }

       
      
    
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to process request"
    }, { status: 500 });
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
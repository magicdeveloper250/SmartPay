import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

const prisma = new PrismaClient();

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
      // Bulk creation
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
      // Single employee creation
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
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
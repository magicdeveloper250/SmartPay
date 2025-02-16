import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const company = await prisma.company.findUnique({
      where: {
        adminEmail: session.user.email,
      },
      select:{
        onBoardingFinished:true,
        _count:{
        select:{employees:true, contractors:true},
      }}
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    const { employees = 0, contractors = 0 } = company._count || {};
    let companyInfo= {...company, employeeCount:employees, contractorsCount: contractors }

    return NextResponse.json(companyInfo);
  } catch (error) {
   
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

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
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include:{company:{
        select:{
          onBoardingFinished:true,
          _count:{
          select:{employees:true, contractors:true},
        }}
      }

      }
      
    });

    if (!user ||!user.company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    const { _count, ...companyInfo } = user.company;
    const { employees = 0, contractors = 0 } = _count || {};

    return NextResponse.json({
      ...companyInfo,
      employeeCount: employees,
      contractorCount: contractors,
    });
  } catch (error) {
   
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

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
      include:{
        company:true
      }
     
    });

    if (!user ||!user.company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const taxes = await prisma.predefinedTax.findMany({
      where: {companyId:user.company.id},  
       
    });

    if (taxes.length === 0) {
      return NextResponse.json({ error: "No taxes found" }, { status: 404 });
    }

    return NextResponse.json({ taxes }, { status: 200 });
  } catch (error) {
    
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

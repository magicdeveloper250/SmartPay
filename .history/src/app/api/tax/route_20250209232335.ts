import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

export async function GET(req: NextRequest) {
  try {
      

    const taxes = await prisma.predefinedTax.findMany({
      where: {},  
       
    });

    if (taxes.length === 0) {
      return NextResponse.json({ error: "No employees found" }, { status: 404 });
    }

    return NextResponse.json({ taxes }, { status: 200 });
  } catch (error) {
    
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

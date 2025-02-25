import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import { handlePrismaError } from "@/lib/error-handler";


export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
 
    if (id) {
      const contract = await prisma.contractTerms.findFirst({
        where: { id },
        include: {
          contractor: true,
          company: true
        }
      });

      if (!contract) {
        return NextResponse.json({ error: "Contract not found" }, { status: 404 });
      }

      return NextResponse.json(contract);
    }

    return NextResponse.json({ error: "Contract ID is required" }, { status: 400 });
  } catch (error) {
    return handlePrismaError(error);
  }
}

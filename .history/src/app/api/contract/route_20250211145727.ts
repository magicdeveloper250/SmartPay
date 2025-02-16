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
    console.log(id)
 
    if (id) {
      const contract = await prisma.contractTerms.findFirst({
        where: {
          id,
        
        }
      });

      if (!contract) {
        return NextResponse.json({ error: "Contract not found" }, { status: 404 });
      }
      console.log(contract)

      return NextResponse.json({ contract });
    }

     

  } catch (error) {

    return handlePrismaError(error);
  }
}

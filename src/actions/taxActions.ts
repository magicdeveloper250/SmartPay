import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import { handleActionsPrismaError } from "@/lib/error-handler";
import { SupportedTaxes } from "@prisma/client";

export async function GetTaxes() {
    const session = await getServerSession(authOptions);
  
    if (!session?.user?.email) {
      return { error: "Unauthorized" }
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
      return { error: "Company not found" }
    }

    const taxes = Object.values(SupportedTaxes)

    if (taxes.length === 0) {
      return { error: "No taxes found" }
    }

    return { taxes }
  } catch (error) {
    
    return  handleActionsPrismaError(error)
  }
}

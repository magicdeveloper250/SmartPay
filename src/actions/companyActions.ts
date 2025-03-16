"use server"
import { prisma } from "@/utils/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { handleActionsPrismaError } from "@/lib/error-handler";
import type { CompanyWithCount } from "@/types/companyWithCompny";
 

export async function getCurrentCompany(): Promise<CompanyWithCount | { error: string }> {
  const session = await getServerSession(authOptions);

  try {
    if (!session?.user?.email) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include:{
        company:{
          
           include:{
            _count: {
              select: { employees: true, contractors: true },
            }
           }
          
        }
      }
    });

    if (!user || !user.company) {
      return { error: "Company not found" };
    }

    return user.company;
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}






export async function  onBoardingFinished() {
  const session = await getServerSession(authOptions);

  try {
    if (!session?.user?.email) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,

      },
      include:{
        company:true
      }

    
    });

    if (!user || !user.company) {
      return { error: "Company not found" };
    }

    return user.company?.onBoardingFinished  
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

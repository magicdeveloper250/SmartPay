"use client"
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

    const company = await prisma.company.findUnique({
      where: {
        adminEmail: session.user.email,
      },
      include: {
        _count: {
          select: { employees: true, contractors: true },
        },
      },
    });

    if (!company) {
      return { error: "Company not found" };
    }

    return company;
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}
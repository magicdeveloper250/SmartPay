"use server"

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import { handleActionsPrismaError, handlePrismaError } from "@/lib/error-handler";


export async function getContractByID(contractId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: "Unauthorized" }
  }

  try {
  
    const id = contractId;
 
    if (id) {
      const contract = await prisma.contractTerms.findFirst({
        where: { id },
        include: {
          contractor: true,
          company: true
        }
      });

      if (!contract) {
        return  handleActionsPrismaError(new Error("Contract not found."))
      }

      return contract;
    }

    return handleActionsPrismaError(new Error("Contract id not found."))
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

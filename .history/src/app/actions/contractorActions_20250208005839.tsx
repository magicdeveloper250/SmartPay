"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { Contractor, ContractTerms, Currency, PaymentMethod } from "@prisma/client";  
import { prisma } from "@/utils/prismaDB";

export async function createContractor(formData: FormData) {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  try {
    // Extract data from FormData
    const rawData = {
      firstName: formData.get("firstName") as string,
      secondName: formData.get("secondName") as string,
      email: formData.get("email") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      paymentPhone: formData.get("paymentPhone") as string,
      address: formData.get("address") as string,
      contractorID: formData.get("contractorID") as string,
      nationalID: formData.get("nationalID") as string,
      jobTitle: formData.get("jobTitle") as string,
      currency: formData.get("currency") as Currency,
      department: formData.get("department") as string,
      bankName: formData.get("bankName") as string,
      bankAccountNumber: formData.get("bankAccountNumber") as string,
      swiftCode: formData.get("swiftCode") as string,
      paymentMethod: formData.get("paymentMethod") as PaymentMethod,
      Domicile: formData.get("Domicile") as string,
      walletAddress: formData.get("walletAddress") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      notes: formData.get("notes") as string,
      salary: formData.get("salary") as string,
    };

    const { salary, startDate, endDate, notes, ...contractorData } = rawData;

    const company = await prisma.company.findUnique({
      where: { adminEmail: session.user.email },
    });

    if (!company) {
      return { error: "Company not found" };
    }

    const result = await prisma.$transaction(async (tx) => {
      const newContractor = await tx.contractor.create({
        data: { ...contractorData, companyId: company.id },
      });

      const contract = await tx.contractTerms.create({
        data: {
          salary: Number(salary),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          notes,
          companyId: company.id,
          contractorId: newContractor.id,
        },
      });

      const updatedCompany = await tx.company.update({
        where: { id: company.id },
        data: { onBoardingFinished: true },
      });

      return { newContractor, contract, updatedCompany };
    });

    revalidatePath("/dashboard/employees/contractors");  

    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating contractor:", error);
    return { error: "Failed to create contractor" };
  }
}
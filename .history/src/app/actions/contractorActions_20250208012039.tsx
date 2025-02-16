"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { Currency, PaymentMethod } from "@prisma/client";  
import { prisma } from "@/utils/prismaDB";

export async function createContractor(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  try {
    // Extract and convert form data properly
    const extractedData = {
      firstName: formData.get("firstName")?.toString().trim() || "",
      secondName: formData.get("secondName")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      phoneNumber: formData.get("phoneNumber")?.toString().trim() || "",
      address: formData.get("address")?.toString().trim() || "",
      contractorID: formData.get("contractorID")?.toString().trim() || "",
      nationalID: formData.get("nationalID")?.toString().trim() || "",
      jobTitle: formData.get("jobTitle")?.toString().trim() || "",
      currency: formData.get("currency") as Currency,
      department: formData.get("department")?.toString().trim() || "",
      bankName: formData.get("bankName")?.toString().trim() || "",
      bankAccountNumber: formData.get("bankAccountNumber")?.toString().trim() || "",
      swiftCode: formData.get("swiftCode")?.toString().trim() || "",
      paymentMethod: formData.get("paymentMethod") as PaymentMethod,
      Domicile: formData.get("Domicile")?.toString().trim() || "",
      walletAddress: formData.get("walletAddress")?.toString().trim() || "",
      startDate: formData.get("startDate")?.toString().trim() || "",
      endDate: formData.get("endDate")?.toString().trim() || "",
      notes: formData.get("notes")?.toString().trim() || "",
      salary: formData.get("salary")?.toString().trim() || "0",
    };

    // Convert salary to a number
    const salary = Number(extractedData.salary);
    if (isNaN(salary) || salary < 0) {
      return { error: "Invalid salary value" };
    }

    // Convert date fields
    const startDate = new Date(extractedData.startDate);
    const endDate = new Date(extractedData.endDate);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { error: "Invalid date format" };
    }

    // Validate required fields
    if (!extractedData.firstName || !extractedData.email || !extractedData.contractorID) {
      return { error: "Missing required fields" };
    }

    // Find company
    const company = await prisma.company.findUnique({
      where: { adminEmail: session.user.email },
    });

    if (!company) {
      return { error: "Company not found" };
    }

    // Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      const newContractor = await tx.contractor.create({
        data: { 
          ...extractedData, 
          companyId: company.id 
        },
      });

      const contract = await tx.contractTerms.create({
        data: {
          salary,
          startDate,
          endDate,
          notes: extractedData.notes,
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

import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

export async function POST(request: any) {
  try {
    const body = await request.json();
    const { companyName, adminName, adminEmail, password, country, city, industry, pensionCode } = body;

    // Check for missing fields
    if (!companyName || !adminName || !adminEmail || !password || !country || !city || !industry || !pensionCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if the company with the admin email already exists
    const existingCompany = await prisma.company.findUnique({
      where: { adminEmail: adminEmail.toLowerCase() },
    });

    if (existingCompany) {
      return NextResponse.json({ error: "A company with this admin email already exists" }, { status: 400 });
    }

    // Hash the password for storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new company in the database
    const newCompany = await prisma.company.create({
      data: {
        name: companyName,
        adminName,
        email: adminEmail.toLowerCase(),
        adminEmail: adminEmail.toLowerCase(),
        password: hashedPassword,
        country,
        city,
        industry,
        pensionCode,
      },
    });

    // Return success response with the company data
    return NextResponse.json({ message: "Successfully registered", company: newCompany }, { status: 201 });

  } catch (error) {
    console.error("Error during registration:", error);

    // Return a 500 error for unexpected issues
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

export async function POST(request: any) {
  try {
    const body = await request.json();
    const { companyName, adminName, adminEmail, password, country, city, industry, pensionCode } = body;
    if (!companyName || !adminName || !adminEmail || !password || !country || !city || !industry || !pensionCode) {
      return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
    }

    // Check if the company already exists
    const existingCompany = await prisma.company.findUnique({
      where: { adminEmail: adminEmail.toLowerCase() },
    });

    console.log(existingCompany)
    if (existingCompany) {
      return NextResponse.json({ error: "User already exists!" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the company in the database
    const newCompany = await prisma.company.create({
      data: {
        name: companyName,
        adminName:adminName,
        email: adminEmail.toLowerCase(),
        adminEmail: adminEmail.toLowerCase(),
        password: hashedPassword,
        country,
        city,
        industry,
        pensionCode,
      },
    });
 

    return NextResponse.json({ message: "Successfully registered", company: newCompany }, { status: 201 });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

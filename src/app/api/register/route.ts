import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";




export async function POST(request: any) {
  try {
    const body = await request.json();
    console.log(body)
    const { companyName,email,phoneNumber,   adminName, adminEmail, password, country, city, industry, pensionCode } = body;
    if (!companyName || !adminName || !adminEmail || !password || !country || !city || !industry || !pensionCode) {
      return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
    }

    // Check if the company already exists
    const existingCompany = await prisma.company.findUnique({
      where: { email : email.toLowerCase() },
    });

    if (existingCompany) {
      return NextResponse.json({ error: "User already exists!" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the company in the database
    const newCompany = await prisma.company.create({
      data: {
        name: companyName,
        email: email.toLowerCase(),
        country,
        city,
        industry,
        pensionCode,
        onBoardingFinished:false
      },
    });
    
    // Create company User.
    const newCompanyUser= await prisma.user.create(
    {
      data: {
        name: adminName,
        email: email.toLowerCase(),
        password:hashedPassword,
        phoneNumber: phoneNumber,
        companyId: newCompany.id,
 
      }
    }

    )
 
    return NextResponse.json({ message: "Successfully registered", company: newCompany }, { status: 201 });
  } catch (error) {
 
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

 
"use server"
import { prisma } from "@/utils/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { handleActionsPrismaError } from "@/lib/error-handler";
import type { CompanyWithCount } from "@/types/companyWithCompny";
 
import bcrypt from "bcryptjs";
import { companySchema, CompanySchemaType } from "@/validations/companyRegistration";
 




export async function createCompany(formData:CompanySchemaType) {
  try {
       const result = companySchema.safeParse(formData);
    
          if (!result.success) {
            const errorMessages = result.error.issues.reduce((prev, issue) => {
              return (prev += issue.message);
            }, '');
            return {
              error: errorMessages,
            };
          }
    const { companyName,email,phoneNumber,   adminName, adminEmail, password, country, city, industry, pensionCode } = formData;
    if (!companyName || !adminName || !adminEmail || !password || !country || !city || !industry || !pensionCode || !email || !phoneNumber) {
      return { error: "Missing Fields" };
    }
 
    const existingCompany = await prisma.company.findUnique({
      where: { email : email.toLowerCase() },
    });

    if (existingCompany) {
      return { error: "User already exists!" }
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
 
    await prisma.$transaction(async (prisma) => {
      const newCompany = await prisma.company.create({
        data: {
          name: companyName,
          email: email.toLowerCase(),
          country,
          city,
          industry,
          pensionCode,
          onBoardingFinished: false
        },
      });
      
      await prisma.user.create({
        data: {
          name: adminName,
          email: email.toLowerCase(),
          password: hashedPassword,
          phoneNumber: phoneNumber,
          companyId: newCompany.id,
        }
      });
    });
 
    return { message: "Successfully registered" }
  } catch (error) {
 
    return handleActionsPrismaError(error);
  }
}

 
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

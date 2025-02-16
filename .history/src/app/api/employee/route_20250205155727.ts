import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const {
    firstName,
     secondName, 
     employeeID,
     nationalID , 
     startDate,  
     department  ,   
    jobTitle  ,
    currency   ,
    monthlyGross ,
    bankName  ,
    bankAccountNumber,   
    swiftCode        ,
    Domicile         ,
    walletAddress     }= await req.json()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const company = await prisma.company.findUnique({
      where: {
        adminEmail: session.user.email,
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
   const newEmployee= await prisma.employee.create(
      {
        data:{
          firstName:firstName,         
          secondName:secondName,      
          employeeID:employeeID,          
          nationalID :nationalID,        
          startDate :startDate,        
          department :department,      
          jobTitle :jobTitle,         
          currency   :currency,       
          monthlyGross :monthlyGross,     
          bankName :bankName,         
          bankAccountNumber :bankAccountNumber,   
          swiftCode :swiftCode,        
          Domicile:Domicile,          
          walletAddress :walletAddress,      
          companyId :company?.id,         
          

        }
      }
    )
    return NextResponse.json({message:"New Employee Reistered successfully!", employee: newEmployee})
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

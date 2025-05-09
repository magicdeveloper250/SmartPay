import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import { handlePrismaError } from "@/lib/error-handler";



export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const user= await prisma.user.findUnique({
      where: {email: session.user.email },
      include:{company:true}
    });

    if (!user ||!user.company) {
      return NextResponse.json({ error: "Contractor not found" }, { status: 404 });
    }

    if (id) {
      const contractor = await prisma.contractor.findFirst({
        where: {
          id,
          companyId: user.company.id
        },
        include:{
          contractsTerms:true
        }
      });

      if (!contractor) {
        return NextResponse.json({ error: "Contractor not found" }, { status: 404 });
      }
     
      return NextResponse.json({ contractor:contractor, contract:contractor.contractsTerms });
    }

    const contractors = await prisma.contractor.findMany({
      where: { companyId: user.company.id }
    });

    return NextResponse.json({ contractors });
  } catch (error) {

    return handlePrismaError(error);
  }
}

 

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { salary, startDate, endDate, notes, ...contractorData } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include:{company:true}
    });

    if (!user ||!user.company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const newContractor = await tx.contractor.create({
        data: { ...contractorData, companyId: user.company.id },
      });

      const contract = await tx.contractTerms.create({
        data: {
          salary,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          notes,
          companyId: user.company.id,
          contractorId: newContractor.id,  
        },
      });
 
      const updatedCompany = await tx.company.update({
        where: { id: user.company.id },
        data: { onBoardingFinished: true },
      });

      return { newContractor, contract, updatedCompany };
    });

    return NextResponse.json({
      message: "Contractor registered successfully!",
      contractor: result.newContractor,
      contract: result.contract,
      company: result.updatedCompany,
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include:{company:true}
    });

    if (!user|| !user.company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const employee = await prisma.employee.findFirst({
      where: { 
        id,
        companyId: user.company.id
      }
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Employee updated successfully!",
      employee: updatedEmployee,
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include:{company:true}
    });

    if (!user ||!user.company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const employee = await prisma.employee.findFirst({
      where: { 
        id,
        companyId: user.company.id
      }
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    await prisma.employee.delete({
      where: { id }
    });

    return NextResponse.json({
      message: "Employee deleted successfully!"
    });
  } catch (error) {
    return handlePrismaError(error);
  }
}
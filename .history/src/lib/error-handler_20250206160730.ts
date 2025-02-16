import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
export function handlePrismaError(error: any) {
  console.log(error)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json({ 
          error: `${error.meta?.modelName} already exists.`
        }, { status: 409 });
      case 'P2014':
        return NextResponse.json({ 
          error: "Invalid relationship between records.",
          details: error.meta 
        }, { status: 400 });
      case 'P2003': {
        const field = error.meta?.field_name || 'field';
        return NextResponse.json({ 
          error: `Invalid reference for ${field}.`
        }, { status: 400 });
      }
      default:
        return NextResponse.json({ 
          error: "Database constraint violation",
          code: error.code 
        }, { status: 400 });
    }
  }
  
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json({ 
      error: "Invalid data provided",
      details: error.message 
    }, { status: 400 });
  }
  
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}
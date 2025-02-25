import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { PrismaErrorResponse } from "@/types/payroll";

export function handlePrismaError(error: any) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const target = Array.isArray(error.meta?.target) 
          ? 'these fields' 
          : 'this field';
        return NextResponse.json({ 
          error: `A record with ${target} already exists.`
        }, { status: 409 });
      }
      
      case 'P2014':
        return NextResponse.json({ 
          error: "The records cannot be connected due to missing or invalid relationships."
        }, { status: 400 });
      
      case 'P2003':
        return NextResponse.json({ 
          error: "Invalid reference to a related record."
        }, { status: 400 });
      
      case 'P2025':
        return NextResponse.json({ 
          error: "The requested record was not found."
        }, { status: 404 });
      
      case 'P2016':
        return NextResponse.json({ 
          error: "The request contains invalid parameters."
        }, { status: 400 });
      
      case 'P2001':
        return NextResponse.json({ 
          error: "The requested record does not exist."
        }, { status: 404 });

      case 'P2011':
        return NextResponse.json({
          error: "Required field cannot be empty."
        }, { status: 400 });

      case 'P2012':
        return NextResponse.json({
          error: "Required field is missing."
        }, { status: 400 });
      
      default:
        console.error('Database error:', error);
        return NextResponse.json({ 
          error: "An error occurred while processing your request."
        }, { status: 400 });
    }
  }
  
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json({ 
      error: "The provided data is invalid or incomplete."
    }, { status: 400 });
  }
  
  console.error('Unexpected error:', error);
  return NextResponse.json({ 
    error: "An unexpected error occurred. Please try again later." 
  }, { status: 500 });
}

export function handleActionsPrismaError(error: unknown): PrismaErrorResponse {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const target = Array.isArray(error.meta?.target) 
          ? 'these fields' 
          : 'this field';
        return {
          error: `A record with ${target} already exists.`,
          code: error.code,
        };
      }
      
      case "P2014":
        return {
          error: "The records cannot be connected due to missing or invalid relationships.",
          code: error.code,
        };
      
      case "P2003":
        return {
          error: "Invalid reference to a related record.",
          code: error.code,
        };
      
      case "P2025":
        return {
          error: "The requested record was not found.",
          code: error.code,
        };
      
      case "P2011":
        return {
          error: "Required field cannot be empty.",
          code: error.code,
        };

      case "P2012":
        return {
          error: "Required field is missing.",
          code: error.code,
        };

      default:
        console.error('Database error:', error);
        return {
          error: "An error occurred while processing your request.",
          code: error.code,
        };
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      error: "The provided data is invalid or incomplete.",
    };
  }

  console.error('Unexpected error:', error);
  return { 
    error: "An unexpected error occurred. Please try again later." 
  };
}
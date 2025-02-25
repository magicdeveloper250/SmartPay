import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { PrismaErrorResponse } from "@/types/payroll";

export function handlePrismaError(error: any) {
  // Log the full error for debugging but return secure messages to client
  console.error('Database error:', error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      // Authentication & Connection Errors (P1xxx)
      case 'P1008':
      case 'P1001':
      case 'P1002':
        return NextResponse.json({ 
          error: "Unable to connect to the database. Please try again later."
        }, { status: 503 });

      case 'P1000':
      case 'P1010':
        return NextResponse.json({ 
          error: "Database authentication error. Please contact support."
        }, { status: 401 });

      // Data Constraint Errors (P2xxx)
      case 'P2002': {
        const target = Array.isArray(error.meta?.target) 
          ? 'these fields' 
          : 'this field';
        return NextResponse.json({ 
          error: `A record with ${target} already exists.`
        }, { status: 409 });
      }

      case 'P2003':
      case 'P2014':
      case 'P2017':
        return NextResponse.json({ 
          error: "Invalid relationship between records."
        }, { status: 400 });

      case 'P2025':
      case 'P2001':
      case 'P2015':
      case 'P2018':
        return NextResponse.json({ 
          error: "The requested record was not found."
        }, { status: 404 });

      case 'P2011':
      case 'P2012':
        return NextResponse.json({
          error: "Required field is missing or empty."
        }, { status: 400 });

      case 'P2019':
      case 'P2006':
      case 'P2007':
        return NextResponse.json({ 
          error: "The provided data is invalid."
        }, { status: 400 });

      case 'P2020':
        return NextResponse.json({ 
          error: "The value is out of the allowed range."
        }, { status: 400 });

      case 'P2024':
        return NextResponse.json({ 
          error: "The operation timed out. Please try again."
        }, { status: 408 });

      case 'P2028':
        return NextResponse.json({ 
          error: "Transaction failed. Please try again."
        }, { status: 409 });

      case 'P2034':
        return NextResponse.json({ 
          error: "Operation conflict detected. Please try again."
        }, { status: 409 });

      case 'P2037':
        return NextResponse.json({ 
          error: "Service is temporarily unavailable. Please try again later."
        }, { status: 503 });

      default:
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
  
  return NextResponse.json({ 
    error: "An unexpected error occurred. Please try again later." 
  }, { status: 500 });
}

export function handleActionsPrismaError(error: unknown): PrismaErrorResponse {
 

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      // Authentication & Connection Errors
      case 'P1008':
      case 'P1001':
      case 'P1002':
        return {
          error: "Unable to connect to the database. Please try again later.",
          code: error.code,
        };

      // Data Constraint Errors
      case 'P2002': {
        const target = Array.isArray(error.meta?.target) 
          ? 'these fields' 
          : 'this field';
        return {
          error: `A record with ${target} already exists.`,
          code: error.code,
        };
      }

      case 'P2003':
      case 'P2014':
      case 'P2017':
        return {
          error: "Invalid relationship between records.",
          code: error.code,
        };

      case 'P2025':
      case 'P2001':
      case 'P2015':
      case 'P2018':
        return {
          error: "The requested record was not found.",
          code: error.code,
        };

      case 'P2011':
      case 'P2012':
        return {
          error: "Required field is missing or empty.",
          code: error.code,
        };

      case 'P2024':
        return {
          error: "The operation timed out. Please try again.",
          code: error.code,
        };

      case 'P2034':
        return {
          error: "Operation conflict detected. Please try again.",
          code: error.code,
        };

      default:
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

  return { 
    error: "An unexpected error occurred. Please try again later." 
  };
}
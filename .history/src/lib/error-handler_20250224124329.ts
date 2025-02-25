import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { PrismaErrorResponse } from "@/types/payroll";

export function handlePrismaError(error: any) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        const target = Array.isArray(error.meta?.target) 
          ? error.meta?.target.join(', ') 
          : error.meta?.target || 'record';
        return NextResponse.json({ 
          error: `A ${error.meta?.modelName} with this ${target} already exists.`
        }, { status: 409 });
      
      case 'P2014':
        return NextResponse.json({ 
          error: "The records you're trying to connect are not compatible or missing required relationships.",
          details: error.meta 
        }, { status: 400 });
      
      case 'P2003': {
        const field = error.meta?.field_name || 'field';
        return NextResponse.json({ 
          error: `The reference provided for ${field} is invalid or doesn't exist.`
        }, { status: 400 });
      }
      
      case 'P2025':
        return NextResponse.json({ 
          error: "The record you're trying to update or delete could not be found."
        }, { status: 404 });
      
      case 'P2016':
        return NextResponse.json({ 
          error: "The query constraints or filters are invalid for this operation."
        }, { status: 400 });
      
      case 'P2001':
        return NextResponse.json({ 
          error: "The record you're trying to access does not exist."
        }, { status: 404 });
      
      default:
        return NextResponse.json({ 
          error: "There was an issue with the database operation.",
          code: error.code 
        }, { status: 400 });
    }
  }
  
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json({ 
      error: "The data provided is invalid or missing required fields.",
      details: error.message 
    }, { status: 400 });
  }
  
  return NextResponse.json({ 
    error: "An unexpected error occurred. Please try again later." 
  }, { status: 500 });
}

export function handleActionsPrismaError(error: unknown): PrismaErrorResponse {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const target = Array.isArray(error.meta?.target) 
          ? error.meta?.target.join(', ') 
          : error.meta?.target || 'record';
        return {
          error: `A ${error.meta?.modelName} with this ${target} already exists.`,
          code: error.code,
        };
      }
      
      case "P2014":
        return {
          error: "The records you're trying to connect are not compatible or missing required relationships.",
          details: error.meta,
          code: error.code,
        };
      
      case "P2003": {
        const field = error.meta?.field_name || "field";
        return {
          error: `The reference provided for ${field} is invalid or doesn't exist.`,
          code: error.code,
        };
      }
      
      case "P2025":
        return {
          error: "The record you're trying to update or delete could not be found.",
          code: error.code,
        };
      
      case "P2016":
        return {
          error: "The query constraints or filters are invalid for this operation.",
          code: error.code,
        };
      
      case "P2001":
        return {
          error: "The record you're trying to access does not exist.",
          code: error.code,
        };

      default:
        return {
          error: "There was an issue with the database operation.",
          code: error.code,
        };
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      error: "The data provided is invalid or missing required fields.",
      details: error.message,
    };
  }

  return { 
    error: "An unexpected error occurred. Please try again later." 
  };
}
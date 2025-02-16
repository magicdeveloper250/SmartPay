"use server";

import { getServerSession } from "next-auth";
import { getPayrollEmployees } from "@/data/getEmployees";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import { PaymentStatus } from "@prisma/client";
import { handlePrismaError } from "@/lib/error-handler";
import fs from "fs";
import path from "path";

export async function exportPayrollToCSV(query: string, currentPage: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const { payroll } = await getPayrollEmployees(session.user.email, query, currentPage);

  const headers = ["ID", "Names", "Basic Salary", "Fringe Benefits", "Additions", "Taxes", "Other Expenses", "Net Salary"];

  const rows = payroll?.processedEmployees?.map((employee) => [
    employee.id,
    `${employee.firstName} ${employee.secondName}`,
    employee.monthlyGross,
    employee.benefits.map((benefit) => benefit.benefit).join(", "),
    employee.additionalIncomes.map((income) => `${income.id} ${income.type} (${(income.amount).toFixed(1)}%)`).join(", "),  
    employee.appliedTaxes.map((tax) => `${tax.tax.name} (${(tax.tax.rate * 100).toFixed(1)}%)`).join(", "),
    employee.deductions.map((deduction) => `${deduction.reason} (${(deduction.amount).toFixed(1)}%)`).join(", "),,   
    employee.monthlyGross - employee.appliedTaxes.reduce((sum, tax) => sum + employee.monthlyGross * tax.tax.rate, 0),
  ]);
  const csvContent = [headers, ...rows||[]].map((row) => row.join(",")).join("\n");
 
  const filePath = path.join(process.cwd(), "public", "exports", `payroll_export_${Date.now()}.csv`);
 
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
 
  fs.writeFileSync(filePath, csvContent);
 
  return filePath;
}

 

export async function exportPayrollToJSON(query: string, currentPage: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  const { payroll } = await getPayrollEmployees(session.user.email, query, currentPage);
  // const data = payroll?.processedEmployees?.map((employee) => ({
  //   id: employee.id,
  //   name: `${employee.firstName} ${employee.secondName}`,
  //   basicSalary: employee.monthlyGross,
  //   fringeBenefits: employee.benefits.map((benefit) => benefit.benefit),
  //   additions: employee.additionalIncomes, 
  //   taxes: employee.appliedTaxes,
  //   otherExpenses:employee.deductions,  
  //   netSalary:employee.netSalary
  // }));
  const filePath = path.join(process.cwd(), "public", "exports", `payroll_export_${Date.now()}.json`);

  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(payroll, null, 2));

  return filePath;
}


export async function SavePayroll() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  try {
    // Fetch the company associated with the logged-in admin
    const company = await prisma.company.findUnique({
      where: { adminEmail: session.user.email },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    // Fetch all employees for the company, including their related data
    const employees = await prisma.employee.findMany({
      where: {
        companyId: company.id,
      },
      include: {
        appliedTaxes: {
          include: {
            tax: true,
          },
        },
        benefits: true,
        additionalIncomes: {
          where: {
            payment_status: PaymentStatus.Pending,
          },
        },
        deductions: {
          where: {
            status: PaymentStatus.Pending,
          },
        },
      },
    });

    const processedPayrollEmployees = employees.map((employee) => {
      const totalAdditions = employee.additionalIncomes.reduce((sum, income) => sum + income.amount, 0);
      const totalDeductions = employee.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
      const totalTaxes = employee.appliedTaxes.reduce((sum, tax) => sum + employee.monthlyGross * tax.tax.rate, 0);
      const netSalary = employee.monthlyGross - (totalTaxes + totalDeductions) + totalAdditions;
    
      return {
        employee: {
          connect: { id: employee.id } // ✅ Establish relation correctly
        },
        paymentDate: new Date().toISOString(),
        additionalIncomes: {
          create: employee.additionalIncomes.map((income) => ({
            amount: income.amount,
            description: income.description,
            income_type: income.income_type,
            currency: income.currency,
          })),
        },
        taxes: {
          create: employee.appliedTaxes.map((tax) => ({
            taxId: tax.tax.id, // ✅ Connect to tax
          })),
        },
        deductions: {
          create: employee.deductions.map((deduction) => ({
            amount: deduction.amount,
            reason: deduction.reason,
          })),
        },
        salary: employee.monthlyGross,
        netSalary: netSalary,
      };
    });
    

    // Use a transaction to batch all payroll creations
    await prisma.$transaction(
      processedPayrollEmployees.map((payrollData) =>
        prisma.payroll.create({
          data: payrollData,
        })
      )
    );

    return {
      message: "Payroll saved successfully",
    };
  } catch (error) {
    console.error("Error saving payroll:", error.stack);
    // Replace with proper error handling or rethrow the error
    throw new Error("Failed to save payroll");
  }
}


 
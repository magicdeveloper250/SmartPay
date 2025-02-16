// actions/exportPayroll.ts
"use server";

import { getServerSession } from "next-auth";
import { getPayrollEmployees } from "@/data/getEmployees";
import { authOptions } from "@/utils/auth";
import fs from "fs";
import path from "path";

export async function exportPayrollToCSV(query: string, currentPage: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const { employees } = await getPayrollEmployees(session.user.email, query, currentPage);

  // Define CSV headers
  const headers = ["ID", "Names", "Basic Salary", "Fringe Benefits", "Additions", "Taxes", "Other Expenses", "Net Salary"];

  // Convert employee data to CSV rows
  const rows = employees?.map((employee) => [
    employee.id,
    `${employee.firstName} ${employee.secondName}`,
    employee.monthlyGross,
    employee.benefits.map((benefit) => benefit.benefit).join(", "),
    "", // Additions (if any)
    employee.appliedTaxes.map((tax) => `${tax.tax.name} (${(tax.tax.rate * 100).toFixed(1)}%)`).join(", "),
    "", // Other Expenses (if any)
    employee.monthlyGross - employee.appliedTaxes.reduce((sum, tax) => sum + employee.monthlyGross * tax.tax.rate, 0),
  ]);

  // Combine headers and rows into CSV content
  const csvContent = [headers, ...rows||[]].map((row) => row.join(",")).join("\n");

  // Define the file path where the CSV will be saved
  const filePath = path.join(process.cwd(), "public", "exports", `payroll_export_${Date.now()}.csv`);

  // Ensure the "exports" directory exists
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Write the CSV content to the file
  fs.writeFileSync(filePath, csvContent);

  // Return the file path for reference
  return filePath;
}
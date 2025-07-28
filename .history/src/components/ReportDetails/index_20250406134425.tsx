import { getEmployee } from "@/actions/employeeActions";
import { notFound } from "next/navigation";
import ReportDisplay from "./ReportView";



export default async function PayrollReportDetails({ employeeId }: { employeeId: string }) {
  const employee = await getEmployee(employeeId);
  if ("error" in employee) {
    notFound();
  }

  return <ReportDisplay employee={employee} benefits={employee.benefits} taxes={employee.appliedTaxes} additionalIncomes={employee.additionalIncomes} deductions={employee.deductions} contributions={employee.appliedContributions} />
   
}

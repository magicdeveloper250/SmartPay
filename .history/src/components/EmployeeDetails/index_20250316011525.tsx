import { getEmployee } from "@/actions/employeeActions";
import { notFound } from "next/navigation";
import EmployeeDisplay from "./employee";



export default async function EmployeeDetails({ employeeId }: { employeeId: string }) {
  const employee = await getEmployee(employeeId);
  if ("error" in employee) {
    notFound();
  }

  return <EmployeeDisplay employee={employee} benefits={employee.benefits} taxes={employee.appliedTaxes} additionalIncomes={employee.additionalIncomes} deductions={employee.deductions} contributions={employee.appliedContributions} />
   
}

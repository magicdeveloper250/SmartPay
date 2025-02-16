import { getEmployee } from "@/actions/employeeActions";
import { notFound } from "next/navigation";
import ContractorDisplay from "./contractor";



export default async function ContractorDetails({ employeeId }: { employeeId: string }) {
  const employee = await getEmployee(employeeId);
  if ("error" in employee) {
    notFound();
  }

  return <ContractorDisplay employee={employee} benefits={employee.benefits} taxes={employee.appliedTaxes}/>
   
}

import { notFound } from "next/navigation";
import {ReportDisplay }from "./ReportView";
import { getTransactionPayrollById } from "@/actions/reportActions";



export default async function PayrollReportDetails({ payrollId }: { payrollId: string }) {
  const payroll = await getTransactionPayrollById(payrollId);
  if ("error" in payroll) {
    console.log(payroll.error)
    notFound();
  }

  return <ReportDisplay  paycheckData={payroll}/>
   
}

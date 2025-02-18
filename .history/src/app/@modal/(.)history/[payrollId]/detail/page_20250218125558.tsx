import { getPayrollById } from "@/actions/payroll";
import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {Modal } from "@/components/Modal";
import { PayrollDetail } from "@/components/PayrollDetails";
import { Suspense } from "react";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    payrollId?: string;
  };
}
 

export default async function Page({ params }: PageProps){
    const payroll = await getPayrollById(params.payrollId || "");
     if ("error" in payroll) {
       notFound();
     }
  return (
    <Modal
      title="Payroll Details" 
      backButtonDisabled={true}
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
         <PayrollDetail mainPayroll={payroll} />
        
       </Suspense>
    </Modal>
  );
}

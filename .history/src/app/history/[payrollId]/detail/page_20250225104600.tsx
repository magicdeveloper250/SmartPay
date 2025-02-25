import { getPayrollById } from "@/actions/payroll";
import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {Modal } from "@/components/Modal";
import { PayrollDetail } from "@/components/PayrollDetails";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PayrollType } from "@prisma/client";


type Props = Promise<{ payrollId: string }>

export default async function Page( props: { params: Props }) {
    const { payrollId } = await props.params;
    const payroll = await getPayrollById(payrollId || "", PayrollType.EMPLOYEE);
     if ("error" in payroll) {
       notFound();
     }
  return (
    <Modal
      title="Payroll Details" 
      backButtonDisabled={true}
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
         <PayrollDetail mainPayroll={payroll.payroll} payrolls={payroll.payroll.payrolls}/>
        
       </Suspense>
    </Modal>
  );
}

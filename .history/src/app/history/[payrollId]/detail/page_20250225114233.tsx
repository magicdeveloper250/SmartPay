import { getPayrollById } from "@/actions/payroll";
import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {Modal } from "@/components/Modal";
import { PayrollDetail } from "@/components/PayrollDetails";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PaymentStatus, PayrollType } from "@prisma/client";

type Props = Promise<{ payrollId: string;
  type?:PaymentStatus; }>

export default async function Page( props: { params: Props }) {
  const { payrollId } = await props.params;
    const payroll = await getPayrollById(payrollId || "", PayrollType.CONTRACTOR);
     if ("error" in payroll) {
       notFound();
     }
  return (
    <Modal
      title="Payroll Details" 
      backButtonDisabled={true}
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
         <PayrollDetail mainPayroll={payroll} payrolls={payroll.payrolls} />
        
       </Suspense>
    </Modal>
  );
}
import { getPayrollById } from "@/actions/payroll";
import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {Modal } from "@/components/Modal";
import { PayrollDetail } from "@/components/PayrollDetails";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PayrollType } from "@prisma/client";

type Props = Promise<{ payrollId: string, type: PayrollType }>

type PayrollResponse = {
  payroll: MainPayroll & { payrolls: payrollWithEmployee[] };
  payrollType: PayrollType;
}

export default async function Page({ params }: { params: Props }) {
  const { payrollId, type } = await params;
  const response = await getPayrollById(payrollId || "", type);

  if ("error" in response) {
    notFound();
  }

  const { payroll, payrollType } = response as PayrollResponse;

  return (
    <Modal
      title="Payroll Details" 
      backButtonDisabled={true}
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
         <PayrollDetail mainPayroll={payroll} payrolls={payroll.payrolls} payrollType={payrollType} />
        
       </Suspense>
    </Modal>
  );
}

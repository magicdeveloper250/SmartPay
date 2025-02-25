import { getContractorPayrollById, getPayrollById } from "@/actions/payroll";
import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {Modal } from "@/components/Modal";
import { PayrollDetail } from "@/components/PayrollDetails";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PaymentStatus, PayrollType } from "@prisma/client";
import { ContractorPayrollDetail } from "@/components/PayrollDetails/ContractorPayrollDetails";

type Props = Promise<{ payrollId: string;
  type?:PayrollType; }>

export default async function Page( props: { params: Props }) {
  const { payrollId, type } = await props.params;
  const payrollType= type|| PayrollType.EMPLOYEE
  const payroll = payrollType==PayrollType.EMPLOYEE  ?await getPayrollById(payrollId || ""):await getContractorPayrollById(payrollId || "")
     if ("error" in payroll) {
       notFound();
     }
  return (
    <Modal
      title="Payroll Details" 
      backButtonDisabled={true}
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
        {payrollType==PayrollType.EMPLOYEE && 
          <PayrollDetail 
            mainPayroll={payroll} 
            payrolls={payroll.payrolls as payrollWithEmployee[]} 
          />
        }
        {payrollType==PayrollType.CONTRACTOR && 
          <ContractorPayrollDetail 
            mainPayroll={payroll} 
            payrolls={payroll.payrolls} 
          />
        }
       </Suspense>
    </Modal>
  );
}
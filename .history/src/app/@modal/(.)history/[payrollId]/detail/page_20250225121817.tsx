import { getContractorPayrollById, getPayrollById } from "@/actions/payroll";
import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import { Modal } from "@/components/Modal";
import { PayrollDetail } from "@/components/PayrollDetails";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PaymentStatus, PayrollType } from "@prisma/client";
import { ContractorPayrollDetail } from "@/components/PayrollDetails/ContractorPayrollDetails";
import { payrollWithContractor, payrollWithEmployee } from "@/types/payroll";
 
type PageProps = {
  params: {
    payrollId: string;
  };
  searchParams: {
    type?: PayrollType;
  };
};

export default async function Page({ params, searchParams }: PageProps) {
  const { payrollId } = params;
  const payrollType = searchParams.type || PayrollType.EMPLOYEE;
  console.log("Payrolltype.................................................: ", payrollType)
  const payroll = payrollType === PayrollType.EMPLOYEE 
    ? await getPayrollById(payrollId)
    : await getContractorPayrollById(payrollId);

  if ("error" in payroll) {
    notFound();
  }

  return (
    <Modal
      title="Payroll Details" 
      backButtonDisabled={true}
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
        {payrollType === PayrollType.EMPLOYEE && 
          <PayrollDetail 
            mainPayroll={payroll} 
            payrolls={payroll.payrolls as payrollWithEmployee[]} 
          />
        }
        {payrollType === PayrollType.CONTRACTOR && 
          <ContractorPayrollDetail 
            mainPayroll={payroll} 
            payrolls={payroll.payrolls as payrollWithContractor[]} 
          />
        }
       </Suspense>
    </Modal>
  );
}
import { getContractorPayrollById, getPayrollById } from "@/actions/payroll";
import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import { Modal } from "@/components/Modal";
import { PayrollDetail } from "@/components/PayrollDetails";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PayrollType } from "@prisma/client";
import { ContractorPayrollDetail } from "@/components/PayrollDetails/ContractorPayrollDetails";
import { payrollWithContractor, payrollWithEmployee } from "@/types/payroll";
 
type PageProps = Promise<{
  params: {
    payrollId: string;
  };
  searchParams: {
    type?: PayrollType;
  };
}>

export default async function Page(props :PageProps ) {
  const { params, searchParams } = await props;
 
  const payrollType = searchParams.type || PayrollType.EMPLOYEE;
  const payroll = payrollType === PayrollType.EMPLOYEE 
    ? await getPayrollById(params.payrollId)
    : await getContractorPayrollById(params.payrollId);

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
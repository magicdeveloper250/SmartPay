import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {FitModal} from "@/components/Modal";
import { PayrollHistory } from "@/components/PayHistory";
import { PaymentStatus, PayrollType } from "@prisma/client";
import { Suspense } from "react";

 

export default async function Page(props: {
  searchParams?: Promise<{
    status?:PaymentStatus;
    type?:PayrollType;
    page?: string;
  }>;
}){
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const status= searchParams?.status || PaymentStatus.Pending
  const type= searchParams?.type || PayrollType.EMPLOYEE
  return (
    <FitModal
      title="Recents Payrolls" 
      backButtonDisabled={true}
      width="xl"
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
        <PayrollHistory currentPage={currentPage} status= {status} type={type}/>
        
       </Suspense>
    </FitModal>
  );
}

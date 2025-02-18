import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {FitModal} from "@/components/Modal";
import { PayrollHistory } from "@/components/PayHistory";
import { PaymentStatus } from "@prisma/client";
import { Suspense } from "react";

 

export default async function Page(props: {
  searchParams?: Promise<{
    status?:PaymentStatus;
    page?: string;
  }>;
}){
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  return (
    <FitModal
      title="Recents Payrolls" 
      backButtonDisabled={true}
      width="xl"
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
        <PayrollHistory currentPage={currentPage}/>
        
       </Suspense>
    </FitModal>
  );
}

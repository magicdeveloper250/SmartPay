import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {FitModal} from "@/components/Modal";
import { PayrollHistory } from "@/components/PayHistory";
import { Suspense } from "react";

 

export default async function async (props: {
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  return (
    <FitModal 
      title="Recents Payrolls" 
      backButtonDisabled={true}
      width="xl"
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
        <PayrollHistory/>
        
       </Suspense>
    </FitModal>
  );
}

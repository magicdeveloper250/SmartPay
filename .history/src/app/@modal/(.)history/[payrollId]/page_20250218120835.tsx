import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {DetailsModal } from "@/components/Modal";
import { PayrollDetail } from "@/components/PayrollDetails";
import { Suspense } from "react";

interface PageProps {
  params: {
    payrollId?: string;
  };
}
 

export default async function Page({ params }: PageProps){
   
  return (
    <DetailsModal
      title="Recents Payrolls" 
      backButtonDisabled={true}
      width="xl"
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
         <PayrollDetail/>
        
       </Suspense>
    </DetailsModal>
  );
}

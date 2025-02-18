import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {DetailsModal } from "@/components/Modal";
import { PayrollHistory } from "@/components/PayHistory";
import { PayrollDetail } from "@/components/PayrollDetails";
import { PaymentStatus } from "@prisma/client";
import { Suspense } from "react";

interface PageProps {
  params: {
    contractorId?: string;
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

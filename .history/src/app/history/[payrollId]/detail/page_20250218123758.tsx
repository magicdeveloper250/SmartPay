import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {Modal } from "@/components/Modal";
import { PayrollDetail } from "@/components/PayrollDetails";
import { Suspense } from "react";

interface PageProps {
  params: {
    payrollId?: string;
  };
}
 

export default async function Page({ params }: PageProps){
   
  return (
    <Modal
      title="Recents Payrolls" 
      backButtonDisabled={true}
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
         <PayrollDetail/>
        
       </Suspense>
    </Modal>
  );
}

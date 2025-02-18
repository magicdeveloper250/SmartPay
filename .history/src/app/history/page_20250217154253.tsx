import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {Modal} from "@/components/Modal";
import { PayrollHistory } from "@/components/PayHistory";
import { Suspense } from "react";

interface PageProps {
  params: {
    employeeId?: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { employeeId } = params;
  return (
    <Modal 
      title="Recents Payrolls" 
      backButtonDisabled={true}
      width="xl"
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
        <PayrollHistory/>
        
       </Suspense>
    </Modal>
  );
}

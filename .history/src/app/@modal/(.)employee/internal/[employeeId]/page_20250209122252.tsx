import EmployeeDetails from "@/components/EmployeeDetails";
import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {DetailsModal} from "@/components/Modal";
import { Suspense } from "react";

interface PageProps {
  params: {
    employeeId?: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { employeeId } = params;
  return (
    <DetailsModal 
      title="Employee Information" 
      backButtonDisabled={true}
      width="md"
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
       <EmployeeDetails employeeId={employeeId ||""}/>
        
       </Suspense>
    </DetailsModal>
  );
}

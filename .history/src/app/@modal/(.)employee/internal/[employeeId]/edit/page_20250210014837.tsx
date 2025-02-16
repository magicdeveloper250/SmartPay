import EmployeeDetails from "@/components/EmployeeDetails";
import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import { Modal} from "@/components/Modal";
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
      title="Employee Information" 
      backButtonDisabled={true}
      
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
       <EmployeeDetails employeeId={employeeId ||""}/>
        
       </Suspense>
    </Modal>
  );
}

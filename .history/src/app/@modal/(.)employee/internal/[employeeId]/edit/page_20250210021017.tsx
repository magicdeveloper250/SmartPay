import EditEmployeeForm from "@/components/EditEmployeeForm";
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
        <EditEmployeeForm employeeId={employeeId || ""}/>
    </Modal>
  );
}

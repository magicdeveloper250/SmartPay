import EmployeeDetails from "@/components/EmployeeDetails";
import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {DetailsModal} from "@/components/Modal";
import { Suspense } from "react";


export default async function Page(props: {
  employeeParams?: Promise<{
    employeeId?: string;
  }>;
}) {
  const params  = await props.employeeParams;
  return (
    <DetailsModal 
      title="Employee Information" 
      backButtonDisabled={true}
      width="md"
    >
       <Suspense fallback={<EmployeeDetails employeeId={params?.employeeId ||""}/>}>
        <EmployeeDetailsSkeleton/>
       </Suspense>
    </DetailsModal>
  );
}

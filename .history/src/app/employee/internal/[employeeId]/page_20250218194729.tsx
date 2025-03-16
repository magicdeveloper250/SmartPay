import EmployeeDetails from "@/components/EmployeeDetails";
import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {DetailsModal} from "@/components/Modal";
import { Suspense } from "react";


type Props = Promise<{ employeeId: string }>

export default async function Page( props: { params: Props }) {
  const { employeeId} = await props.params;
  return (
    <DetailsModal 
      title="Employee Information" 
      backButtonDisabled={true}
      width="xl"
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
       <EmployeeDetails employeeId={employeeId ||""}/>
        
       </Suspense>
    </DetailsModal>
  );
}

import ContractorDetails from "@/components/ContractorDetails";
import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {DetailsModal} from "@/components/Modal";
import { Suspense } from "react";

type Props = Promise<{ contractorId: string }>

export default async function Page( props: { params: Props }) {
  const { contractorId } = await props.params;
 

  return (
    <DetailsModal 
      title="Contractor Information" 
      backButtonDisabled={true}
      width="xl"
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
       <ContractorDetails contractorId={contractorId ||""}/>
        
       </Suspense>
    </DetailsModal>
  );
}

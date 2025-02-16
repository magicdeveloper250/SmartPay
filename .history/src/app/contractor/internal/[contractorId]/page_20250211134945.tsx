import ContractorDetails from "@/components/ContractorDetails";
import EmployeeDetails from "@/components/EmployeeDetails";
import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {DetailsModal} from "@/components/Modal";
import { Suspense } from "react";

interface PageProps {
  params: {
    contractorId?: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { contractorId } = params;
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

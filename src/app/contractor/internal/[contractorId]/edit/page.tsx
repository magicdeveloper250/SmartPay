import EditContractorForm from "@/components/EditContractorForm";
import { Modal} from "@/components/Modal";
 
import { getContractor } from "@/actions/contractorActions";
import { Suspense } from "react";
import { ContractorDetailsSkeleton } from "@/components/ContractorDetails/skeleton";
import { ContractorFormSkeleton } from "@/components/ContractorForm/skeleton";

type Props = Promise<{ contractorId: string }>

export default async function Page( props: { params: Props }) {
  const { contractorId } = await props.params;

  return (
    <Modal 
      title="Edit Contractor Information" 
      backButtonDisabled={true}
      
    >
        <Suspense fallback={<ContractorFormSkeleton/>}>
        <EditContractorForm contractorId={contractorId}  />
        </Suspense>
    </Modal>
  );
}

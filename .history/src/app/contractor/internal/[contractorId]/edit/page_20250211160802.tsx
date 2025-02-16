import EditContractorForm from "@/components/EditContractorForm";
import { Modal} from "@/components/Modal";
 

interface PageProps {
  params: {
    contractorId?: string;
    contractId?: string;

  };
}

export default async function Page({ params }: PageProps) {
  const { contractorId, contractId } = params;
  return (
    <Modal 
      title="Edit Contractor Information" 
      backButtonDisabled={true}
      
    >
        <EditContractorForm contractorId={contractorId || "" } contractId={contractId||""}/>
    </Modal>
  );
}

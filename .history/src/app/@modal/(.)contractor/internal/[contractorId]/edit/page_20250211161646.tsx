import EditContractorForm from "@/components/EditContractorForm";
import { Modal} from "@/components/Modal";
 

interface PageProps {
  params: {
    contractorId?: string;

  };
}

export default async function Page({ params }: PageProps) {
  const { contractorId } = params;
  return (
    <Modal 
      title="Edit Contractor Information" 
      backButtonDisabled={true}
      width="lg"
    >
        <EditContractorForm contractorId={contractorId || "" } />
    </Modal>
  );
}

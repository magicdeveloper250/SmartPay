 
import ContractPaper from "@/components/ContractPaper";
import { Modal} from "@/components/Modal";
 

interface PageProps {
  params: {
    contractId?: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { contractId } = params;
  return (
    <Modal 
      title="Edit Employee Information" 
      backButtonDisabled={true}
      
    >
        <ContractPaper contractorId={contractId || ""}/>
    </Modal>
  );
}

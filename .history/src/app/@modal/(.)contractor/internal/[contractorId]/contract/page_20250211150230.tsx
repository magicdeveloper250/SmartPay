 
import ContractPaper from "@/components/ContractPaper";
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
      title="Contract" 
      backButtonDisabled={true}
      
    >
        <ContractPaper contractId={contractorId || ""}/>
    </Modal>
  );
}

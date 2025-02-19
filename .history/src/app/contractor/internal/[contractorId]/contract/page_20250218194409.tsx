 
import ContractPaper from "@/components/ContractPaper";
import { Modal} from "@/components/Modal";
 

type Props = Promise<{ contractorId: string }>

export default async function Page( props: { params: Props }) {
  const { contractorId } = await props.params;
  return (
    <Modal 
      title="Contract" 
      backButtonDisabled={true}
      width="sm"
      
    >
        <ContractPaper contractId={contractorId || ""}/>
    </Modal>
  );
}

 
import ContractPaper from "@/components/ContractPaper";
import { A4Modal, FitModal, Modal} from "@/components/Modal";
 

type Props = Promise<{ contractorId: string }>

export default async function Page( props: { params: Props }) {
  const { contractorId } = await props.params;
  return (
    <A4Modal
      title="Contract" 
      backButtonDisabled={true}
    >
        <ContractPaper contractId={contractorId || ""}/>
    </A4Modal>
  );
}

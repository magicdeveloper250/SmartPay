 
import ContractPaper from "@/components/ContractPaper";
import { FitModal, Modal} from "@/components/Modal";
 

type Props = Promise<{ contractorId: string }>

export default async function Page( props: { params: Props }) {
  const { contractorId } = await props.params;
  return (
    <FitModal 
      title="Contract" 
      backButtonDisabled={true}
      width="lg"
    >
        <ContractPaper contractId={contractorId || ""}/>
    </FitModal>
  );
}

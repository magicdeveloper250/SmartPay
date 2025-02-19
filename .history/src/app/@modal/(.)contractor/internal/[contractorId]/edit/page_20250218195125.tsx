import EditContractorForm from "@/components/EditContractorForm";
import { Modal} from "@/components/Modal";
 


type Props = Promise<{ contractorId: string }>

export default async function Page( props: { params: Props }) {
  const { contractorId } = await props.params;
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

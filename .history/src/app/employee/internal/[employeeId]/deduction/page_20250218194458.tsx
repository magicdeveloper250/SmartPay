import DeductionForm from "@/components/DeductionForm";
 
import { FitModal, Modal} from "@/components/Modal";
 

type Props = Promise<{ employeeId: string }>

export default async function Page( props: { params: Props }) {
  const { employeeId } = await props.params;
  return (
    <FitModal
      title="Deduction" 
      backButtonDisabled={true}
      
    >
        <DeductionForm employeeId={employeeId || ""}/>
    </FitModal>
  );
}

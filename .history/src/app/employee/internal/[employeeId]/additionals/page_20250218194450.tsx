import AdditionalIncomeForm from "@/components/AdditionalIncomeForm";
 
import { FitModal, Modal} from "@/components/Modal";
 

type Props = Promise<{ employeeId: string }>

export default async function Page( props: { params: Props }) {
  const { employeeId } = await props.params;
  return (
    <FitModal
      title="New Income" 
      backButtonDisabled={true}
      
    >
        <AdditionalIncomeForm employeeId={employeeId || ""}/>
    </FitModal>
  );
}

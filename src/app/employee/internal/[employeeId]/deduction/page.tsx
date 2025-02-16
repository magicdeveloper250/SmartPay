import DeductionForm from "@/components/DeductionForm";
 
import { FitModal, Modal} from "@/components/Modal";
 

interface PageProps {
  params: {
    employeeId?: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { employeeId } = params;
  return (
    <FitModal
      title="Deduction" 
      backButtonDisabled={true}
      
    >
        <DeductionForm employeeId={employeeId || ""}/>
    </FitModal>
  );
}

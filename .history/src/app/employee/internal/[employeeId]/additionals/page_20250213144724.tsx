import AdditionalIncomeForm from "@/components/AdditionalIncomeForm";
 
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
      title="Edit Employee Information" 
      backButtonDisabled={true}
      
    >
        <AdditionalIncomeForm/>
    </FitModal>
  );
}

import AdditionalIncomeForm from "@/components/AdditionalIncomeForm";
 
import { FitModal} from "@/components/Modal";
 

interface PageProps {
  params: {
    employeeId?: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { employeeId } = params;
  return (
    <FitModal
      title="New Income" 
      backButtonDisabled={true}
      
    >
        <AdditionalIncomeForm/>
    </FitModal>
  );
}

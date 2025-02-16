import AdditionalIncomeForm from "@/components/AdditionalIncomeForm";
import EditEmployeeForm from "@/components/EditEmployeeForm";
 
import { Modal} from "@/components/Modal";
 

interface PageProps {
  params: {
    employeeId?: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { employeeId } = params;
  return (
    <Modal 
      title="Edit Employee Information" 
      backButtonDisabled={true}
      
    >
        <AdditionalIncomeForm/>
    </Modal>
  );
}

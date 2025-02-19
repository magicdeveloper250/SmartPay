import EditEmployeeForm from "@/components/EditEmployeeForm";
import { Modal} from "@/components/Modal";
 

type Props = Promise<{ employeeId: string }>

export default async function Page( props: { params: Props }) {
  const { employeeId } = await props.params;
  return (
    <Modal 
      title="Edit Employee Information" 
      backButtonDisabled={true}
      
    >
        <EditEmployeeForm employeeId={employeeId || ""}/>
    </Modal>
  );
}

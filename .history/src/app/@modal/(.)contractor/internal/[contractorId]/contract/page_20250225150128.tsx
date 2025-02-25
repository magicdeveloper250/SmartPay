import { getContractByID } from "@/actions/contractActions";
import ContractPaper from "@/components/ContractPaper";
import { A4Modal, FitModal, Modal} from "@/components/Modal";
import { Suspense } from "react";
import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";

type Props = Promise<{ contractorId: string }>

export default async function Page( props: { params: Props }) {
  const { contractorId } = await props.params;
  const contract = await getContractByID(contractorId);
  
  if ('error' in contract) {
    return <div>Error: {contract.error}</div>;
  }

  return (
    <A4Modal
      title="" 
      backButtonDisabled={true}
    >   <Suspense fallback={<EmployeeDetailsSkeleton/>}>
        <ContractPaper contract={contract}/>
        </Suspense>
    </A4Modal>
  );
}

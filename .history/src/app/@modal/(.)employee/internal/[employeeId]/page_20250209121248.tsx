import EmployeeDetails from "@/components/EmployeeDetails";
import {DetailsModal} from "@/components/Modal";


export default async function Page({employeeParams}: {
  employeeParams?: Promise<{
    employeeId?: string;
  }>;
}) {
  const params  = await employeeParams;
  console.log(params)
  return (
    <DetailsModal 
      title="Employee Information" 
      backButtonDisabled={true}
      width="xl"
    >
       <EmployeeDetails employeeId={params?.employeeId || ""}/>
    </DetailsModal>
  );
}

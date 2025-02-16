"use client";

import EmployeeDetails from "@/components/EmployeeDetails";
import {DetailsModal} from "@/components/Modal";


export default async function EmployeeInformation({ params }: { params: { employeeId: string } }) {
  const { employeeId } = params;
  return (
    <DetailsModal 
      title="Employee Information" 
      backButtonDisabled={true}
    >
       <EmployeeDetails employeeId={employeeId}/>
    </DetailsModal>
  );
}

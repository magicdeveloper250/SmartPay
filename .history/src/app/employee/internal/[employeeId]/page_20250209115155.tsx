"use client";

import {DetailsModal} from "@/components/Modal";
import EmployeeDetails from "@/components/EmployeeDetails";


export default function OnBoarding({ params }: { params: { employeeId: string } }) {
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

"use client";

import {DetailsModal} from "@/components/Modal";


export default function EmployeeInformation({ params }: { params: { employeeId: string } }) {
  const { employeeId } = params;
  return (
    <DetailsModal 
      title="Employee Information" 
      backButtonDisabled={true}
    >
        <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1>
        The Employee ID is <b>{employeeId}</b>   
      </h1>
    </div>
    </DetailsModal>
  );
}

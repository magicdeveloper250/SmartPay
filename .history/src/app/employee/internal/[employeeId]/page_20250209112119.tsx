"use client";

import {Modal} from "@/components/Modal";


export default function OnBoarding({ params }: { params: { employeeId: string } }) {
  const { employeeId } = params;
  return (
    <Modal 
      title="Employee Information" 
      backButtonDisabled={true}
    >
        <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1>
        The Employee ID is <b>{employeeId}</b>   
      </h1>
    </div>
    </Modal>
  );
}

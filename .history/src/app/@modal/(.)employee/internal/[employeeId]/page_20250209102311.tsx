"use client";

import Modal from "@/components/Modal";


export default function OnBoarding({ params }: { params: { employeeId: string } }) {
  const { employeeId } = params;
  return (
    <Modal 
      title="Employee Information" 
      backButtonDisabled={true}
    >
        <div>
      <h1>
        The Employee ID is <b>{employeeId}</b>   
      </h1>
    </div>
    </Modal>
  );
}

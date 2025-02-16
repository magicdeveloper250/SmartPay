"use client";

import Modal from "@/components/Modal";


export default function OnBoarding({ params }: { params: { employeeId: string } }) {
  const { employeeId } = params;
  console.log(employeeId)
  return (
    <Modal 
      title="Employee Onboarding" 
      backButtonDisabled={true}
    >
        <div className="bg-slate-500 w-96 text-center my-20 p-10 mx-20">
      <h1>
        The Employee ID is <b>{employeeId}</b>   
      </h1>
    </div>
    </Modal>
  );
}

"use client";
import {Modal }from "@/components/Modal";
import EmployeeForm from "@/components/EmployeeForm";


export default function Page() {
  return (
    <Modal title="Employee Form"  backButtonDisabled={true}>
     <EmployeeForm/>
    </Modal>
  );
}
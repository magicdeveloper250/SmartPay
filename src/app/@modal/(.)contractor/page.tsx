"use client";
import {Modal }from "@/components/Modal";
import ContractorForm from "@/components/ContractorForm";


export default function Page() {
  return (
    <Modal title="Contractor Form"  backButtonDisabled={true}>
     <ContractorForm/>
    </Modal>
  );
}
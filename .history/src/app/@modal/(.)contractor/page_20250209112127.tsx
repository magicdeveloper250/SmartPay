"use client";
import {Modal }from "@/components/Modal";
import ContractorPage from "@/app/contractor/page";


export default function Contractor() {
  return (
    <Modal title="Contractor Form"  backButtonDisabled={true}>
     <ContractorPage/>
    </Modal>
  );
}
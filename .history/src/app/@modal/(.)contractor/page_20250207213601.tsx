"use client";
import Modal from "@/components/Modal";
import { useRouter } from "next/router";
import ContractorForm from "@/components/ContractorForm";


export default function OnBoarding() {
  const router= useRouter()
  return (
    <Modal title="Contractor Form" onBack={()=>router.back()} backButtonDisabled={true}>
     <ContractorForm/>
    </Modal>
  );
}
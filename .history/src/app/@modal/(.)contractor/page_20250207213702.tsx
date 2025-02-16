"use client";
import Modal from "@/components/Modal";
import ContractorPage from "@/app/contractor/page";
import { useRouter } from "next/router";
import ContractorForm from "@/components/ContractorForm";


export default function OnBoarding() {
  const router= useRouter()
  return (
    <Modal title="Contractor Form" onBack={()=>router.back()} backButtonDisabled={true}>
     <ContractorPage/>
    </Modal>
  );
}
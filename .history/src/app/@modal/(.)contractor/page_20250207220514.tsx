"use client";
import Modal from "@/components/Modal";
import ContractorPage from "@/app/contractor/page";
// import { useRouter } from "next/router";


export default function Contractor() {
  // const router= useRouter()
  return (
    <Modal title="Contractor Form"  backButtonDisabled={true}>
     <ContractorPage/>
    </Modal>
  );
}
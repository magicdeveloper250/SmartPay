"use client";
import Modal from "@/components/Modal";
import OnBoardingPage from "@/app/onboarding/page";
import { useRouter } from "next/router";


export default function OnBoarding() {
  const router= useRouter()
  return (
    <Modal title="Contractor Form" onBack={()=>router.back()} backButtonDisabled={true}>
     <OnBoardingPage/>
    </Modal>
  );
}
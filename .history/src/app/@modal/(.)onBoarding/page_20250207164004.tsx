"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import OnBoardingPage from "@/app/onboarding/page";

type OnboardingMode = "none" | "single" | "multiple" | "contractor";

export default function OnBoarding() {
  const [mode, setMode] = useState<OnboardingMode>("none");
  
  return (
    <Modal title="Employee Onboarding" onBack={()=>setMode("none")} backButtonDisabled={mode=="none"}>
     <OnBoardingPage/>
    </Modal>
  );
}
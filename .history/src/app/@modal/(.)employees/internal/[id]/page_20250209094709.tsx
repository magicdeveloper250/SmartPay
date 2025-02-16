"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import OnBoardingPage from "@/app/onboarding/page";

type OnboardingMode = "none" | "single" | "multiple" | "contractor";

export default function OnBoarding({ params }: { params: { employeeId: string } }) {
  const [mode, setMode] = useState<OnboardingMode>("none");
  const { employeeId } = params;
  return (
    <Modal 
      title="Employee Onboarding" 
      onBack={() => setMode("none")} 
      backButtonDisabled={mode === "none"}
    >
        <div className="bg-slate-500 w-96 text-center my-20 p-10 mx-20">
      <h1>
        The Employee ID is <b>{employeeId}</b>   
      </h1>
    </div>
    </Modal>
  );
}

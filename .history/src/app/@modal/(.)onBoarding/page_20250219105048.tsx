"use client";

import { useState,useEffect } from "react";
import {Modal} from "@/components/Modal";
import OnBoardingPage from "@/app/onboarding/page";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
type OnboardingMode = "none" | "single" | "multiple" | "contractor";

export default function OnBoarding() {
    const searchParams= useSearchParams()
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);

 useEffect(()=>{
 
  params.set('tab', "none");
  replace(`${pathname}?${params.toString()}`);
 })
  
  return (
    <Modal 
      title="Employee Onboarding" 
      backButtonDisabled={params.get("tab") === "none"}
    >
      <OnBoardingPage  />
    </Modal>
  );
}

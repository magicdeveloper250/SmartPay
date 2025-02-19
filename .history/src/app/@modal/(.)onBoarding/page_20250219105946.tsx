"use client";

import {  useEffect } from "react";
import {Modal} from "@/components/Modal";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function OnBoarding() {
    const searchParams= useSearchParams()
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);
    const tab=params.get("tab")

 useEffect(()=>{
 
  params.set('tab', "none");
  replace(`${pathname}?${params.toString()}`);
 })
  
  return (
    <Modal 
      title="Employee Onboarding" 
      backButtonDisabled={tab === "none"}
    >
    <OnBoarding/>
    </Modal>
  );
}

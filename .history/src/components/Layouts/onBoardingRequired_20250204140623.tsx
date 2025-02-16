 
"use client"
import { useCurrentCompany } from "@/hooks/use-current-company";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default  function OnBoardingRRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const checkOnBoarding=async()=>{
    const company= await useCurrentCompany()
   const router=useRouter()
   console.log("onBoardig: ", company?.onBoardingFinished)
  if(!company?.onBoardingFinished)
    router.push("/onboarding")
  }
   
   useEffect(()=>{
    checkOnBoarding
   },[])


  return (
   <>
             
      {children}
   </>
             
  );
}

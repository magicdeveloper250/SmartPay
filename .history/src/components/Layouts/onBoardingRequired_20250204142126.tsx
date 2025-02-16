 
"use client"
import { useCurrentCompany } from "@/hooks/use-current-company";
import { useEffect, useState } from "react";

export default  function OnBoardingRRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const[onBoarded, setOnBoarded]= useState(false)

  const checkOnBoarding=async()=>{
    const company= await useCurrentCompany()
  setOnBoarded(true)
  }
   
   useEffect(()=>{
    checkOnBoarding
   },[])


  return  onBoarded? {children}: <h1>Not boarded</h1>
             
  
}

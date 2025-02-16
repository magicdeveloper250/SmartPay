"use client";

import { useCurrentCompany } from "@/hooks/use-current-company";

export default function onBoardingRRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   
   const company= useCurrentCompany()
   console.log(company)
  return (
   <>
             
      {children}
   </>
             
  );
}

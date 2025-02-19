"use client" 

import EmployeeForm from "@/components/EmployeeForm";
import MultipleUploadForm from "@/components/MultipleUploadForm";
import { useSearchParams, usePathname,useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Modal } from "../Modal";
import { useEffect } from "react";

type OnboardingMode = "none" | "single" | "multiple" | "contractor";
 


export  default  function OnBoarding( ) {
      const searchParams= useSearchParams()
      const pathname = usePathname();
      const { replace } = useRouter();
      const params = new URLSearchParams(searchParams);
      const tab= searchParams.get("tab")
 
   const handleToggleTab = useDebouncedCallback((term:OnboardingMode) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('tab', term);
      } else {
        params.delete('tab');
      }
      replace(`${pathname}?${params.toString()}`);
    }, 10);

     useEffect(()=>{
     
      params.set('tab', "none");
      replace(`${pathname}?${params.toString()}`);
     }, [])
  return (
    <Modal 
      title="Employee Onboarding" 
      backButtonDisabled={tab === "none"}
    >
        <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
     

     {tab === "none" && (
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <button 
           onClick={() => handleToggleTab("single")}
           className="h-24 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
         >
           Single Employee Onboarding
         </button>
         <button 
           onClick={() => handleToggleTab("multiple")}
           className="h-24 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
         >
           Multiple Employee Onboarding
         </button>
       </div>
     )}

     {tab === "single" && <EmployeeForm />}
     {tab === "multiple" && <MultipleUploadForm />}
   </div>
      </Modal>
  );
}
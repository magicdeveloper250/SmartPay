"use client";

import { useState} from "react";
import { ChevronLeft } from "lucide-react";
import Modal from "@/components/Modal";
 
import EmployeeForm from "@/components/EmployeeForm";
import MultipleUploadForm from "@/components/MultipleUploadForm";

type OnboardingMode = "none" | "single" | "multiple" | "contractor";

export default function OnBoarding() {
  const [mode, setMode] = useState<OnboardingMode>("none");
  return (
   <Modal title="Employee Onboarding" >
     <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
      
     <button 
              onClick={() => setMode("none")}
              className="flex-1 border border-gray-300 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
      </button>
      {mode === "none" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setMode("single")}
            className="h-24 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            Single Employee Onboarding
          </button>
          <button 
            onClick={() => setMode("multiple")}
            className="h-24 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            Multiple Employee Onboarding
          </button>
        </div>
      )}

      {mode === "single" && <EmployeeForm/>}

      {mode === "multiple" && <MultipleUploadForm/>}
    </div>
   </Modal>
  );
}
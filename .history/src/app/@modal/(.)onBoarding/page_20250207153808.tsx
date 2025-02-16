"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Modal from "@/components/Modal";
import EmployeeForm from "@/components/EmployeeForm";
import MultipleUploadForm from "@/components/MultipleUploadForm";

type OnboardingMode = "none" | "single" | "multiple" | "contractor";

export default function OnBoarding() {
  const [mode, setMode] = useState<OnboardingMode>("none");
  
  return (
    <Modal title="Employee Onboarding">
      <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <button 
            onClick={() => setMode("none")}
            disabled={mode === "none"}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${mode === "none" 
                ? "text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed" 
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Options
          </button>
        </div>

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

        {mode === "single" && <EmployeeForm />}
        {mode === "multiple" && <MultipleUploadForm />}
      </div>
    </Modal>
  );
}
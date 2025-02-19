"use client";

import EmployeeForm from "@/components/EmployeeForm";
import MultipleUploadForm from "@/components/MultipleUploadForm";
import { Dispatch, SetStateAction } from "react";

type OnboardingMode = "none" | "single" | "multiple" | "contractor";

interface PageProps {
  mode: OnboardingMode;
  setMode: Dispatch<SetStateAction<OnboardingMode>>;
}

export default function OnBoarding({ mode, setMode }: PageProps) {
  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
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
  );
}

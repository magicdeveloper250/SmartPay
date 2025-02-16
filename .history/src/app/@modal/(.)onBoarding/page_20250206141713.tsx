"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Upload } from "lucide-react";
import Modal from "@/components/Modal";
import toast from "react-hot-toast";
import Loader from "@/components/Common/Loader";
import * as XLSX from 'xlsx';
import type { EmployeeData } from "@/types/employee";

type OnboardingMode = "none" | "single" | "multiple";
type BankType= "none"|"crypto" | "bank"

export default function OnBoarding() {
  const [mode, setMode] = useState<OnboardingMode>("none");
  const[banckType, setBankType]= useState<BankType>("none");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.xlsx')) {
      toast.error("Please upload only Excel files (.xlsx)");
      return;
    }
    setFile(uploadedFile);
  };


  const processExcelFile = async (file: File): Promise<EmployeeData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          resolve(jsonData as EmployeeData[]);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "multiple" && file) {
        const employees = await processExcelFile(file);
        const response = await fetch("/api/employee", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employees }),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }
        toast.success("Employees registered successfully");
      } else {
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);
        
        const response = await fetch("/api/employee", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }
        toast.success("Employee registered successfully");
      }
    } catch (err: any) {
      setError(JSON.parse(err.message)?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
   <Modal>
     <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Employee Onboarding</h1>
      
      {error && (
          <div className="mb-4 p-4 border border-red-400 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
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

      {mode === "single" && (
        <form onSubmit={handleSubmit} className="space-y-4">
         <fieldset>
          <legend>Personal Information</legend>
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input 
              name="firstName"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Second Name</label>
            <input 
              name="secondName"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              name="email"
              required
              type="email"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input 
              name="phoneNumber"
              required
              type="tel"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employee ID</label>
            <input 
              name="employeeID"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">National ID/Passport</label>
            <input 
              name="nationalID"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">startDate</label>
            <input 
              name="startDate"
              type="date"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <input 
              name="jobTitle"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Monthly Gross</label>
            <input 
              name="monthlyGross"
              type="number"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <input 
              name="currency"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <input 
              name="department"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
         </fieldset>

           <fieldset>
            <legend>Bank Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-2">
          <button 
            onClick={() => setBankType("bank")}
            className="h-10 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            type="button"
          >
             bank
          </button>
          <button 
            onClick={() => setBankType("crypto")}
            className="h-10 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            type="button"
          >
             crypto Wallet
          </button>
        </div>
          {banckType=="bank"&&<><div>
            <label className="block text-sm font-medium mb-1">Bank Name</label>
            <input 
              name="bankName"
              required={banckType=="bank"}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bank Account Number</label>
            <input 
              name="bankAccountNumber"
              required={banckType=="bank"}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Swift Code</label>
            <input 
              name="swiftCode"
              required={banckType=="bank"}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Domicile</label>
            <input 
              name="Domicile"
              required={banckType=="bank"}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          </>}
          {banckType=="crypto"&& <div>
            <label className="block text-sm font-medium mb-1">Wallet Address</label>
            <input 
              name="walletAddress"
              required={banckType=="crypto"}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>}
           </fieldset>
          <div className="flex gap-4 pt-4">
            <button 
              type="submit"
               className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-dark"
            >
              Submit {loading && <Loader/>}
            </button>
            <button 
              type="button"
              onClick={() => setMode("none")}
              className="flex-1 border border-gray-300 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>
        </form>
      )}

      {mode === "multiple" && (
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium">Upload Excel File</label>
            <div className="border-2 border-dashed rounded-lg p-6">
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer flex flex-col items-center gap-2 text-gray-600 hover:text-blue-500"
              >
                <Upload className="h-8 w-8" />
                <span>{file ? file.name : "Click to upload Excel file"}</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={(e) => handleSubmit(e as unknown as FormEvent<HTMLFormElement>)}
              disabled={!file}
              className={`flex-1 p-2 rounded-lg ${
                file 
                  ? "bg-blue-500 text-white hover:bg-blue-600" 
                  : "bg-gray-300 cursor-not-allowed"
              } transition-colors`}
            >
              Submit {loading && <Loader/>}
            </button>
            <button 
              onClick={() => setMode("none")}
              className="flex-1 border border-gray-300 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
   </Modal>
  );
}
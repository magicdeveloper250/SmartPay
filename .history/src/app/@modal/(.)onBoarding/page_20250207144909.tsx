"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/Modal";
import toast from "react-hot-toast";
import Loader from "@/components/Common/Loader";
import * as XLSX from 'xlsx';
import type { EmployeeData } from "@/types/employee";



const employeeSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  secondName: z.string().min(2, "Second name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  employeeID: z.string().min(1, "Employee ID is required"),
  nationalID: z.string().min(1, "National ID/Passport is required"),
  startDate: z.string().min(1, "Start date is required"),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  monthlyGross: z.string()
  .transform((val) => Number(val))
  .pipe(z.number().positive("Monthly gross must be positive")),
  currency: z.string().min(1, "Currency is required"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  // Bank details validation based on type
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  swiftCode: z.string().optional(),
  Domicile: z.string().optional(),
  walletAddress: z.string().optional(),
});
type FormData = z.infer<typeof employeeSchema>;
type OnboardingMode = "none" | "single" | "multiple";
type BankType= "none"|"crypto" | "bank"

export default function OnBoarding() {
  const [mode, setMode] = useState<OnboardingMode>("none");
  const[banckType, setBankType]= useState<BankType>("none");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const[currencies, setCurrencies]=useState<string[]>([])

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue,
    watch 
  } = useForm<FormData>({
    resolver: zodResolver(employeeSchema)
  });


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

  const getCurrencies= async()=>{
    try {
      const resp= await fetch("/api/currency");
      const data= await resp.json();
      setCurrencies(data)
      
    } catch (error) {
      toast.error("Unable to fetch Currencies");
      
    }
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (mode === "multiple" && file) {
        const employees = await processExcelFile(file);
        const response = await fetch("/api/employee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employees }),
        });

        if (!response.ok) throw new Error(await response.text());
        toast.success("Employees registered successfully");
      } else {
        const response = await fetch("/api/employee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error(await response.text());
        toast.success("Employee registered successfully");
      }
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    getCurrencies()
  },[])
  return (
   <Modal title="Employee Onboarding" >
     <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
      
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
         <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
         <legend className="text-xl font-semibold mb-4 col-span-2">Personal Information</legend>
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input 
              {...register("firstName")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Second Name</label>
            <input 
              {...register("secondName")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.secondName && (
                  <p className="text-red-500 text-sm mt-1">{errors.secondName.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              {...register("email")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input 
              {...register("phoneNumber")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input 
              {...register("address")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employee ID</label>
            <input 
              {...register("employeeID")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.employeeID && (
                  <p className="text-red-500 text-sm mt-1">{errors.employeeID.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">National ID/Passport</label>
            <input 
              {...register("nationalID")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.nationalID && (
                  <p className="text-red-500 text-sm mt-1">{errors.nationalID.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">start Date</label>
            <input 
              {...register("startDate")}
              type="date"
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <input 
              {...register("jobTitle")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.jobTitle && (
                  <p className="text-red-500 text-sm mt-1">{errors.jobTitle.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Monthly Gross</label>
            <input 
              type="number"
              step="0.01"
              {...register("monthlyGross")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.monthlyGross && (
                  <p className="text-red-500 text-sm mt-1">{errors.monthlyGross.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select 
              {...register("currency")}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="" disabled>Select currency</option>
              {currencies.map(currency=>{
                return <option key={currency} value={currency}>{currency}</option>

              })}
            </select>
            {errors.currency && (
                  <p className="text-red-500 text-sm mt-1">{errors.currency.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <input 
              {...register("department")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.department && (
                  <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                )}
          </div>
         </fieldset>

           <fieldset className="mt-8">
           <legend className="text-xl font-semibold mb-4">Bank Details</legend>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">  
                <button 
                  onClick={() => setBankType("bank")}
                  className="h-12 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  type="button"
                >
                  Bank
                </button>
                <button 
                  onClick={() => setBankType("crypto")}
                  className="h-12 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  type="button"
                >
                  Crypto Wallet
                </button>
              </div>
          {banckType=="bank"&&<>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
           <div>
           <label className="block text-sm font-medium mb-1">Bank Name</label>
            <input 
              {...register("bankName")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.bankName && (
                  <p className="text-red-500 text-sm mt-1">{errors.bankName.message}</p>
                )}
           
           </div>
           <div>
           <label className="block text-sm font-medium mb-1">Bank Account Number</label>
            <input 
              {...register("bankAccountNumber")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.bankAccountNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.bankAccountNumber.message}</p>
                )}
           </div>
           
           <div>
           <label className="block text-sm font-medium mb-1">Swift Code</label>
            <input 
              {...register("swiftCode")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.swiftCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.swiftCode.message}</p>
                )}
           </div>
         
           <div>
           <label className="block text-sm font-medium mb-1">Domicile</label>
            <input 
              {...register("Domicile")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.Domicile && (
                  <p className="text-red-500 text-sm mt-1">{errors.Domicile.message}</p>
                )}
           </div>
          </div>
          </>}
          {banckType=="crypto"&& <div>
            <div>
                  <label className="block text-sm font-medium mb-2">Wallet Address</label>
                  <input 
                    {...register("walletAddress")}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {errors.walletAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.walletAddress.message}</p>
                  )}
                </div>
          </div>}
           </fieldset>
          <div className="flex gap-6 pt-6">
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
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <label className="block text-sm font-medium">Upload Excel File</label>
            <div className="border-2 border-dashed rounded-lg p-8">
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
                <Upload className="h-12 w-12" />
                <span>{file ? file.name : "Click to upload Excel file"}</span>
              </label>
            </div>
          </div>

          <div className="flex gap-6">
            <button 
              type="submit"
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
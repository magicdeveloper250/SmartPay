"use client";

import { useState, useEffect, ChangeEvent } from "react";
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
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  swiftCode: z.string().optional(),
  Domicile: z.string().optional(),
  walletAddress: z.string().optional(),
});

export default function MultipleUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);


  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.xlsx')) {
      toast.error("Please upload only Excel files (.xlsx)");
      return;
    }
    setFile(uploadedFile);
    toast.success("File uploaded successfully");
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
          const validatedData = jsonData.map((row: any) => {
            if (!row.firstName || !row.email || !row.employeeID) {
              throw new Error('Missing required fields in Excel file');
            }
            return {
              firstName: row.firstName,
              secondName: row.secondName || '',
              email: row.email,
              phoneNumber: row.phoneNumber || '',
              address: row.address || '',
              employeeID: row.employeeID,
              nationalID: row.nationalID || '',
              startDate: row.startDate || '',
              jobTitle: row.jobTitle || '',
              monthlyGross: Number(row.monthlyGross) || 0,
              currency: row.currency || '',
              department: row.department || '',
              bankName: row.bankName || '',
              bankAccountNumber: row.bankAccountNumber || '',
              swiftCode: row.swiftCode || '',
              Domicile: row.Domicile || '',
              walletAddress: row.walletAddress || ''
            };
          });
          
          resolve(validatedData);

        } catch (error) {
          reject(new Error('Error processing Excel file. Please check the format and try again.'));
        }
      };
      reader.onerror = (error) => reject(new Error('Error reading the Excel file'));
      reader.readAsArrayBuffer(file);
    });
  };

 

  

  const handleMultipleSubmit = async () => {
    if (!file) {
      toast.error("Please upload a file first");
      return;
    }

    setLoading(true);
    try {
      const employees = await processExcelFile(file);
      
      const response = await fetch("/api/employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employees, isMultiple: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload employees');
      }

      toast.success("Employees registered successfully");
      setFile(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to process employees");
    } finally {
      setLoading(false);
    }
  };

 
  return (
     <div className="w-full max-w-7xl mx-auto p-6">
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
              onClick={handleMultipleSubmit}
              disabled={!file || loading}
              className={`flex-1 p-2 rounded-lg ${
                file 
                  ? "flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-dark"
                  : "bg-gray-300 cursor-not-allowed"
              } transition-colors`}
            >
              Submit {loading && <Loader/>}
            </button>
           
          </div>
        </div>
    </div>
  );
}
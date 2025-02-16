"use client";

import { useState,  ChangeEvent, useTransition } from "react";
import { Upload } from "lucide-react";
 
import toast from "react-hot-toast";
import Loader from "@/components/Common/Loader";
import * as XLSX from 'xlsx';
import type { EmployeeData } from "@/types/employee";
import { useForm } from "react-hook-form";
import { processExcelFile } from "@/actions/employeeFileActions";

interface FormInputs {
  file: FileList;
}
export default function MultipleUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, startTransition]= useTransition()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<FormInputs>();

  const selectedFile = watch("file")?.[0];

  
  const onSubmit = async (data: FormInputs) => {
     
    startTransition(async()=>{
       
        const file = data.file[0];
        const buffer = await file.arrayBuffer();
        const result = await processExcelFile({
          buffer,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        });
        
        if (result.error) {
          toast.error(result.error || "Failed to process employees");
        }else{
          
        toast.success("Employees registered successfully");
        reset(); 
        }
     
    }) 
  };


 
  return (
     <div className="w-full max-w-7xl mx-auto p-6">
       <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
       <div className="space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <label className="block text-sm font-medium">Upload Excel File</label>
            <div className="border-2 border-dashed rounded-lg p-8">
              <input
                type="file"
                accept=".xlsx"
                {...register("file", {
                  required: "Please select a file",
                  validate: {
                    isExcel: (files) => {
                      const file = files?.[0];
                      if (!file) return "Please select a file";
                      return file.name.endsWith('.xlsx') || "Please upload only Excel files (.xlsx)";
                    },
                  }
                })}
                className="hidden"
                id="file-upload"
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer flex flex-col items-center gap-2 text-gray-600 hover:text-blue-500"
              >
                <Upload className="h-12 w-12" />
                <span>{selectedFile ? selectedFile.name : "Click to upload Excel file"}</span>
              </label>
            </div>
            {errors.file && (
            <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
          )}
          </div>

          <div className="flex gap-6">
            <button
            type="submit" 
              disabled={ isUploading}
              className={`flex-1 p-2 rounded-lg ${
                file 
                  ? "flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-dark"
                  : "bg-gray-300 cursor-not-allowed"
              } transition-colors`}
            >
              Upload {isUploading && <Loader/>}
            </button>
           
          </div>
        </div>
       </form>
    </div>
  );
}
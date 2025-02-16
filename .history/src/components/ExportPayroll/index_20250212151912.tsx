"use client";

import { useState } from "react";
import { exportPayrollToCSV } from "@/actions/payroll";
import toast from "react-hot-toast";

interface ExportControlProps {
  query: string;  
  page:number;
}

export default function ExportControl({ query, page }: ExportControlProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      const filePath = await exportPayrollToCSV(query, page);  
      toast.success("Payroll exported successfully, "+ filePath)
    } catch (error) {
      toast.error("Payroll export failed")
    }
  };

 

  return (
    <div className="flex items-center justify-between border-b pb-3">
      <div className="flex justify-between flex-col align-middle">
        <label htmlFor="date" className="text-lg font-medium text-gray-900">
          Payment Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleExportClick}
        disabled={isExporting}
      >
        {isExporting ? "Exporting..." : "Export to CSV"}
      </button>
    </div>
  );
}
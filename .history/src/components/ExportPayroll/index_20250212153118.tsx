"use client";

import React, { useState } from "react";
import { exportPayrollToCSV } from "@/actions/payroll";
import toast from "react-hot-toast";

interface ExportControlProps {
  query: string;  
  page:number;
}

export default function ExportControl({ query, page }: ExportControlProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const filePath = await exportPayrollToCSV(query, page);  
      toast.success("Payroll exported successfully, "+ filePath)
    } catch (error) {
      toast.error("Payroll export failed")
    }finally{
      setIsExporting(false)
    }
    
  };

 

  return (
    <div className="flex items-center justify-between border-b pb-3">
      <h3>Pay Date: {formatDate(selectedDate)}</h3>
      <div className="flex justify-between flex-col align-middle">
      <label htmlFor="pay-date">Select a date:</label>
      <input
        id="pay-date"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
      />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? "Exporting..." : "Export to CSV"}
      </button>
    </div>
  );
}
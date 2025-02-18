"use client";

import React, { useState, useEffect, useRef } from "react";
import { exportPayrollToCSV, exportPayrollToJSON, SavePayroll } from "@/actions/payroll";
import toast from "react-hot-toast";

interface ExportControlProps {
  query: string;
  page: number;
}

export default function ExportControl({ query, page }: ExportControlProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isValidPayDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    return date instanceof Date && !isNaN(date.getTime()) && date >= today;
  };
  
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isValidPayDate(selectedDate)) {
      toast.error("Invalid pay date. Please select a valid date.");
      return;
    }else{
      setSelectedDate(new Date(event.target.value));
    }
    
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleExport = async (exportType: "csv" | "json" | "db") => {
    if (!isValidPayDate(selectedDate)) {
      toast.error("Invalid pay date. Please select a valid date.");
      return;
    }
    setIsExporting(true);
    setDropdownOpen(false);
    try {
      let filePath;
      if (exportType === "csv") {
        filePath = await exportPayrollToCSV(query, page);
      } else if(exportType === "db"){
        filePath = await SavePayroll(selectedDate);
      }
      else {
        filePath = await exportPayrollToJSON(query, page);
      }
      toast.success(`Payroll exported successfully, ${filePath}`);
    } catch (error) {
      toast.error("Payroll export failed");
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="flex items-center justify-between border-b pb-3 gap-4">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium text-gray-900">
          Pay Date: {formatDate(selectedDate)}
        </h3>
        <input
          id="pay-date"
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={handleDateChange}
          className="border p-2 rounded"
        />
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          disabled={isExporting}
        >
          {isExporting ? "Exporting..." : "Export"}
          <span className="ml-2">▼</span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
             <button
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => handleExport("db")}
              disabled={isExporting}
            >
              Export to db
            </button>
            <button
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => handleExport("csv")}
              disabled={isExporting}
            >
              Export to CSV [draft]
            </button>
            <button
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => handleExport("json")}
              disabled={isExporting}
            >
              Export to JSON [draft]
            </button>
           
          </div>
        )}
      </div>
    </div>
  );
}

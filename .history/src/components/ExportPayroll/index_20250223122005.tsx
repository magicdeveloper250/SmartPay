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

  const isValidPayDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);  
    date.setHours(0, 0, 0, 0);  

    return date >= today;  
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;

    if (!isValidPayDate(newDate)) {
      toast.error("Invalid pay date. Please select a valid date.");
      return;
    }

    setSelectedDate(new Date(newDate));  
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleExport = async (exportType: "csv" | "json" | "db") => {
    if (!isValidPayDate(selectedDate.toISOString())) {
      toast.error("Invalid pay date. Please select a valid date.");
      return;
    }

    setIsExporting(true);
    setDropdownOpen(false);

    try {
      let filePath: any = null;
    
      if (exportType === "csv") {
        filePath = await exportPayrollToCSV(query, page);
      } else if (exportType === "db") {
        filePath = await SavePayroll(selectedDate);
      } else {
        filePath = await exportPayrollToJSON(query, page);
      }
    
      if (filePath?.error) {
        toast.error(`Export failed: ${filePath.error}`);
      } else {
        toast.success("Payroll exported successfully");
      }
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
    <div className="flex items-center justify-between border-b border-gray-200 pb-4 gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Pay Date: {formatDate(selectedDate)}
        </h3>
        <div className="relative">
          <input
            id="pay-date"
            type="date"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={handleDateChange}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 
                     text-gray-900 focus:border-blue-500 focus:ring-blue-500 
                     transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5
                     font-medium transition-all duration-200 ease-in-out
                     ${isExporting 
                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                       : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'}`}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Exporting...
            </>
          ) : (
            <>
              Export
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </>
          )}
        </button>
        
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black 
                        ring-opacity-5 z-10 divide-y divide-gray-100">
            <div className="py-1">
              <button
                className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 
                         transition-colors duration-150"
                onClick={() => handleExport("db")}
                disabled={isExporting}
              >
                <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
                </svg>
                Export to Database
              </button>
              
              <button
                className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 
                         transition-colors duration-150"
                onClick={() => handleExport("csv")}
                disabled={isExporting}
              >
                <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Export to CSV
                <span className="ml-2 text-xs text-gray-400">[draft]</span>
              </button>
              
              <button
                className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 
                         transition-colors duration-150"
                onClick={() => handleExport("json")}
                disabled={isExporting}
              >
                <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Export to JSON
                <span className="ml-2 text-xs text-gray-400">[draft]</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
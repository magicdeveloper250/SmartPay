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
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="pay-date" className="text-sm font-medium text-gray-700">
              Payment Date
            </label>
            <input
              id="pay-date"
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={handleDateChange}
              className="block w-full rounded-md border-gray-200 shadow-sm 
                       focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                       transition duration-150 ease-in-out"
            />
          </div>
          <div className="text-sm text-gray-600">
            Selected: <span className="font-medium text-gray-900">{formatDate(selectedDate)}</span>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={isExporting}
            className={`group relative w-full sm:w-auto inline-flex items-center justify-center
                       rounded-md px-4 py-2.5 text-sm font-medium shadow-sm
                       transition-all duration-200 ease-in-out
                       ${isExporting 
                         ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                         : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800'
                       }`}
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
                Export Data
              </>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-lg bg-white 
                           shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => handleExport("db")}
                  disabled={isExporting}
                  className="group flex w-full items-center rounded-md px-3 py-2.5
                           text-sm text-gray-700 hover:bg-indigo-50 transition duration-150"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center 
                                rounded-lg bg-indigo-50 group-hover:bg-indigo-100">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Database Export</p>
                    <p className="text-xs text-gray-500">Save payroll data to database</p>
                  </div>
                </button>

                <button
                  onClick={() => handleExport("csv")}
                  disabled={isExporting}
                  className="group flex w-full items-center rounded-md px-3 py-2.5
                           text-sm text-gray-700 hover:bg-indigo-50 transition duration-150"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center 
                                rounded-lg bg-indigo-50 group-hover:bg-indigo-100">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">CSV Export <span className="text-xs text-indigo-500">[draft]</span></p>
                    <p className="text-xs text-gray-500">Download as spreadsheet</p>
                  </div>
                </button>

                <button
                  onClick={() => handleExport("json")}
                  disabled={isExporting}
                  className="group flex w-full items-center rounded-md px-3 py-2.5
                           text-sm text-gray-700 hover:bg-indigo-50 transition duration-150"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center 
                                rounded-lg bg-indigo-50 group-hover:bg-indigo-100">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">JSON Export <span className="text-xs text-indigo-500">[draft]</span></p>
                    <p className="text-xs text-gray-500">Download as JSON file</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
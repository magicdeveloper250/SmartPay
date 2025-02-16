"use client";

import React, { useState } from "react";
import { exportPayrollToCSV, exportPayrollToJSON } from "@/actions/payroll";
import toast from "react-hot-toast";

interface ExportControlProps {
  query: string;
  page: number;
}

export default function ExportControl({ query, page }: ExportControlProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleExport = async (exportType: "csv" | "json") => {
    setIsExporting(true);
    setDropdownOpen(false);
    try {
      let filePath;
      if (exportType === "csv") {
        filePath = await exportPayrollToCSV(query, page);
      } else {
        filePath = await exportPayrollToJSON(query, page);
      }
      toast.success(`Payroll exported successfully, ${filePath}`);
    } catch (error) {
      toast.error("Payroll export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center justify-between border-b pb-3 gap-4">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium text-gray-900">
          Pay Date: {formatDate(selectedDate)}
        </h3>
        <input
          id="pay-date"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="border p-2 rounded"
        />
      </div>
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          disabled={isExporting}
        >
          {isExporting ? "Exporting..." : "Export"}
          <span className="ml-2">▼</span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <button
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => handleExport("csv")}
              disabled={isExporting}
            >
              Export to CSV
            </button>
            <button
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => handleExport("json")}
              disabled={isExporting}
            >
              Export to JSON
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

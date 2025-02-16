"use client";

import { useState } from "react";

interface ExportControlProps {
  onExport: () => Promise<void>;  
}

export default function ExportControl({ onExport }: ExportControlProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportClick = async () => {
    setIsExporting(true);
    try {
      await onExport(); 
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
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
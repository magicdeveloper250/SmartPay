"use client";

import React, { useEffect, useState, useRef } from "react";
import { ContractTerms } from "@prisma/client";
import toast from "react-hot-toast";

const ContractPaper = ({ contractId }: { contractId: string }) => {
  const [contractTerms, setContractTerms] = useState<ContractTerms | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const getContract = async () => {
    try {
      const resp = await fetch(`/api/contract/?id=${contractId}`);
      const data = await resp.json();
      setContractTerms(data.contract);
    } catch (error) {
      toast.error("Unable to fetch Contract");
    }
  };

  useEffect(() => {
    getContract();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 print:hidden"
      >
        Print Contract
      </button>
      
      <div
        ref={printRef}
        className="w-full max-w-2xl bg-white p-8 shadow-lg print:shadow-none print:border print:p-12"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Contract Terms</h2>
        <hr className="mb-4" />
        
        <div className="space-y-4 text-sm">
          <div><strong>Contract ID:</strong> {contractTerms?.id}</div>
          <div><strong>Company ID:</strong> {contractTerms?.companyId}</div>
          <div><strong>Contractor ID:</strong> {contractTerms?.contractorId}</div>
          <div><strong>Salary:</strong> {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(contractTerms?.salary || 0)}</div>
          <div><strong>Start Date:</strong> {formatDate(contractTerms?.startDate || new Date())}</div>
          <div><strong>End Date:</strong> {formatDate(contractTerms?.endDate || new Date())}</div>
          <div><strong>Notes:</strong> {contractTerms?.notes || "No notes provided"}</div>
          <div><strong>Created At:</strong> {new Date(contractTerms?.createdAt || new Date()).toLocaleString()}</div>
          <div><strong>Updated At:</strong> {new Date(contractTerms?.updatedAt || new Date()).toLocaleString()}</div>
        </div>
        
        <hr className="my-4" />
        <p className="text-center text-gray-600 text-sm print:text-black">Authorized Signature: ______________________</p>
      </div>
    </div>
  );
};

export default ContractPaper;

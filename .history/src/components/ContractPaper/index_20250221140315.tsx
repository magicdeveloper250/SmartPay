"use client"
import React, { useEffect, useState } from 'react';
import { ContractTerms } from '@prisma/client';
import toast from 'react-hot-toast';

const ContractPaper = ({ contractId }:{contractId:string}) => {
  const[contractTerms, setContractTerms]= useState<ContractTerms|null>(null)
  const formatDate = (date:Date) => {
    return new Date(date).toISOString().split('T')[0];
  };
 
  const getContract= async()=>{
    try {
      const resp= await fetch(`/api/contract/?id=${contractId}`);
      const data= await resp.json();
      setContractTerms(data.contract)
    } catch (error) {
      toast.error("Unable to fetch Contract");
    }
  }

  useEffect(()=>{
    getContract()
  }, [contractId])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-[595px] h-[842px] bg-white rounded   overflow-y-auto">
        <div className="border-b border-gray-200 py-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Contract Terms
          </h2>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Contract ID
              </label>
              <div className="text-gray-800 bg-gray-50 p-2 rounded">
                {contractTerms?.id}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Company ID
              </label>
              <div className="text-gray-800 bg-gray-50 p-2 rounded">
                {contractTerms?.companyId}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Contractor ID
            </label>
            <div className="text-gray-800 bg-gray-50 p-2 rounded">
              {contractTerms?.contractorId}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Salary
            </label>
            <div className="text-gray-800 bg-gray-50 p-2 rounded">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: "USD"
              }).format(contractTerms?.salary || 0)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Start Date
              </label>
              <div className="text-gray-800 bg-gray-50 p-2 rounded">
                {formatDate(contractTerms?.startDate || new Date())}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                End Date
              </label>
              <div className="text-gray-800 bg-gray-50 p-2 rounded">
                {formatDate(contractTerms?.endDate || new Date())}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Notes
            </label>
            <div className="text-gray-800 bg-gray-50 p-2 rounded min-h-[200px] whitespace-pre-wrap">
              {contractTerms?.notes || 'No notes provided'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Created At
              </label>
              <div className="text-sm text-gray-600">
                {new Date(contractTerms?.createdAt || new Date()).toLocaleString()}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Updated At
              </label>
              <div className="text-sm text-gray-600">
                {new Date(contractTerms?.updatedAt || new Date()).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractPaper;
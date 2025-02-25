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
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Contract Header */}
      <div className="text-center py-8 border-b border-gray-200 bg-gray-50">
        <h1 className="text-2xl font-serif font-bold text-gray-800 mb-2">CONTRACTOR AGREEMENT</h1>
        <p className="text-gray-600">Contract Reference: {contractTerms?.id}</p>
      </div>

      {/* Contract Body */}
      <div className="p-8 space-y-8">
        {/* Parties Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            PARTIES TO THE AGREEMENT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 uppercase">Company</h3>
              <p className="mt-2 text-gray-800 bg-gray-50 p-3 rounded-md border border-gray-100">
                {contractTerms?.companyId}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 uppercase">Contractor</h3>
              <p className="mt-2 text-gray-800 bg-gray-50 p-3 rounded-md border border-gray-100">
                {contractTerms?.contractorId}
              </p>
            </div>
          </div>
        </section>

        {/* Terms Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            TERMS OF ENGAGEMENT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 uppercase">Start Date</h3>
              <p className="mt-2 text-gray-800 bg-gray-50 p-3 rounded-md border border-gray-100">
                {formatDate(contractTerms?.startDate || new Date())}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 uppercase">End Date</h3>
              <p className="mt-2 text-gray-800 bg-gray-50 p-3 rounded-md border border-gray-100">
                {formatDate(contractTerms?.endDate || new Date())}
              </p>
            </div>
          </div>
        </section>

        {/* Compensation Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            COMPENSATION
          </h2>
          <div>
            <h3 className="text-sm font-medium text-gray-600 uppercase">Annual Salary</h3>
            <p className="mt-2 text-gray-800 bg-gray-50 p-3 rounded-md border border-gray-100 font-medium">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: "USD"
              }).format(contractTerms?.salary || 0)}
            </p>
          </div>
        </section>

        {/* Additional Terms Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            ADDITIONAL TERMS
          </h2>
          <div>
            <h3 className="text-sm font-medium text-gray-600 uppercase">Notes & Special Conditions</h3>
            <div className="mt-2 text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-100 min-h-[120px] whitespace-pre-wrap">
              {contractTerms?.notes || 'No additional terms or conditions specified.'}
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <section className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Document Created:</p>
              <p>{new Date(contractTerms?.createdAt || new Date()).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium">Last Modified:</p>
              <p>{new Date(contractTerms?.updatedAt || new Date()).toLocaleString()}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContractPaper;
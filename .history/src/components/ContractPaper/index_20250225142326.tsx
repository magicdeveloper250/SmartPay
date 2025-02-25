"use client"
import React, { useEffect, useState } from 'react';
import { ContractTerms, Contractor, Company } from '@prisma/client';
import toast from 'react-hot-toast';

interface ContractDetails {
  contract: ContractTerms;
  contractor: Contractor;
  company: Company;
}

const ContractPaper = ({ contractId }:{contractId:string}) => {
  const[contractDetails, setContractDetails]= useState<ContractDetails|null>(null)
  
  const formatDate = (date:Date) => {
    return new Date(date).toISOString().split('T')[0];
  };
 
  const getContract = async() => {
    try {
      const resp = await fetch(`/api/contract/?id=${contractId}`);
      const data = await resp.json();
      setContractDetails(data)
    } catch (error) {
      toast.error("Unable to fetch Contract");
    }
  }

  useEffect(() => {
    getContract()
  }, [contractId])

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none">
      {/* Contract Header */}
      <div className="text-center py-8 border-b border-gray-200 bg-gray-50">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">CONTRACTOR AGREEMENT</h1>
        <div className="flex justify-center items-center gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            Contract Reference: {contractDetails?.contract.id}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            contractDetails?.contract.status === 'Paid' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-yellow-50 text-yellow-700'
          }`}>
            Status: {contractDetails?.contract.status}
          </span>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Parties Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            PARTIES TO THE AGREEMENT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-600 uppercase">Company Details</h3>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-100 space-y-2">
                <p><span className="font-medium">Name:</span> {contractDetails?.company.name}</p>
                <p><span className="font-medium">Email:</span> {contractDetails?.company.email}</p>
                <p><span className="font-medium">Location:</span> {contractDetails?.company.city}, {contractDetails?.company.country}</p>
                <p><span className="font-medium">Industry:</span> {contractDetails?.company.industry}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-600 uppercase">Contractor Details</h3>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-100 space-y-2">
                <p><span className="font-medium">Name:</span> {contractDetails?.contractor.firstName} {contractDetails?.contractor.secondName}</p>
                <p><span className="font-medium">ID:</span> {contractDetails?.contractor.contractorID}</p>
                <p><span className="font-medium">Department:</span> {contractDetails?.contractor.department}</p>
                <p><span className="font-medium">Job Title:</span> {contractDetails?.contractor.jobTitle}</p>
              </div>
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
              <h3 className="text-sm font-medium text-gray-600 uppercase">Contract Period</h3>
              <div className="mt-2 bg-gray-50 p-4 rounded-md border border-gray-100 space-y-2">
                <p><span className="font-medium">Start Date:</span> {formatDate(contractDetails?.contract.startDate || new Date())}</p>
                <p><span className="font-medium">End Date:</span> {formatDate(contractDetails?.contract.endDate || new Date())}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 uppercase">Payment Information</h3>
              <div className="mt-2 bg-gray-50 p-4 rounded-md border border-gray-100 space-y-2">
                <p><span className="font-medium">Payment Method:</span> {contractDetails?.contractor.paymentMethod}</p>
                <p><span className="font-medium">Currency:</span> {contractDetails?.contractor.currency}</p>
                {contractDetails?.contractor.paymentMethod === 'bank' && (
                  <>
                    <p><span className="font-medium">Bank:</span> {contractDetails?.contractor.bankName}</p>
                    <p><span className="font-medium">Account:</span> {contractDetails?.contractor.bankAccountNumber}</p>
                  </>
                )}
                {contractDetails?.contractor.paymentMethod === 'crypto' && (
                  <p><span className="font-medium">Wallet:</span> {contractDetails?.contractor.walletAddress}</p>
                )}
                {contractDetails?.contractor.paymentMethod === 'phone' && (
                  <p><span className="font-medium">Phone:</span> {contractDetails?.contractor.paymentPhone}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Compensation Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            COMPENSATION
          </h2>
          <div>
            <h3 className="text-sm font-medium text-gray-600 uppercase">Contract Value</h3>
            <p className="mt-2 text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-100 font-medium text-xl">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: contractDetails?.contractor.currency || "USD"
              }).format(contractDetails?.contract.salary || 0)}
              <span className="text-sm text-gray-600 font-normal ml-2">per annum</span>
            </p>
          </div>
        </section>

        {/* Additional Terms Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            ADDITIONAL TERMS & CONDITIONS
          </h2>
          <div>
            <div className="mt-2 text-gray-800 bg-gray-50 p-6 rounded-md border border-gray-100 min-h-[120px] whitespace-pre-wrap prose">
              {contractDetails?.contract.notes || 'No additional terms or conditions specified.'}
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <section className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Document Created:</p>
              <p>{new Date(contractDetails?.contract.createdAt || new Date()).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium">Last Modified:</p>
              <p>{new Date(contractDetails?.contract.updatedAt || new Date()).toLocaleString()}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContractPaper;
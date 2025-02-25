"use client"
import React, { useEffect, useState } from 'react';
import { ContractTerms, Contractor, Company, PaymentMethod } from '@prisma/client';
import toast from 'react-hot-toast';
import { contractWithCompanyAndContract } from '@/types/contractWithCompanyAndContract';

interface Contract {
  contract: ContractTerms;
  contractor: Contractor;
  company: Company;
}

const ContractPaper = ({ contract }:{contract:contractWithCompanyAndContract}) => {
  
  
  const formatDate = (date:Date) => {
    return new Date(date).toISOString().split('T')[0];
  };
 
   

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none">
      {/* Contract Header */}
      <div className="text-center py-8 border-b border-gray-200 bg-gray-50">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">CONTRACTOR AGREEMENT</h1>
        <div className="flex justify-center items-center gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            Contract Reference: {contract?.id}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            contract?.status === 'Paid' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-yellow-50 text-yellow-700'
          }`}>
            Status: {contract?.status}
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
                <p><span className="font-medium">Name:</span> {contract?.company.name}</p>
                <p><span className="font-medium">Email:</span> {contract?.company.email}</p>
                <p><span className="font-medium">Location:</span> {contract?.company.city}, {contract?.company.country}</p>
                <p><span className="font-medium">Industry:</span> {contract?.company.industry}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-600 uppercase">Contractor Details</h3>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-100 space-y-2">
                <p><span className="font-medium">Name:</span> {contract.contractor.firstName} {contract.contractor.secondName}</p>
                <p><span className="font-medium">ID:</span> {contract.contractor.contractorID}</p>
                <p><span className="font-medium">Department:</span> {contract.contractor.department}</p>
                <p><span className="font-medium">Job Title:</span> {contract.contractor.jobTitle}</p>
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
                <p><span className="font-medium">Start Date:</span> {formatDate(contract?.startDate || new Date())}</p>
                <p><span className="font-medium">End Date:</span> {formatDate(contract?.endDate || new Date())}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 uppercase">Payment Information</h3>
              <div className="mt-2 bg-gray-50 p-4 rounded-md border border-gray-100 space-y-2">
                <p><span className="font-medium">Payment Method:</span> {contract.contractor.paymentMethod}</p>
                <p><span className="font-medium">Currency:</span> {contract.contractor.currency}</p>
                {contract.contractor.paymentMethod === PaymentMethod.bank && (
                  <>
                    <p><span className="font-medium">Bank:</span> {contract.contractor.bankName}</p>
                    <p><span className="font-medium">Account:</span> {contract.contractor.bankAccountNumber}</p>
                  </>
                )}
                {contract.contractor.paymentMethod === PaymentMethod.crypto && (
                  <p><span className="font-medium">Wallet:</span> {contract?.contractor.walletAddress}</p>
                )}
                {contract.contractor.paymentMethod ===PaymentMethod.phone && (
                  <p><span className="font-medium">Phone:</span> {contract?.contractor.phoneNumber}</p>
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
                currency: contract?.contractor.currency || "USD"
              }).format(contract?.salary || 0)}
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
              {contract?.notes || 'No additional terms or conditions specified.'}
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <section className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Document Created:</p>
              <p>{new Date(contract?.createdAt || new Date()).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium">Last Modified:</p>
              <p>{new Date(contract?.updatedAt || new Date()).toLocaleString()}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContractPaper;
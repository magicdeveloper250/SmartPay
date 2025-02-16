import React from 'react';
import { ContractTerms } from '@prisma/client';

const ContractPaper = ({ contractorId }:{contractorId:ContractTerms}) => {
  const formatDate = (date:Date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const formatCurrency = (amount:number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Contract Terms
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Contract ID
            </label>
            <div className="text-gray-800 bg-gray-50 p-2 rounded-md">
              {contractTerms.id}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Company ID
            </label>
            <div className="text-gray-800 bg-gray-50 p-2 rounded-md">
              {contractTerms.companyId}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Contractor ID
          </label>
          <div className="text-gray-800 bg-gray-50 p-2 rounded-md">
            {contractTerms.contractorId}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Salary
          </label>
          <div className="text-gray-800 bg-gray-50 p-2 rounded-md">
            {formatCurrency(contractTerms.salary)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Start Date
            </label>
            <div className="text-gray-800 bg-gray-50 p-2 rounded-md">
              {formatDate(contractTerms.startDate)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              End Date
            </label>
            <div className="text-gray-800 bg-gray-50 p-2 rounded-md">
              {formatDate(contractTerms.endDate)}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Notes
          </label>
          <div className="text-gray-800 bg-gray-50 p-2 rounded-md min-h-[100px] whitespace-pre-wrap">
            {contractTerms.notes || 'No notes provided'}
          </div>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Created At
            </label>
            <div className="text-sm text-gray-600">
              {new Date(contractTerms.createdAt).toLocaleString()}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Updated At
            </label>
            <div className="text-sm text-gray-600">
              {new Date(contractTerms.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractPaper;
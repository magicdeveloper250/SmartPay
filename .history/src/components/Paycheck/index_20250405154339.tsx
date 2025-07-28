import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { X } from 'lucide-react';
import { PayrollWithEmployeeAndCustomTaxes } from '@/types/payroll';

 

 

interface PaycheckProps {
 
  paycheckData: PayrollWithEmployeeAndCustomTaxes;
 
}

interface PaycheckComponentProps {
  open: boolean;
  paycheckData: PayrollWithEmployeeAndCustomTaxes;
  onClose: () => void;   
}

const PayStub: React.FC<PaycheckProps> = ({ paycheckData }) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };
  
  const startDate = new Date(paycheckData.createdAt);
  const endDate = new Date(paycheckData.createdAt);
  endDate.setDate(endDate.getDate() + 14);  
  
  const payPeriod = ` ${formatDate(startDate)} -  ${formatDate(endDate)}`;
   
  const baseEarnings = paycheckData.salary || 0;
  const additionalEarnings = paycheckData.additionalIncomes.reduce(
    (sum, income) => sum + income.amount, 0
  );
  const totalEarnings = baseEarnings + additionalEarnings;
  
  const totalTaxes = paycheckData.taxes.reduce((sum, tax) => sum + tax.taxAmount, 0).toFixed(2);
  
  const totalDeductions = paycheckData.deductions.reduce(
    (sum, deduction) => sum + deduction.amount, 0
  );
  
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg  overflow-hidden">
      {/* Header Section */}
      <div className="bg-primary text-white p-6">
        <div className="grid grid-cols-2">
          <div>
            <h1 className="text-2xl font-bold">{paycheckData.employee?.company?.name}</h1>
           
            <p className="text-sm">{paycheckData.employee?.company?.city}, {paycheckData.employee?.company?.country}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold">Pay Stub</h2>
            <p className="text-md">Pay Period: {payPeriod}</p>
            <p className="text-md">Payment Date: {paycheckData.mainPayroll?.paymentDate?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Employee Information Section - Added */}
      <div className="p-6 border-b border-gray-300 bg-gray-50">
        <h3 className="text-lg font-bold mb-3">Employee Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><span className="font-semibold">Name:</span> {paycheckData.employee?.firstName} {paycheckData.employee?.secondName}</p>
            <p><span className="font-semibold">Employee ID:</span> {paycheckData.employee?.id}</p>
            <p><span className="font-semibold">Position:</span> {paycheckData.employee?.jobTitle}</p>
          </div>
          <div>
            <p><span className="font-semibold">Department:</span> {paycheckData.employee?.department}</p>
           
            <p><span className="font-semibold">Hire Date:</span> {paycheckData.employee?.startDate ? formatDate(new Date(paycheckData.employee.startDate)) : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Earnings Section */}
      <div className="p-6 border-b border-gray-300">
        <div className="grid grid-cols-4 gap-2 border-b border-gray-300 pb-2 mb-3">
          <div className="font-bold text-blue-700">EARNINGS</div>
          <div className="font-bold">TYPE</div>
          <div className="font-bold text-center">AMOUNT</div>
          <div className="font-bold text-right">DATE</div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 py-1">
          <div>Regular Pay</div>
          <div>Salary</div>
          <div className="text-center"> {paycheckData.salary.toFixed(2)}</div>
          <div className="text-right">{paycheckData.mainPayroll?.paymentDate ? formatDate(new Date(paycheckData.mainPayroll.paymentDate)) : 'N/A'}</div>
        </div>
        
        {paycheckData.additionalIncomes.map((income, index) => (
          <div className="grid grid-cols-4 gap-2 py-1" key={`income- {index}`}>
            <div>Additional Income</div>
            <div>{income.incomeType}</div>
            <div className="text-center"> {income.amount.toFixed(2)}</div>
            <div className="text-right">{formatDate(new Date(income.createdAt))}</div>
          </div>
        ))}
        
        <div className="grid grid-cols-4 gap-2 py-2 mt-3 bg-gray-100 p-2 rounded">
          <div className="font-bold">GROSS EARNINGS:</div>
          <div></div>
          <div className="text-center font-bold">
             {(paycheckData.salary + paycheckData.additionalIncomes.reduce((sum, income) => sum + income.amount, 0)).toFixed(2)}
          </div>
          <div></div>
        </div>
      </div>

      {/* Taxes Section */}
      <div className="p-6 border-b border-gray-300">
        <div className="grid grid-cols-4 gap-2 border-b border-gray-300 pb-2 mb-3">
          <div className="font-bold text-red-700">TAXES</div>
          
          <div className="font-bold text-center">AMOUNT</div>
          <div className="font-bold text-right">RATE</div>
        </div>
        
        {paycheckData.taxes && paycheckData.taxes.map((tax, index) => (
          <div className="grid grid-cols-4 gap-2 py-1" key={`tax- {index}`}>
            <div>{tax.taxName}</div>
          
            <div className="text-center"> {tax.taxAmount.toFixed(2)}</div>
           
          </div>
        ))}
        
        <div className="grid grid-cols-4 gap-2 py-2 mt-3 bg-gray-100 p-2 rounded">
          <div className="font-bold">TOTAL TAXES:</div>
          <div></div>
          <div className="text-center font-bold text-red-700">
             {totalTaxes}
          </div>
          <div></div>
        </div>
      </div>

      {/* Deductions Section */}
      <div className="p-6 border-b border-gray-300">
        <div className="grid grid-cols-4 gap-2 border-b border-gray-300 pb-2 mb-3">
          <div className="font-bold text-purple-700">DEDUCTIONS</div>
          <div className="font-bold">REASON</div>
          <div className="font-bold text-center">AMOUNT</div>
          <div className="font-bold text-right">DATE</div>
        </div>
        
        {paycheckData.deductions && paycheckData.deductions.map((deduction, index) => (
          <div className="grid grid-cols-4 gap-2 py-1" key={`deduction- {index}`}>
            <div>Deduction</div>
            <div>{deduction.reason}</div>
            <div className="text-center"> {deduction.amount.toFixed(2)}</div>
            <div className="text-right">{formatDate(new Date(deduction.createdAt))}</div>
          </div>
        ))}
        
        <div className="grid grid-cols-4 gap-2 py-2 mt-3 bg-gray-100 p-2 rounded">
          <div className="font-bold">TOTAL DEDUCTIONS:</div>
          <div></div>
          <div className="text-center font-bold text-purple-700">
             {totalDeductions.toFixed(2)}
          </div>
          <div></div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="p-6 bg-gray-50">
        <h3 className="text-lg font-bold mb-3 text-blue-800">Pay Summary</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <div className="grid grid-cols-2 gap-2 border-b border-gray-300 pb-2 mb-2">
              <div className="font-bold">SUMMARY</div>
              <div className="font-bold text-right">AMOUNT</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 py-1">
              <div>Gross Earnings</div>
              <div className="text-right">
                 {totalEarnings.toFixed(2)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 py-1">
              <div>Taxes</div>
              <div className="text-right text-red-700">
                - {totalTaxes}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 py-1">
              <div>Deductions</div>
              <div className="text-right text-purple-700">
                - {totalDeductions.toFixed(2)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 py-2 mt-3 border-t border-gray-300">
              <div className="font-bold text-lg">NET PAY:</div>
              <div className="text-right font-bold text-lg text-green-700"> {paycheckData.netSalary}</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-bold mb-2">Year-to-Date Totals</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2">
                <p className="text-sm font-semibold">YTD Gross:</p>
                <p className="text-lg"> {(paycheckData.salary || totalEarnings).toFixed(2)}</p>
              </div>
              <div className="p-2">
                <p className="text-sm font-semibold">YTD Tax:</p>
                <p className="text-lg"> { totalTaxes}</p>
              </div>
              <div className="p-2">
                <p className="text-sm font-semibold">YTD Deductions:</p>
                <p className="text-lg"> { totalDeductions}</p>
              </div>
              <div className="p-2">
                <p className="text-sm font-semibold">YTD Net:</p>
                <p className="text-lg"> {(paycheckData.netSalary || Number(paycheckData.netSalary)).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white p-6 text-sm">
        <div className="grid grid-cols-2">
          <div>
            <p>Pay stub ID: {paycheckData.id || 'PST-' + new Date().getTime()}</p>
            <p>If you have any questions about this pay stub, please contact HR at {paycheckData.employee?.company?.name || 'hr@company.com'}</p>
          </div>
          <div className="text-right">
            <p>Generated on: {formatDate(new Date())}</p>
            <p>&copy; {new Date().getFullYear()} {paycheckData.employee?.company?.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

 

// Main component to use the PayStub
const PaycheckComponent:   React.FC<PaycheckComponentProps>  = ({ 
  open, paycheckData, onClose
 
}) => {
   
   const componentRef = useRef<HTMLDivElement>(null);
   const handlePrint = useReactToPrint({contentRef: componentRef});
   
 

  
  return (
    <Dialog
    open={ open}
    onClose={ onClose}  
    className="relative z-50"
  >
    <DialogBackdrop 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm"
    />
  
    <div className="fixed inset-0 flex items-start justify-center p-4 h-screen overflow-y-auto">
      <DialogPanel 
        className={`transform rounded-xl bg-white shadow-2xl transition-all w-auto max-w-full`}
      >
        <div className="flex items-end justify-between p-4 border-b">
        <div className="flex items-end justify-end">   
        <span></span> 
      <button 
        onClick={()=>handlePrint()}
        className="mt-6 bg-primary text-white px-6 py-2 rounded hover:bg-primary transition-colors"
      >
        Print
      </button></div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div ref={componentRef}>
        <PayStub paycheckData={paycheckData} />
        </div>
      </DialogPanel>
    </div>
  </Dialog>
    
  );
};

export default PaycheckComponent;
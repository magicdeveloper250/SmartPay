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

const PayStub: React.FC<PaycheckProps> = ({ 
  paycheckData, 
 
}) => {

  
   
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
  
  const payPeriod = `${formatDate(startDate)} - ${formatDate(endDate)}`;
   
  const baseEarnings = paycheckData.salary || 0;
  const additionalEarnings = paycheckData.additionalIncomes.reduce(
    (sum, income) => sum + income.amount, 0
  );
  const totalEarnings = baseEarnings + additionalEarnings;
  
  const totalTaxes = paycheckData.taxes.reduce((sum, tax) => sum + tax.taxAmount, 0).toFixed(2)
  
  const totalDeductions = paycheckData.deductions.reduce(
    (sum, deduction) => sum + deduction.amount, 0
  );
  
  

  
  return (
    
    <div className='px-4'>
      {/* Earnings Section remains the same */}
<div className="py-4 border-b border-gray-300">
  <div className="grid grid-cols-4 gap-2 border-b border-gray-300 pb-2">
    <div className="font-bold">EARNINGS</div>
    <div className="font-bold">TYPE</div>
    <div className="font-bold text-center">AMOUNT</div>
    <div className="font-bold text-right">TIME</div>
  </div>
  
  <div className="grid grid-cols-4 gap-2 py-1">
    <div>Regular Pay</div>
    <div>Salary</div>
    <div className="text-center">${paycheckData.salary.toFixed(2)}</div>
    <div className="text-right">{paycheckData.mainPayroll?.paymentDate?.toLocaleString()}</div>
  </div>
  
  {paycheckData.additionalIncomes.map((income, index) => (
    <div className="grid grid-cols-4 gap-2 py-1" key={`income-${index}`}>
      <div>Additional Income</div>
      <div>{income.incomeType}</div>
      <div className="text-center">${income.amount.toFixed(2)}</div>
      <div className="text-right">{formatDate(income.createdAt)}</div>
    </div>
  ))}
  
  <div className="grid grid-cols-4 gap-2 py-2 mt-2 border-t border-gray-300">
    <div className="font-bold">GROSS EARNINGS:</div>
    <div></div>
    <div className="text-center font-bold">
      ${(paycheckData.salary + paycheckData.additionalIncomes.reduce((sum, income) => sum + income.amount, 0)).toFixed(2)}
    </div>
    <div></div>
  </div>
</div>

{/* TAXES SECTION - Now separate from deductions */}
<div className="py-4 border-b border-gray-300">
  <div className="grid grid-cols-4 gap-2 border-b border-gray-300 pb-2">
    <div className="font-bold">TAXES</div>
    <div className="font-bold">TYPE</div>
    <div className="font-bold text-center">AMOUNT</div>
    <div className="font-bold text-right">TIME</div>
  </div>
  
  {/* Tax Deductions */}
  {paycheckData.taxes && paycheckData.taxes.map((tax, index) => (
    <div className="grid grid-cols-4 gap-2 py-1" key={`tax-${index}`}>
      <div>Tax</div>
      <div>{tax.taxName}</div>
      <div className="text-center">${tax.taxAmount.toFixed(2)}</div>
      {/* <div className="text-right">{formatDate(tax.taxD}</div> */}
    </div>
  ))}
  
  <div className="grid grid-cols-4 gap-2 py-2 mt-2 border-t border-gray-300">
    <div className="font-bold">TOTAL TAXES:</div>
    <div></div>
    <div className="text-center font-bold">
      ${((totalTaxes || 0) + 
         (paycheckData.taxes ? paycheckData.taxes.reduce((sum, tax) => sum + tax.taxAmount, 0) : 0)).toFixed(2)}
    </div>
    <div></div>
  </div>
</div>

{/* DEDUCTIONS SECTION - Now only for non-tax deductions */}
<div className="py-4 border-b border-gray-300">
  <div className="grid grid-cols-4 gap-2 border-b border-gray-300 pb-2">
    <div className="font-bold">DEDUCTIONS</div>
    <div className="font-bold">REASON</div>
    <div className="font-bold text-center">AMOUNT</div>
    <div className="font-bold text-right">TIME</div>
  </div>
  
  {/* Other Deductions */}
  {paycheckData.deductions && paycheckData.deductions.map((deduction, index) => (
    <div className="grid grid-cols-4 gap-2 py-1" key={`deduction-${index}`}>
      <div>Deduction</div>
      <div>{deduction.reason}</div>
      <div className="text-center">${deduction.amount.toFixed(2)}</div>
      <div className="text-right">{formatDate(deduction.createdAt)}</div>
    </div>
  ))}
  
  <div className="grid grid-cols-4 gap-2 py-2 mt-2 border-t border-gray-300">
    <div className="font-bold">TOTAL DEDUCTIONS:</div>
    <div></div>
    <div className="text-center font-bold">
      ${((totalDeductions || 0) + 
         (paycheckData.deductions ? paycheckData.deductions.reduce((sum, ded) => sum + ded.amount, 0) : 0)).toFixed(2)}
    </div>
    <div></div>
  </div>
</div>

{/* Summary Section - Now with separate lines for taxes and deductions */}
<div className="py-4 bg-gray-50 rounded-md p-4">
  <div className="grid grid-cols-2 gap-2 border-b border-gray-300 pb-2">
    <div className="font-bold">SUMMARY</div>
    <div className="font-bold text-right">AMOUNT</div>
  </div>
  
  <div className="grid grid-cols-2 gap-2 py-1">
    <div>Gross Earnings</div>
    <div className="text-right">
      ${(paycheckData.salary + paycheckData.additionalIncomes.reduce((sum, income) => sum + income.amount, 0)).toFixed(2)}
    </div>
  </div>
  
  <div className="grid grid-cols-2 gap-2 py-1">
    <div>Taxes</div>
    <div className="text-right">
      ${((totalTaxes || 0) + (paycheckData.taxes ? paycheckData.taxes.reduce((sum, tax) => sum + tax.taxAmount, 0) : 0)).toFixed(2)}
    </div>
  </div>
  
  <div className="grid grid-cols-2 gap-2 py-1">
    <div>Deductions</div>
    <div className="text-right">
      ${((totalDeductions || 0) + (paycheckData.deductions ? paycheckData.deductions.reduce((sum, ded) => sum + ded.amount, 0) : 0)).toFixed(2)}
    </div>
  </div>
  
  <div className="grid grid-cols-2 gap-2 py-1 border-t border-gray-300 mt-4">
    <div className="font-bold text-lg">NET PAY:</div>
    <div className="text-right font-bold text-lg text-green-700">${paycheckData.netSalary}</div>
  </div>
</div>

{/* Totals Footer */}
<div className="mt-6 pt-4 border-t border-gray-300">
  <p className="font-bold mb-2">YEAR-TO-DATE TOTALS</p>
  <div className="grid grid-cols-4 gap-4">
    <div className="bg-gray-100 p-2 rounded">
      <p className="text-sm font-semibold">Gross YTD:</p>
      <p className="text-lg">${(paycheckData.salary + paycheckData.additionalIncomes.reduce((sum, income) => sum + income.amount, 0)).toFixed(2)}</p>
    </div>
    <div className="bg-gray-100 p-2 rounded">
      <p className="text-sm font-semibold">Tax YTD:</p>
      <p className="text-lg">${(totalTaxes || 0).toFixed(2)}</p>
    </div>
    <div className="bg-gray-100 p-2 rounded">
      <p className="text-sm font-semibold">Deductions YTD:</p>
      <p className="text-lg">${(totalDeductions || 0).toFixed(2)}</p>
    </div>
    <div className="bg-gray-100 p-2 rounded">
      <p className="text-sm font-semibold">Net YTD:</p>
      <p className="text-lg">${paycheckData.netSalary}</p>
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
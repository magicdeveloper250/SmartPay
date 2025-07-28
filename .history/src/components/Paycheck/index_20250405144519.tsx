import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { X } from 'lucide-react';
import { PayrollWithEmployeeAndCustomTaxes } from '@/types/payroll';

 

export interface PaycheckData {
  data:PayrollWithEmployeeAndCustomTaxes
}

interface PaycheckProps {
 
  paycheckData: PaycheckData;
 
}

interface PaycheckComponentProps {
  open: boolean;
  paycheckData: PaycheckData;
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
  
  const startDate = new Date();
  const endDate = new Date(paycheckData.data.createdAt);
  endDate.setDate(endDate.getDate() + 14);  
  
  const payPeriod = `${formatDate(startDate)} - ${formatDate(endDate)}`;
   
  const baseEarnings = paycheckData.data.salary || 0;
  const additionalEarnings = paycheckData.data.additionalIncomes.reduce(
    (sum, income) => sum + income.amount, 0
  );
  const totalEarnings = baseEarnings + additionalEarnings;
  
  const totalTaxes = paycheckData.data.taxes.reduce(
    (sum, tax) => sum + tax.taxAmount, 0
  );
  
  const totalDeductions = paycheckData.data.deductions.reduce(
    (sum, deduction) => sum + deduction.amount, 0
  );
  
  

  
  return (
    
    <div className="flex flex-col items-center w-full">
     
      <div 
      
        className="w-full max-w-3xl border border-gray-300 bg-white p-6 shadow-md"
      >
        <div className="border-b-2 border-gray-800 pb-4">
          <div className="grid grid-cols-2">
            <div>
              <h1 className="text-xl font-bold">{paycheckData.data.employee?.company.name}</h1>
              <p className="text-sm">{paycheckData.data.employee?.company.country},{paycheckData.data.employee?.company.city} </p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold">Pay stub (hourly)</h2>
            </div>
          </div>
        </div>
        
        <div className="border-b border-gray-300 py-4">
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-2">
              <p className="font-bold">EMPLOYEE:</p>
              <p>{paycheckData.data.employee?.firstName} {paycheckData.data.employee?.secondName}</p>
              <p className="text-sm">{paycheckData.data.employee?.email}</p>
              <p className="text-sm">{paycheckData.data.employee?.phoneNumber}</p>
            </div>
            <div>
              <p className="font-bold">SOCIAL SECURITY:</p>
              <p>XXX-XX-XXXX</p>
            </div>
            <div>
              <p className="font-bold">PAY DATE:</p>
              <p>{formatDate(new Date(paycheckData.data.mainPayroll?.paymentDate?.toISOString() || ""))}</p>
            </div>
            <div>
              <p className="font-bold">PAY PERIOD:</p>
              <p>{payPeriod}</p>
            </div>
          </div>
        </div>
        
        <div className="py-4">
          <div className="grid grid-cols-4 gap-2 border-b border-gray-300 pb-2">
            <div className="font-bold">EARNINGS</div>
            <div className="font-bold text-center">TYPE</div>
            <div className="font-bold text-center">AMOUNT</div>
            <div className="font-bold text-right">TIME</div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 py-1">
            <div>Salary</div>
        
            <div className="text-center">{paycheckData.data.salary.toFixed(2)}</div>
            <div className="text-right">{paycheckData.data.mainPayroll?.paymentDate?.toLocaleString()}</div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 py-1">
            <div>Additional Incomes</div>
            {paycheckData.data.additionalIncomes.map((income,index)=>{
              return <> 
              <div className="text-center">{income.incomeType}</div>
              <div className="text-center">{income.amount.toFixed(2)}</div>
              <div className="text-right">{income.createdAt.toLocaleString()}</div></>

            })}
          </div>
          
         
          </div>
          
          <div className="grid grid-cols-4 gap-2 py-2 border-t border-gray-300">
            <div className="font-bold">GROSS EARNINGS:</div>
             
            <div className="text-right font-bold">{(paycheckData.data.salary +paycheckData.data.additionalIncomes.reduce((sum,income)=>sum+income.amount, 0)).toFixed(2)}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="grid grid-cols-2 gap-2 border-b border-gray-300 pb-2">
              <div className="font-bold">DEDUCTIONS</div>
              <div className="font-bold text-right">REASON</div>
              <div className="font-bold text-right">AMOUNT</div>
              <div className="font-bold text-right">TIME</div>
            </div>
            
           
            {paycheckData.data.deductions.map((deduction,index)=>{
              return <> 
              <div className="text-center">{deduction.reason}</div>
              <div className="text-center">{deduction.amount.toFixed(2)}</div>
              <div className="text-right">{deduction.createdAt.toLocaleString()}</div></>

            })}
            
          </div>
          
          <div>
            <div className="grid grid-cols-2 gap-2 border-b border-gray-300 pb-2">
              <div className="font-bold">SUMMARY</div>
              <div className="font-bold text-right">AMOUNT</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 py-1">
              <div>Gross Earnings</div>
              <div className="text-right">{(paycheckData.data.salary +paycheckData.data.additionalIncomes.reduce((sum,income)=>sum+income.amount, 0)).toFixed(2)}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 py-1">
              <div>Taxes</div>
              <div className="text-right">{(totalTaxes + paycheckData.data.taxes.reduce((sum, tax) => sum + tax.taxAmount, 0)).toFixed(2)}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 py-1">
              <div>Other Deductions</div>
              <div className="text-right">{(totalDeductions + paycheckData.data.deductions.reduce((sum, ded) => sum + ded.amount, 0)).toFixed(2)}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 py-1 border-t border-gray-300 mt-4">
              <div className="font-bold">NET PAY:</div>
              <div className="text-right font-bold">{paycheckData.data.netSalary}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-300">
          <p className="font-bold">TOTALS</p>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div>
              <p className="text-sm">Gross: {(paycheckData.data.salary +paycheckData.data.additionalIncomes.reduce((sum,income)=>sum+income.amount, 0)).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm">Tax: {totalTaxes}</p>
            </div>
            <div>
              <p className="text-sm">Additional Income: {paycheckData.data.additionalIncomes.reduce((sum,income)=>sum+income.amount, 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm">Medicare: $152.25</p>
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
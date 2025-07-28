import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { X } from 'lucide-react';

// Define interfaces for our data types
interface Employee {
  id: string;
  firstName: string;
  secondName: string;
  email: string;
  phoneNumber: string;
}

interface DeductionOrTax {
  name: string;
  amount: number;
}

interface AdditionalIncome {
  name: string;
  amount: number;
}

interface Benefit {
  name: string;
  amount: number;
}

export interface PaycheckData {
  id: string;
  employeeId: string;
  employee: Employee;
  salary: number;
  netSalary: number;
  taxes: DeductionOrTax[];
  deductions: DeductionOrTax[];
  additionalIncomes: AdditionalIncome[];
  benefits: Benefit[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
  mainPayollId: string;
  contractId: string | null;
  contractorId: string | null;
  companyName?: string;
  companyAddress?: string;
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

  
  // Format date for pay period
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };
  
  const startDate = new Date(paycheckData.createdAt);
  const endDate = new Date(paycheckData.createdAt);
  endDate.setDate(endDate.getDate() + 14); // Assuming bi-weekly pay periods
  
  const payPeriod = `${formatDate(startDate)} - ${formatDate(endDate)}`;
  
  // Calculate total earnings and deductions
  const baseEarnings = paycheckData.salary || 0;
  const additionalEarnings = paycheckData.additionalIncomes.reduce(
    (sum, income) => sum + income.amount, 0
  );
  const totalEarnings = baseEarnings + additionalEarnings;
  
  const totalTaxes = paycheckData.taxes.reduce(
    (sum, tax) => sum + tax.amount, 0
  );
  
  const totalDeductions = paycheckData.deductions.reduce(
    (sum, deduction) => sum + deduction.amount, 0
  );
  
  // Sample deductions (since the provided data doesn't include standard deductions)
  const standardDeductions = [
    { name: "Federal Income Tax", amount: 350.25 },
    { name: "Social Security", amount: 155.00 },
    { name: "Medicare", amount: 36.25 },
    { name: "State Tax", amount: 75.23 },
    { name: "CA State DI", amount: 10.14 },
    { name: "Health Insurance", amount: 87.52 }
  ];
  
  // Calculate net pay
  const netPay = totalEarnings - totalTaxes - totalDeductions - 
    standardDeductions.reduce((sum, ded) => sum + ded.amount, 0);
  
  // Hours (assuming 40-hour work week for 2 weeks)
  const regularHours = 80;
  const overtimeHours = 5;
  const totalHours = regularHours + overtimeHours;
  
  // Handle print functionality

  
  return (
    
    <div className="flex flex-col items-center w-full">
     
      <div 
      
        className="w-full max-w-3xl border border-gray-300 bg-white p-6 shadow-md"
      >
        <div className="border-b-2 border-gray-800 pb-4">
          <div className="grid grid-cols-2">
            <div>
              <h1 className="text-xl font-bold">{paycheckData.companyName}</h1>
              <p className="text-sm">{paycheckData.companyAddress}</p>
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
              <p>{paycheckData.employee.firstName} {paycheckData.employee.secondName}</p>
              <p className="text-sm">{paycheckData.employee.email}</p>
              <p className="text-sm">{paycheckData.employee.phoneNumber}</p>
            </div>
            <div>
              <p className="font-bold">SOCIAL SECURITY:</p>
              <p>XXX-XX-XXXX</p>
            </div>
            <div>
              <p className="font-bold">PAY DATE:</p>
              <p>{formatDate(new Date(paycheckData.createdAt))}</p>
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
            <div className="font-bold text-center">HOURS</div>
            <div className="font-bold text-center">RATE</div>
            <div className="font-bold text-right">AMOUNT</div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 py-1">
            <div>Regular</div>
            <div className="text-center">{regularHours.toFixed(2)}</div>
            <div className="text-center">28.75</div>
            <div className="text-right">{(regularHours * 28.75).toFixed(2)}</div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 py-1">
            <div>Overtime</div>
            <div className="text-center">{overtimeHours.toFixed(2)}</div>
            <div className="text-center">43.13</div>
            <div className="text-right">{(overtimeHours * 43.13).toFixed(2)}</div>
          </div>
          
          {paycheckData.additionalIncomes.map((income, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 py-1">
              <div>{income.name}</div>
              <div className="text-center">-</div>
              <div className="text-center">-</div>
              <div className="text-right">{income.amount.toFixed(2)}</div>
            </div>
          ))}
          
          <div className="grid grid-cols-4 gap-2 py-2 border-t border-gray-300">
            <div className="font-bold">GROSS EARNINGS:</div>
            <div className="text-center font-bold">{totalHours.toFixed(2)}</div>
            <div></div>
            <div className="text-right font-bold">{totalEarnings.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="grid grid-cols-2 gap-2 border-b border-gray-300 pb-2">
              <div className="font-bold">DEDUCTIONS</div>
              <div className="font-bold text-right">AMOUNT</div>
            </div>
            
            {standardDeductions.map((deduction, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 py-1">
                <div>{deduction.name}</div>
                <div className="text-right">{deduction.amount.toFixed(2)}</div>
              </div>
            ))}
            
            {paycheckData.deductions.map((deduction, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 py-1">
                <div>{deduction.name}</div>
                <div className="text-right">{deduction.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <div>
            <div className="grid grid-cols-2 gap-2 border-b border-gray-300 pb-2">
              <div className="font-bold">SUMMARY</div>
              <div className="font-bold text-right">AMOUNT</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 py-1">
              <div>Gross Earnings</div>
              <div className="text-right">{totalEarnings.toFixed(2)}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 py-1">
              <div>Taxes</div>
              <div className="text-right">{(totalTaxes + standardDeductions.filter(d => d.name.includes("Tax") || d.name.includes("Social Security") || d.name.includes("Medicare")).reduce((sum, tax) => sum + tax.amount, 0)).toFixed(2)}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 py-1">
              <div>Other Deductions</div>
              <div className="text-right">{(totalDeductions + standardDeductions.filter(d => !d.name.includes("Tax") && !d.name.includes("Social Security") && !d.name.includes("Medicare")).reduce((sum, ded) => sum + ded.amount, 0)).toFixed(2)}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 py-1 border-t border-gray-300 mt-4">
              <div className="font-bold">NET PAY:</div>
              <div className="text-right font-bold">{netPay.toFixed(2)}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-300">
          <p className="font-bold">YTD TOTALS</p>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div>
              <p className="text-sm">Gross: $10,500.00</p>
            </div>
            <div>
              <p className="text-sm">Fed Tax: $1,400.88</p>
            </div>
            <div>
              <p className="text-sm">Soc Sec: $651.00</p>
            </div>
            <div>
              <p className="text-sm">Medicare: $152.25</p>
            </div>
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
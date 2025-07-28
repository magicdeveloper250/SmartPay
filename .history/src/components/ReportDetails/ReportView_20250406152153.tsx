"use client"
import React, {   useRef,  } from 'react';
import {   X } from "lucide-react";
 
import { Dialog, DialogBackdrop, DialogPanel,  } from '@headlessui/react';
 
import { useReactToPrint } from 'react-to-print';
import { useRouter } from 'next/navigation';
 
 
import { payrollWithEmployee } from '@/types/payroll';
import { formatCurrency } from '@/utils/fomatters';


interface PaycheckProps {
 
  paycheckData: payrollWithEmployee;
 
}

interface PaycheckComponentProps {
  
  paycheckData: payrollWithEmployee;
 
}

export  const ReportDisplay:   React.FC<PaycheckComponentProps>  = ({ 
   paycheckData
 
}) => {
 
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({contentRef: componentRef});

  const router= useRouter()


 
 return (
   <Dialog
   open={ true}
   onClose={ ()=>router.back()}  
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
           onClick={()=>router.back()}
           className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
           aria-label="Close modal"
         >
           <X className="h-5 w-5 text-gray-500" />
         </button>
       </div>
       <div ref={componentRef}>
       <ReportStub paycheckData={paycheckData} />
       </div>
     </DialogPanel>
   </div>
 </Dialog>
   
 );
}




 


 

 


const ReportStub: React.FC<PaycheckProps> = ({ paycheckData }) => {
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
  
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg overflow-hidden">
      {/* Header Section - Kept from original */}
      <div className="bg-primary text-white p-6">
        <div className="grid grid-cols-2">
          <div>
            <h1 className="text-2xl font-bold">{paycheckData.employee?.company?.name}</h1>
            <p className="text-sm">{paycheckData.employee?.company?.city}, {paycheckData.employee?.company?.country}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold">Transaction Report</h2>
            <p className="text-md">Report Date: {formatDate(new Date())}</p>
          </div>
        </div>
      </div>

      {/* Employee Information Section - Kept from original */}
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

      {/* Laptop Purchase Information - New section based on attachment */}
      <div className="p-6 border-b border-gray-300">
        <h3 className="text-lg font-bold mb-3 text-blue-800">Payroll Report Details</h3>
        <div className="bg-white p-4 rounded shadow">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p><span className="font-semibold">Reference:</span> {paycheckData.id}</p>
              <p><span className="font-semibold">Payment Type:</span> {paycheckData.mainPayroll?.payrollType}</p>
              <p><span className="font-semibold">Payment Period:</span> { new Date(paycheckData.updatedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short'
                  })}</p>
              <p><span className="font-semibold">Amount:</span> {formatCurrency(paycheckData.netSalary, paycheckData.employee?.currency)}</p>
            </div>
            <div>
              <p><span className="font-semibold">Payment Channel:</span> {paycheckData.employee?.paymentMethod}</p>
              <p><span className="font-semibold">Date:</span>   {paycheckData.updatedAt.toLocaleString('en-US', {
                    weekday: 'short', 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric'
                  })}</p>
              <p><span className="font-semibold">Status:</span> {paycheckData.status}</p>
            </div>
          </div>
        </div>
      </div>

    

      {/* Footer - Kept from original */}
      <div className="bg-gray-800 text-white p-6 text-sm">
        <div className="grid grid-cols-2">
          <div>
            <p>Report ID: {paycheckData.id}</p>
            <p>If you have any questions about this report, please contact IT at {paycheckData.employee?.company?.name || 'it@company.com'}</p>
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



 

 
 
 

 

 
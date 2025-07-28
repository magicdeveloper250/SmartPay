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

      <div className="max-w-4xl mx-auto bg-white rounded shadow">
      {/* Employee Information Section */}
      <div className="p-6 border-b border-gray-300 bg-gray-50">
        <h3 className="text-lg font-bold mb-3">Employee Information</h3>
        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full table-auto">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="font-semibold p-3 bg-gray-100 w-1/3">Name</td>
                <td className="p-3">{paycheckData.employee?.firstName} {paycheckData.employee?.secondName}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="font-semibold p-3 bg-gray-100">Employee ID</td>
                <td className="p-3">{paycheckData.employee?.id}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="font-semibold p-3 bg-gray-100">Position</td>
                <td className="p-3">{paycheckData.employee?.jobTitle}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="font-semibold p-3 bg-gray-100">Department</td>
                <td className="p-3">{paycheckData.employee?.department}</td>
              </tr>
              <tr>
                <td className="font-semibold p-3 bg-gray-100">Hire Date</td>
                <td className="p-3">{paycheckData.employee?.startDate ? formatDate(new Date(paycheckData.employee?.startDate)) : 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Payroll Report Details */}
      <div className="p-6 border-b border-gray-300">
        <h3 className="text-lg font-bold mb-3 text-blue-800">Payroll Report Details</h3>
        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full table-auto">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="font-semibold p-3 bg-gray-100 w-1/3">Reference</td>
                <td className="p-3">{paycheckData.id}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="font-semibold p-3 bg-gray-100">Payment Type</td>
                <td className="p-3">{paycheckData.mainPayroll?.payrollType}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="font-semibold p-3 bg-gray-100">Payment Period</td>
                <td className="p-3">{new Date(paycheckData.updatedAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short'
                })}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="font-semibold p-3 bg-gray-100">Amount</td>
                <td className="p-3">{formatCurrency(paycheckData.netSalary, paycheckData.employee?.currency)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="font-semibold p-3 bg-gray-100">Payment Channel</td>
                <td className="p-3">{paycheckData.employee?.paymentMethod}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="font-semibold p-3 bg-gray-100">Date</td>
                <td className="p-3">{new Date(paycheckData.updatedAt).toLocaleString('en-US', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}</td>
              </tr>
              <tr>
                <td className="font-semibold p-3 bg-gray-100">Status</td>
                <td className="p-3">{paycheckData.status}</td>
              </tr>
            </tbody>
          </table>
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



 

 
 
 

 

 
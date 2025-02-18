"use client"
import React from 'react';
import { Clock, MapPin, Package, Copy } from 'lucide-react';
import { MainPayroll, Payroll } from '@prisma/client';
import PaymentStatusView from '../PaymentStatusView';

export function PayrollDetail ({ mainPayroll, payrolls }: { mainPayroll: MainPayroll, payrolls: Payroll[] }){

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">#{mainPayroll.id}</p>
        </div>
         <PaymentStatusView status={mainPayroll.status}/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Amount to be paid</p>
          <p className="font-medium">{payrolls[0].salary}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Payment Date</p>
          <p className="font-medium">{mainPayroll.paymentDate?.toLocaleDateString()}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Total Employees</p>
          <p className="font-medium">{payrolls.length}</p>
        </div>
      </div>

     
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-medium">Items</h2>
          <span className="text-sm text-gray-600">4</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         
         {payrolls.map(payroll=>{
          return  <div className="flex items-center gap-4" key={payroll.id}>
          <div>
            <p className="font-medium">{payroll?.employee?.firstName}</p>
            <p className="text-gray-600">{payroll.netSalary}</p>
            <p className="text-sm text-gray-500"><PaymentStatusView status={payroll.status}/></p>
          </div>
        </div>
         })}
        </div>
      </div>
    </div>
  );
};

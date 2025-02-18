"use client"
import React from 'react';
import { ChevronRight, Loader2} from 'lucide-react';
import { MainPayroll, Payroll } from '@prisma/client';
import PaymentStatusView from '../PaymentStatusView';
import { PaymentStatus } from '@prisma/client';

export function PayrollDetail ({ mainPayroll, payrolls }: { mainPayroll: MainPayroll, payrolls: Payroll[] }){
  const [loadingPayments, setLoadingPayments] = React.useState<string[]>([]);

  const handlePay = async (payrollId: string) => {
    try {
      setLoadingPayments(prev => [...prev, payrollId]);
    } finally {
      setLoadingPayments(prev => prev.filter(id => id !== payrollId));
    }
  };


  const PayButton = ({ status, payrollId }: { status: PaymentStatus; payrollId: string }) => {
    const isLoading = loadingPayments.includes(payrollId);

    switch (status) {
      case PaymentStatus.Pending:
        return (
          <button
            onClick={() => handlePay(payrollId)}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Pay Now'
            )}
          </button>
        );
      case PaymentStatus.Paid:
        return (
          <button
            disabled
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md cursor-not-allowed"
          >
            Paid
          </button>
        );
      case PaymentStatus.Failed:
        return (
          <button
            onClick={() => handlePay(payrollId)}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Retry Payment'
            )}
          </button>
        );
      default:
        return null;
    }
  };

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
          <h2 className="text-lg font-medium">Employees</h2>
          <span className="text-sm text-gray-600">{payrolls.length}</span>
        </div>
        <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-3 bg-gray-50 p-4 border-b">
        <div className="font-medium text-gray-600">Employee</div>
        <div className="font-medium text-gray-600">Net Salary</div>
        <div className="font-medium text-gray-600">Status</div>
        <div className="font-medium text-gray-600">Action</div>
      </div>

      {/* Payroll Items */}
      <div className="divide-y">
        {payrolls.map(payroll => (
          <div 
            key={payroll.id} 
            className="grid grid-cols-4 p-4 items-center hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div>
              <p className="font-medium text-gray-900">{payroll?.employee?.firstName}</p>
            </div>
            <div>
              <p className="text-gray-600">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(payroll.netSalary)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <PaymentStatusView status={payroll.status} />
            </div>
            <div className="flex items-center justify-between">
              <PayButton status={payroll.status} payrollId={payroll.id} />
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            
          </div>
        ))}
      </div>

      {/* Empty State */}
      {payrolls.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No payroll records found
        </div>
      )}
    </div>
      </div>
    </div>
  );
};

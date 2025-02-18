"use client"
import React from 'react';
import { useState } from 'react';
import {  ChevronRight, Loader2, Search, Ban, CheckCircle2, PlayCircle } from 'lucide-react';
import { MainPayroll, Payroll } from '@prisma/client';
import PaymentStatusView from '../PaymentStatusView';
import { PaymentStatus } from '@prisma/client';
import { activatePayroll, activatePayrollById, cancellPayrollAll, cancellPayrollById, payPayrollAll, payPayrollById } from '@/actions/payroll';
import toast from 'react-hot-toast';

export function PayrollDetail ({ mainPayroll, payrolls }: { mainPayroll: MainPayroll, payrolls: Payroll[] }){
  const [loadingPayments, setLoadingPayments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [isMainActionLoading, setIsMainActionLoading] = useState(false);

  const handlePay = async (payrollId: string) => {

    try {
      setLoadingPayments(prev => [...prev, payrollId]);
      const payroll = await payPayrollById(mainPayroll.id, payrollId)
           if ("error" in payroll) {
             toast.error(payroll.error)
           }
      toast.success("Payment processed successfully.")
    } finally {
      setLoadingPayments(prev => prev.filter(id => id !== payrollId));
    }
  };

  const handleCancel = async (payrollId: string) => {

    try {
      setLoadingPayments(prev => [...prev, payrollId]);
      const payroll = await cancellPayrollById(mainPayroll.id, payrollId)
           if ("error" in payroll) {
             toast.error(payroll.error)
           }
      toast.success("Payment Cancelled successfully.")
    } finally {
      setLoadingPayments(prev => prev.filter(id => id !== payrollId));
    }
  };

  const handleActivate = async (payrollId: string) => {

    try {
      setLoadingPayments(prev => [...prev, payrollId]);
      const payroll = await activatePayrollById(mainPayroll.id, payrollId)
           if ("error" in payroll) {
             toast.error(payroll.error)
           }
      toast.success("Payment  Activate successfully.")
    } finally {
      setLoadingPayments(prev => prev.filter(id => id !== payrollId));
    }
  };

  const filteredPayrolls = payrolls.filter(payroll => {
    const matchesSearch = (payroll?.employee?.firstName?.toLowerCase() || '')
      .includes(searchTerm.toLowerCase()) ||
      (payroll?.employee?.secondName?.toLowerCase() || '')
      .includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || payroll.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });


  const handleCancelPayroll = async () => {
    setIsMainActionLoading(true);
    try {
       await cancellPayrollAll(mainPayroll.id)
      toast.success("Payroll cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel payroll");
    } finally {
      setIsMainActionLoading(false);
    }
  };

  const handleActivatePayroll = async () => {
    setIsMainActionLoading(true);
    try {
       await activatePayroll(mainPayroll.id)
      toast.success("Payroll activated successfully");
    } catch (error) {
      toast.error("Failed to activate payroll");
    } finally {
      setIsMainActionLoading(false);
    }
  };

  const handlePayAll = async () => {
    setIsMainActionLoading(true);
    try {
       await payPayrollAll(mainPayroll.id)
      toast.success("Processing all payments");
    } catch (error) {
      toast.error("Failed to process payments");
    } finally {
      setIsMainActionLoading(false);
    }
  };
  
  const MainActionButton = () => {
    switch (mainPayroll.status) {
      case PaymentStatus.Pending:
        return (
          <div className="flex gap-2">
            <button
              onClick={handleCancelPayroll}
              disabled={isMainActionLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {isMainActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
              Cancel Payroll
            </button>
            <button
              onClick={handlePayAll}
              disabled={isMainActionLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {isMainActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Pay All
            </button>
          </div>
        );
      case PaymentStatus.Cancelled:
        return (
          <button
            onClick={handleActivatePayroll}
            disabled={isMainActionLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isMainActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
            Activate Payroll
          </button>
        );
      case PaymentStatus.Failed:
        return (
          <button
            onClick={handlePayAll}
            disabled={isMainActionLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isMainActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Retry All
          </button>
        );
      default:
        return null;
    }
  };

  const PayButton = ({ status, payrollId }: { status: PaymentStatus; payrollId: string }) => {
    const isLoading = loadingPayments.includes(payrollId);

    switch (status) {
      case PaymentStatus.Pending:
        return (
          <div className="flex items-center gap-4">
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
          <button
            onClick={() => handleCancel(payrollId)}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Cancel'
            )}
          </button>
          </div>
         
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

        case PaymentStatus.Cancelled:
          return (
            <button
              onClick={() => handleActivate(payrollId)}
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
        <div className="flex items-center gap-4">
          <MainActionButton />
          <PaymentStatusView status={mainPayroll.status}/>
        </div>
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">Employees</h2>
            <span className="text-sm text-gray-600">{filteredPayrolls.length}</span>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'ALL')}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="ALL">All Status</option>
              {Object.values(PaymentStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 bg-gray-50 p-4 border-b">
            <div className="font-medium text-gray-600">Employee</div>
            <div className="font-medium text-gray-600">Net Salary</div>
            <div className="font-medium text-gray-600">Status</div>
            <div className="font-medium text-gray-600">Action</div>
          </div>

          <div className="divide-y">
            {filteredPayrolls.map(payroll => (
              <div 
                key={payroll.id} 
                className="grid grid-cols-4 p-4 items-center hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {payroll?.employee?.firstName} {payroll?.employee?.secondName}
                  </p>
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

          {filteredPayrolls.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No matching payroll records found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

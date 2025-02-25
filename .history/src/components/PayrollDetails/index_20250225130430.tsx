"use client"
import React, { useState } from 'react';
import { ChevronRight, Loader2, Search, Ban, CheckCircle2, PlayCircle, DollarSign, Users, Calendar } from 'lucide-react';
import { MainPayroll } from '@prisma/client';
import PaymentStatusView from '@/components/PaymentStatusView';
import { PaymentStatus } from '@prisma/client';
import { activatePayroll, activatePayrollById, cancellPayrollAll, cancellPayrollById, payPayrollAll, payPayrollById } from '@/actions/payroll';
import toast from 'react-hot-toast';
import { payrollWithEmployee } from '@/types/payroll';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export function PayrollDetail({ mainPayroll, payrolls }: { mainPayroll: MainPayroll, payrolls: payrollWithEmployee[] }) {
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

    const buttonProps = {
      size: "sm",
      disabled: isLoading,
      className: "min-w-[100px]"
    };

    switch (status) {
      case PaymentStatus.Pending:
        return (
          <div className="flex items-center gap-2">
            <Button
              {...buttonProps}
              variant="primary"
              onClick={() => handlePay(payrollId)}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Pay Now
            </Button>
            <Button
              {...buttonProps}
              variant="destructive"
              onClick={() => handleCancel(payrollId)}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Cancel
            </Button>
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
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Activate'
              )}
            </button>
          );
      default:
        return null;
    }
  };

  // Stats cards data
  const stats = [
    {
      title: "Total Amount",
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(payrolls[0].salary),
      icon: <DollarSign className="w-6 h-6 text-blue-600" />
    },
    {
      title: "Payment Date",
      value: mainPayroll.paymentDate?.toLocaleDateString(),
      icon: <Calendar className="w-6 h-6 text-green-600" />
    },
    {
      title: "Total Employees",
      value: payrolls.length,
      icon: <Users className="w-6 h-6 text-purple-600" />
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Payroll Details</h1>
            <p className="text-sm text-muted-foreground">
              Reference ID: #{mainPayroll.id}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PaymentStatusView status={mainPayroll.status} />
            <MainActionButton />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-semibold">
              Employees ({filteredPayrolls.length})
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Input
                  type="text"
                  placeholder="Search employee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  aria-label="Search employees"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as PaymentStatus | 'ALL')}
                aria-label="Filter by status"
              >
                <option value="ALL">All Status</option>
                {Object.values(PaymentStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayrolls.map(payroll => (
                  <TableRow key={payroll.id}>
                    <TableCell className="font-medium">
                      {payroll?.employee?.firstName} {payroll?.employee?.secondName}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(payroll.netSalary)}
                    </TableCell>
                    <TableCell>
                      <PaymentStatusView status={payroll.status} />
                    </TableCell>
                    <TableCell>
                      <PayButton status={payroll.status} payrollId={payroll.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredPayrolls.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No matching payroll records found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
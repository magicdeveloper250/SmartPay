"use client"
import React, { useEffect, useState } from 'react';
import { ChevronRight, Loader2, Search, Ban, CheckCircle2, PlayCircle, X } from 'lucide-react';
import { MainPayroll, Payroll, SupportedTaxes } from '@prisma/client';
import PaymentStatusView from '@/components/PaymentStatusView';
import { PaymentStatus } from '@prisma/client';
import { activatePayroll, activatePayrollById, cancellPayrollAll, cancellPayrollById, payPayrollAll, payPayrollById } from '@/actions/payroll';
import toast from 'react-hot-toast';
import { PayrollReturnType, payrollWithEmployee, PayrollWithEmployeeAndCustomTaxes } from '@/types/payroll';
import Link from 'next/link';
import { calculateRwandaIncomeTax, getCurrentSupportedTaxYear, explainTaxCalculation } from '@/types/incomeTaxes';
import { getRwandaTaxRates } from '@/types/hmrc';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import PaycheckComponent from '../Paycheck';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function PayrollDetail({ mainPayroll, payrolls }: { mainPayroll: MainPayroll, payrolls: PayrollWithEmployeeAndCustomTaxes[]}) {
  const [loadingPayments, setLoadingPayments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [isMainActionLoading, setIsMainActionLoading] = useState(false);
  const [viewPayCheck, setViewPaycheck] = useState<boolean>(false);
  const [currentPayroll, setCurrentPayroll] = useState<string|null>(null);

  // ... (keep all your existing handler functions)

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* ... (keep all the existing JSX above the taxes section) */}

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-8 bg-gray-50 p-4 border-b">
          <div className="font-medium text-gray-600">Employee</div>
          <div className="font-medium text-gray-600">Incomes</div>
          <div className="font-medium text-gray-600">Deductions</div>
          <div className="font-medium text-gray-600">Taxes</div>
          <div className="font-medium text-gray-600">Contributions</div>
          <div className="font-medium text-gray-600">Net Salary</div>
          <div className="font-medium text-gray-600">Status</div>
          <div className="font-medium text-gray-600">Action</div>
        </div>

        <div className="divide-y">
          {filteredPayrolls.map((payroll) => (
            <div
              key={payroll.id}
              className="grid grid-cols-8 p-4 items-center hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              {/* ... (keep all other columns the same) */}
              
              <div>
                <ul className="divide-y divide-gray-200 rounded-lg">
                  {payroll.taxes.map((tax, idx) => (
                    <li key={idx} className="grid grid-cols-1 text-sm">
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 rounded">
                            <span className="font-extrabold">
                              {tax.taxName}
                            </span>
                            <span className="font-medium">
                              {new Intl.NumberFormat('en-US', { 
                                style: 'currency', 
                                currency: "RWF" 
                              }).format(tax.taxAmount)}
                            </span>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4 bg-white shadow-lg rounded-md border border-gray-200">
                          <h4 className="font-bold mb-2">{tax.taxName}</h4>
                          <div 
                            className="prose prose-sm max-w-none" 
                            dangerouslySetInnerHTML={{ __html: tax.taxDescription || 'No description available' }}
                          />
                        </PopoverContent>
                      </Popover>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ... (keep the rest of the component the same) */}
            </div>
          ))}
        </div>

        {filteredPayrolls.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No matching payroll records found
          </div>
        )}
      </div>
      
      <PaycheckComponent 
        open={viewPayCheck} 
        paycheckData={currentPayroll!==null ? payrolls.filter(p=>p.id==currentPayroll)[0]:payrolls[0]} 
        onClose={()=>setViewPaycheck(false)}
      />
    </div>
  );
}
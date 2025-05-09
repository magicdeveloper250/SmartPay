import React from 'react';
import { File, ChevronRight } from 'lucide-react';
import { getPayrollHistory } from '@/actions/payroll';
import Pagination from '../Pagination';
import { PaymentStatus, PayrollType } from '@prisma/client';
import { HistoryNav } from "./historyNav"
import Link from 'next/link';

export async function PayrollHistory({ status, currentPage, type }: { currentPage: number; status: PaymentStatus, type: PayrollType }) {
  const { history = [], pagination } = await getPayrollHistory(type, status, currentPage);
  
  return (
    <div className="w-full max-w-2xl p-4" role="region" aria-label="Payroll History">
      <HistoryNav />

      <div className="mt-8 relative">
        <div className="absolute left-[19px] top-0 h-full w-0.5 bg-blue-200 dark:bg-primary" />

        <div className="space-y-8">
          {history.map((history) => (
            <div
              key={history.id}
              className="flex gap-4 relative group"
            >
              <div className="relative flex items-start z-10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 border-4 border-white dark:border-gray-900 dark:bg-primary transition-transform group-hover:scale-110">
                  <div className="text-primary dark:text-blue-300">
                    <File className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="flex-1 pt-1">
                <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {history.paymentDate?.toLocaleDateString()}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1" aria-label={`Payment ID: ${history.id}`}>
                      {history.id}
                    </p>
                  </div>
                  <Link
                    href={`/history/${history.id}/detail?type=${history.payrollType}`}
                    scroll={false}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors group-hover:gap-2"
                    aria-label={`View details for payment dated ${history.paymentDate?.toLocaleDateString()}`}
                  >
                    See Details
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex w-full justify-center">
        <Pagination totalPages={pagination?.totalPages ?? 0} />
      </div>
    </div>
  );
}

export default PayrollHistory;
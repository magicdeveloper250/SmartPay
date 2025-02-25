import React from 'react';
import { File, ChevronRight } from 'lucide-react';
import { getPayrollHistory } from '@/actions/payroll';
import Pagination from '../Pagination';
import { PaymentStatus } from '@prisma/client';
import {HistoryNav} from "./historyNav"
import moment from 'moment'
import Link from 'next/link';
import { motion } from 'framer-motion';

const dateFormatter = (date: Date): string => {
  const dateDifferenceInTime: number = new Date().getTime() - date.getTime();
 
  const dateDifferenceInDays: number = dateDifferenceInTime / (1000 * 60 * 60 * 24);
 
  if (dateDifferenceInDays < 1) {
    return moment(date).format("LT");  
  } else if (dateDifferenceInDays < 2) {
    return "Yesterday";  
  } else if (dateDifferenceInDays <= 7) {
    return moment(date).format("dddd");  
  } else {
    return moment(date).format("l");  
  }
};

export async function PayrollHistory({   status, currentPage, }: {currentPage: number; status:PaymentStatus  }) {
  const {history, pagination} = await getPayrollHistory(status,currentPage);
  
  return (
    <div className="w-full max-w-2xl p-4" role="region" aria-label="Payroll History">
      <HistoryNav/>

      <div className="mt-8 relative">
        <div className="absolute left-[19px] top-0 h-full w-0.5 bg-blue-200 dark:bg-blue-800" />

        <div className="space-y-8">
          {history.map((history, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={history.id}
              className="flex gap-4 relative group"
            >
              <div className="relative flex items-start z-10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 border-4 border-white dark:border-gray-900 dark:bg-blue-900 transition-transform group-hover:scale-110">
                  <div className="text-blue-600 dark:text-blue-300">
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
                  {history.payrolls.length > 0 && (
                    <Link
                      href={`/history/${history.id}/detail`}
                      scroll={false}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors group-hover:gap-2"
                      aria-label={`View details for payment dated ${history.paymentDate?.toLocaleDateString()}`}
                    >
                      See Details
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
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
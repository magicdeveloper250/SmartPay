'use client';

import React from 'react';
import { File, ChevronRight } from 'lucide-react';
import { getPayrollHistory } from '@/actions/payroll';
import Pagination from '../Pagination';
import { PaymentStatus } from '@prisma/client';
import { HistoryNav } from "./historyNav"
import moment from 'moment'
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedHistoryItem } from './AnimatedHistoryItem';

export async function PayrollHistory({   status, currentPage, }: {currentPage: number; status:PaymentStatus  }) {
  const {history, pagination} = await getPayrollHistory(status,currentPage);
  
  return (
    <div className="w-full max-w-2xl p-4" role="region" aria-label="Payroll History">
      <HistoryNav/>

      <div className="mt-8 relative">
        <div className="absolute left-[19px] top-0 h-full w-0.5 bg-blue-200 dark:bg-blue-800" />

        <div className="space-y-8">
          {history.map((item, index) => (
            <AnimatedHistoryItem key={item.id} history={item} index={index} />
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
import React from 'react';
import { File} from 'lucide-react';
import { getPayrollHistory } from '@/actions/payroll';
import Pagination from '../Pagination';
import { PaymentStatus } from '@prisma/client';
import {HistoryNav} from "./historyNav"
import moment from 'moment'
import Link from 'next/link';

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
    <div className="w-full max-w-2xl p-4">
      <HistoryNav/>

      <div className="mt-8 relative">
        <div className="absolute left-[19px] top-0 h-full w-0.5 bg-blue-200" />

        <div className="space-y-8">
          {history.map((history, index) => (
            <div key={index} className="flex gap-4 relative">
              <div className="relative flex items-start z-10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 border-4 border-white">
                  <div className="text-blue-600">
                    <File className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="flex-1 pt-1 bg-white">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {  history.paymentDate?.toLocaleDateString()}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{history.id}</p>
                  </div>
                  {history.payrolls.length > 0 && (
                    <Link href={`/history/${history.id}/detail`} scroll={false} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      See Details
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={pagination?.totalPages ? pagination.totalPages : 0} />
      </div>
    </div>
  );
}

export default PayrollHistory;
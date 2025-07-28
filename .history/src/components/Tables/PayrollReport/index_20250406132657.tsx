import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import Pagination from "@/components/Pagination"
import { Skeleton } from "@/components/ui/skeleton";
import { getPayrollTransactions } from "@/actions/reportActions";
import { formatCurrency } from "@/utils/fomatters";
import { EllipsisVertical } from "lucide-react";
import PopoverWrapper from "@/components/PopoverWrapper";



export default async function PayrollReportTable({ query, currentPage }: { query: string, currentPage: number }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Unauthorized access. Please sign in to view employee data.</p>
      </div>
    );
  }

  const { payrolls, pagination } = await getPayrollTransactions(query, currentPage);

  if (!payrolls?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="mb-2">No Payroll transactions found</p>
        <p className="text-sm">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-16 text-center py-4 font-semibold text-gray-600">
                No
              </TableHead>
              <TableHead className="min-w-[150px] py-4 font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  
                  Reference
                </div>
              </TableHead>
              <TableHead className="min-w-[150px] py-4 font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  
                  Type
                </div>
              </TableHead>
              
              <TableHead className="min-w-[150px] py-4 font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  
                  Period
                </div>
              </TableHead>
              <TableHead className="min-w-[150px] py-4 font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                   
                  Amount
                </div>
              </TableHead>
              <TableHead className="min-w-[150px] py-4 font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  
                  Date
                </div>
              </TableHead>
              <TableHead className="min-w-[150px] py-4 font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                   
                  Status
                </div>
              </TableHead>
              
              <TableHead className="w-16 py-4 font-semibold text-gray-600 text-right">
              <div className="flex items-center gap-2">
                   
                   Action
                 </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {payrolls?.map((payroll, i) => (
              <TableRow
                className="group transition-colors hover:bg-gray-50"
                key={payroll.id}
                 
              >
                <TableCell className="text-center font-medium text-gray-700">
                  {i + 1}
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {payroll.id}
                </TableCell>
                <TableCell className="text-gray-700">
                  {payroll.payrollType}
                </TableCell>
              
                <TableCell className="text-gray-700">
                  { new Date(payroll.updatedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short'
                  })}
                </TableCell>
                <TableCell className="text-gray-700">
                   {formatCurrency(payroll.totalNetAmount || 0, "RWF")}
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {payroll.updatedAt.toLocaleString('en-US', {
                    weekday: 'short', 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell className="text-gray-700">
                  {payroll.status}
                </TableCell>
                
                <TableCell className="text-gray-700">
            
                    <PopoverWrapper
                      trigger={
                        <EllipsisVertical className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                      }
                      content={
                        <div className="flex flex-col space-y-1">
                          <button className="
                            w-full px-4 py-2 text-center text-sm text-gray-700 
                            hover:bg-gray-100 hover:text-gray-900
                            transition-colors duration-150
                            rounded-[4px]
                          ">
                            View
                            
                          </button>
                         
                        </div>
                      }
                    />
                 
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="border-t bg-gray-50 px-4 py-3">
        <Pagination 
          totalPages={pagination?.totalPages ?? 0}
       
        />
      </div>
    </div>
  );
}

// Loading state component
export function EmployeesTableSkeleton() {
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="space-y-4 p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
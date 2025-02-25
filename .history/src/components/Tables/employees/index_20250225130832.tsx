import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getServerSession } from "next-auth";
import { getEmployees } from "@/data/getEmployees";
import { authOptions } from "@/utils/auth";
import Pagination from "@/components/Pagination";
import { EmployeeTableRow } from "./tableRow";
import { Skeleton } from "@/components/ui/skeleton";
import { User2, Building2, Briefcase, Calendar, Bank } from "lucide-react";

export default async function EmployeesTable({ query, currentPage }: { query: string, currentPage: number }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Unauthorized access. Please sign in to view employee data.</p>
      </div>
    );
  }

  const { employees, pagination } = await getEmployees(session.user.email, query, currentPage);

  if (!employees?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="mb-2">No employees found</p>
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
                  <User2 className="h-4 w-4" />
                  First Name
                </div>
              </TableHead>
              <TableHead className="min-w-[150px] py-4 font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  <User2 className="h-4 w-4" />
                  Last Name
                </div>
              </TableHead>
              <TableHead className="min-w-[150px] py-4 font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Start Date
                </div>
              </TableHead>
              <TableHead className="min-w-[150px] py-4 font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Job Title
                </div>
              </TableHead>
              <TableHead className="min-w-[150px] py-4 font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Department
                </div>
              </TableHead>
              <TableHead className="min-w-[150px] py-4 font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  <Bank className="h-4 w-4" />
                  Bank Name
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {employees?.map((employee, i) => (
              <EmployeeTableRow
                className="group transition-colors hover:bg-gray-50"
                key={employee.id}
                employeeId={employee.id}
              >
                <TableCell className="text-center font-medium text-gray-700">
                  {i + 1}
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {employee.firstName}
                </TableCell>
                <TableCell className="text-gray-700">
                  {employee.secondName}
                </TableCell>
                <TableCell className="text-gray-700">
                  {new Date(employee.startDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {employee.jobTitle}
                </TableCell>
                <TableCell className="text-gray-700">
                  {employee.department}
                </TableCell>
                <TableCell className="text-gray-700">
                  {employee.bankName}
                </TableCell>
              </EmployeeTableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="border-t bg-gray-50 px-4 py-3">
        <Pagination 
          totalPages={pagination?.totalPages ?? 0}
          className="justify-center" 
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
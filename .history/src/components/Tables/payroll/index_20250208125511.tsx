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
import { Plus, Trash2, Info } from "lucide-react";

export default async function Page({ payrollType, query, currentPage }: { query: string; currentPage: number; payrollType: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div>Unauthorized</div>;
  }
  const { employees, pagination } = await getEmployees(session.user.email, query, currentPage);

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border-collapse border border-gray-200">
        <TableHeader>
          <TableRow className="uppercase bg-gray-100 dark:bg-gray-800">
            {/* Employee Details Section */}
            <TableHead className="border border-gray-300 text-center w-1/6">ID</TableHead>
            <TableHead className="border border-gray-300 text-center w-1/6">Name</TableHead>

            {/* Earnings Section */}
            <TableHead colSpan={3} className="border border-gray-300 text-center bg-blue-100">
              <div className="flex items-center justify-center">Earnings <Plus className="ml-2 cursor-pointer text-blue-500" size={16} /></div>
            </TableHead>

            {/* Additions Section */}
            <TableHead className="border border-gray-300 text-center bg-green-100">
              <div className="flex items-center justify-center">Additions <Plus className="ml-2 cursor-pointer text-green-500" size={16} /></div>
            </TableHead>

            {/* Deductions Section */}
            <TableHead className="border border-gray-300 text-center bg-red-100">
              <div className="flex items-center justify-center">Deductions <Plus className="ml-2 cursor-pointer text-red-500" size={16} /></div>
            </TableHead>
          </TableRow>

          {/* Sub-Headers */}
          <TableRow className="uppercase bg-gray-200">
            <TableHead className="border border-gray-300 text-center w-1/6"></TableHead>
            <TableHead className="border border-gray-300 text-center w-1/6"></TableHead>

            {/* Earnings Sub-Headers */}
            <TableHead className="border border-gray-300 text-center bg-blue-50">Basic Salary</TableHead>
            <TableHead className="border border-gray-300 text-center bg-blue-50">Health Insurance</TableHead>
            <TableHead className="border border-gray-300 text-center bg-blue-50">Total Salary</TableHead>

            {/* Additions & Deductions Sub-Headers */}
            <TableHead className="border border-gray-300 text-center bg-green-50">Total Additions</TableHead>
            <TableHead className="border border-gray-300 text-center bg-red-50">Total Deductions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {employees?.map((employee, i) => (
            <TableRow key={employee.id} className="text-center text-base font-medium">
              {/* Employee Details */}
              <TableCell className="border border-gray-300">{employee.id}</TableCell>
              <TableCell className="border border-gray-300 flex items-center justify-center">
                <span className="font-semibold">{employee.firstName} {employee.secondName}</span>
                <Info className="ml-2 cursor-pointer text-gray-500" size={16} />
              </TableCell>

              {/* Earnings */}
              <TableCell className="border border-gray-300 bg-blue-50">{employee.basicSalary || "0.00"}</TableCell>
              <TableCell className="border border-gray-300 bg-blue-50">{employee.healthInsurance || "0.00"}</TableCell>
              <TableCell className="border border-gray-300 bg-blue-50">{employee.totalSalary || "0.00"}</TableCell>

              {/* Additions & Deductions */}
              <TableCell className="border border-gray-300 bg-green-50">{employee.totalAdditions || "0.00"}</TableCell>
              <TableCell className="border border-gray-300 bg-red-50 flex justify-between">
                {employee.totalDeductions || "0.00"}
                <button className="ml-2 p-1 rounded bg-gray-100 hover:bg-gray-200 text-red-500">
                  <Trash2 size={16} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={pagination?.totalPages ? pagination.totalPages : 0} />
      </div>
    </div>
  );
}

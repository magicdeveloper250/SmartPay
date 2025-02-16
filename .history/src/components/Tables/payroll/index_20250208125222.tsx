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

export default async function Page({ payrollType, query, currentPage }: { query: string; currentPage: number; payrollType: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div>Unauthorized</div>;
  }
  const { employees, pagination } = await getEmployees(session.user.email, query, currentPage);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="text-center font-extrabold">#</TableHead>
            <TableHead className="text-center font-extrabold">First Name</TableHead>
            <TableHead className="text-center font-extrabold">Last Name</TableHead>
            <TableHead className="text-center font-extrabold">Job Title</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {employees?.map((employee, i) => (
            <>
              {/* Main Row */}
              <TableRow
                key={employee.firstName + i}
                className="text-center text-base font-medium text-dark dark:text-white"
              >
                <TableCell>{i + 1}</TableCell>
                <TableCell>{employee.firstName}</TableCell>
                <TableCell>{employee.secondName}</TableCell>
                <TableCell>{employee.jobTitle}</TableCell>
              </TableRow>

              {/* Sub-Table for Earnings, Additions, and Deductions */}
              <TableRow>
                <TableCell colSpan={4}>
                  <Table className="w-full border">
                    <TableHeader>
                      <TableRow className="border-none uppercase [&>th]:text-center bg-gray-200 dark:bg-gray-800">
                        <TableHead className="text-center font-extrabold">Earnings</TableHead>
                        <TableHead className="text-center font-extrabold">Additions</TableHead>
                        <TableHead className="text-center font-extrabold">Deductions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="text-center text-base">
                        <TableCell>{employee.earnings || "N/A"}</TableCell>
                        <TableCell>{employee.additions || "N/A"}</TableCell>
                        <TableCell>{employee.deductions || "N/A"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={pagination?.totalPages ? pagination.totalPages : 0} />
      </div>
    </>
  );
}

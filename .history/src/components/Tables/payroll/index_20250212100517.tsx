import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getServerSession } from "next-auth";
import { getPayrollEmployees } from "@/data/getEmployees";
import { authOptions } from "@/utils/auth";
import Pagination from "@/components/Pagination";
import { Plus, Trash2, Info } from "lucide-react";
import { getContractors } from "@/data/getContractors";

export default async function Page({ tab, query, currentPage }: { query: string; currentPage: number; tab: string }) {
    
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div>Unauthorized</div>;
  }
  const { employees, pagination } = await getPayrollEmployees(session.user.email, query, currentPage);
  const { contractors, pagination:contractorPage } = await getContractors(session.user.email, query, currentPage);


  return (
    <div className="overflow-x-auto mt-5">
      <Table className="min-w-full border-collapse border border-gray-200">
        <TableHeader>
          <TableRow className="uppercase bg-gray-100 dark:bg-gray-800">
          <TableHead colSpan={2} className="border border-gray-300 text-center">
              <div className="flex items-center justify-center">Employee Details</div>
            </TableHead>

            <TableHead colSpan={2} className="border border-gray-300 text-center bg-blue-100">
              <div className="flex items-center justify-center">Earnings <Plus className="ml-2 cursor-pointer text-blue-500" size={16} /></div>
            </TableHead>

            <TableHead className="border border-gray-300 text-center bg-green-100">
              <div className="flex items-center justify-center">Additions <Plus className="ml-2 cursor-pointer text-green-500" size={16} /></div>
            </TableHead>

            <TableHead className="border border-gray-300 text-center bg-red-100">
              <div className="flex items-center justify-center">Deductions <Plus className="ml-2 cursor-pointer text-red-500" size={16} /></div>
            </TableHead>
          </TableRow>

          <TableRow className="uppercase bg-gray-200">
            <TableHead className="border border-gray-300 text-center w-1/6">#</TableHead>
            <TableHead className="border border-gray-300 text-center w-1/6">Names</TableHead>

            <TableHead className="border border-gray-300 text-center bg-blue-50">Basic Salary</TableHead>
            <TableHead className="border border-gray-300 text-center bg-blue-50">Fringe Benefits</TableHead>

            <TableHead className="border border-gray-300 text-center bg-green-50">Additions</TableHead>
            <TableHead className="border border-gray-300 text-center bg-red-50">Deductions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tab=="employees" &&employees?.map((employee, i) => (
            <TableRow key={employee.id} className="text-center text-base font-medium">
              <TableCell className="border border-gray-300 w-fit">{i+1}</TableCell>
              <TableCell className="border border-gray-300 flex items-center justify-center">
                <span className="font-semibold">{employee.firstName} {employee.secondName}</span>
                <Info className="ml-2 cursor-pointer text-gray-500" size={16} />
              </TableCell>

              <TableCell className="border border-gray-300 bg-blue-50">{ new Intl.NumberFormat('en-US', { style: 'currency', currency: employee.currency }).format(employee.monthlyGross) || "0.00"}</TableCell>
             <ul>
             {
                employee?.benefits.map((benefit, index)=> <li className="border border-gray-300 bg-blue-50" key={index}>{benefit.benefit}</li>)
              }
             </ul>
              

              {
                employee.taxes.map((tax, index)=>{
                  return <TableCell className="border border-gray-300 bg-red-50 flex justify-between" key={index}>
                {tax.amount|| "0.00"}
                
              </TableCell>
                })
              }
            </TableRow>
          ))}

          {tab=="contractors" &&contractors?.map((contractor, i) => (
            <TableRow key={contractor.id} className="text-center text-base font-medium">
              <TableCell className="border border-gray-300 w-fit">{i+1}</TableCell>
              <TableCell className="border border-gray-300 flex items-center justify-center">
                <span className="font-semibold">{contractor.firstName} {contractor.secondName}</span>
                <Info className="ml-2 cursor-pointer text-gray-500" size={16} />
              </TableCell>

              <TableCell className="border border-gray-300 bg-blue-50">{ new Intl.NumberFormat('en-US', { style: 'currency', currency: contractor.currency }).format(contractor.contractsTerms[0]?.salary) || "0.00"}</TableCell>
              <TableCell className="border border-gray-300 bg-blue-50">{contractor.healthInsurance || "0.00"}</TableCell>
              <TableCell className="border border-gray-300 bg-blue-50">{contractor.totalSalary || "0.00"}</TableCell>

              <TableCell className="border border-gray-300 bg-green-50">{contractor.totalAdditions || "0.00"}</TableCell>
              <TableCell className="border border-gray-300 bg-red-50 flex justify-between">
                {contractor.totalDeductions || "0.00"}
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

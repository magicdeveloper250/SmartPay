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

            <TableHead className="border border-gray-300 text-center bg-red-100" colSpan={4}>
              <div className="flex items-center justify-center">Deductions <Plus className="ml-2 cursor-pointer text-red-500" size={16} /></div>
            </TableHead>

            <TableHead className="border border-gray-300 text-center bg-blue-100">
              <div className="flex items-center justify-center">Net Salary</div>
            </TableHead>
          </TableRow>

          <TableRow className="uppercase bg-gray-200">
            <TableHead className="border border-gray-300 text-center w-1/6">#</TableHead>
            <TableHead className="border border-gray-300 text-center w-1/6">Names</TableHead>

            <TableHead className="border border-gray-300 text-center bg-blue-50">Basic Salary</TableHead>
            <TableHead className="border border-gray-300 text-center bg-blue-50">Fringe Benefits</TableHead>

            <TableHead className="border border-gray-300 text-center bg-green-50">Additions</TableHead>
            <TableHead colSpan={3}  className="border border-gray-300 text-center bg-red-50">Taxes</TableHead>
            <TableHead className="border border-gray-300 text-center bg-red-50">Others</TableHead>
            <TableHead className="border border-gray-300 text-center bg-red-50">Others</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
        {tab == "employees" && employees?.length > 0 && (
  <>
    {employees.map((employee, i) => (
      <TableRow key={employee.id} className="text-center text-base font-medium">
        <TableCell className="border border-gray-300 w-fit">{i + 1}</TableCell>
        <TableCell className="border border-gray-300 flex items-center justify-center">
          <span className="font-semibold">{employee.firstName} {employee.secondName}</span>
          <Info className="ml-2 cursor-pointer text-gray-500" size={16} />
        </TableCell>
        <TableCell className="border border-gray-300 bg-blue-50">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: employee.currency }).format(employee.monthlyGross) || "0.00"}
        </TableCell>
        <TableCell className="border border-gray-300 bg-blue-50">
          <ul>
            {employee?.benefits.map((benefit, index) => <li key={index}>{benefit.benefit}</li>)}
          </ul>
        </TableCell>
        <TableCell className="border border-gray-300 text-center bg-green-50"></TableCell>
        <TableCell className="border border-gray-300 text-center bg-red-50 p-0">
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
            {employee.appliedTaxes.map((tax, index) => (
              <li key={index} className="grid grid-cols-1 text-sm">
                <span className="p-2 border-r border-gray-200 font-extrabold">
                  {tax.tax.name}
                </span>
                <span className="p-2 border-r border-gray-200 text-center text-gray-600 font-semibold">
                  {(tax.tax.rate * 100).toFixed(1)}%
                </span>
                <span className="p-2 text-right font-medium">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: employee.currency }).format(employee.monthlyGross * tax.tax.rate)}
                </span>
              </li>
            ))}
          </ul>
        </TableCell>

        <TableCell className="border border-gray-300 text-center bg-blue-50">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: employee.currency }).format(
            employee.monthlyGross   -
            (employee.appliedTaxes.reduce((sum, tax) => sum + (employee.monthlyGross * tax.tax.rate), 0))
          )}
        </TableCell>

       
      </TableRow>
    ))}

    {/* Total Row */}
    <TableRow className="text-center text-lg font-semibold bg-gray-100">
      <TableCell className="border border-gray-400 font-bold" colSpan={2}>Total</TableCell>
      <TableCell className="border border-gray-400 bg-blue-100">
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: employees[0].currency }).format(
          employees.reduce((sum, employee) => sum + employee.monthlyGross, 0)
        )}
      </TableCell>
      <TableCell className="border border-gray-400 bg-blue-100"></TableCell>
      <TableCell className="border border-gray-400 bg-green-100"></TableCell>
      <TableCell className="border border-gray-400 bg-red-100 p-0" colSpan={2}>
        <ul className="divide-y divide-gray-300 border border-gray-400 rounded-lg">
          {employees
            .flatMap((employee) => employee.appliedTaxes.map((tax) => ({
              name: tax.tax.name,
              rate: tax.tax.rate,
              amount: employee.monthlyGross * tax.tax.rate
            })))
            .reduce((acc, tax) => {
              const existing = acc.find((t) => t.name === tax.name);
              if (existing) {
                existing.amount += tax.amount;
              } else {
                acc.push({ name: tax.name, rate: tax.rate, amount: tax.amount });
              }
              return acc;
            }, [])
            .map((tax, index) => (
              <li key={index} className="grid grid-cols-1 text-sm">
                <span className="p-2 border-r border-gray-400 font-extrabold">
                  {tax.name}
                </span>
                <span className="p-2 border-r border-gray-400 text-center text-gray-700 font-semibold">
                  {(tax.rate * 100).toFixed(1)}%
                </span>
                <span className="p-2 text-right font-medium">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: employees[0].currency }).format(tax.amount)}
                </span>
              </li>
            ))}
        </ul>
      </TableCell>
    </TableRow>
  </>
)}


          
          

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

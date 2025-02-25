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
import { Plus, Trash2, Info, Minus } from "lucide-react";
import { getContractors } from "@/data/getContractors";
import Search from "@/components/Search";

export default async function Page({ tab, query, currentPage }: { query: string; currentPage: number; tab: string }) {
    
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div>Unauthorized</div>;
  }
  const { payroll, pagination } = await getPayrollEmployees(session.user.email, query, currentPage);
  const employeesLength = payroll?.processedEmployees?.length || 0;
  const { contractors, pagination:contractorPage } = await getContractors(session.user.email, query, currentPage);
  
  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800">
            {tab === "employees" ? "Employee Payroll" : "Contractor Payroll"}
          </h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {tab === "employees" ? employeesLength : contractors?.processedContractors.length} total
          </span>
        </div>
        <Search placeholder="Search payroll..."  />
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <a
            href="/dashboard/payroll/internal?tab=employees"
            className={`${
              tab === "employees"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            Employees
          </a>
          <a
            href="/dashboard/payroll/internal?tab=contractors"
            className={`${
              tab === "contractors"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            Contractors
          </a>
        </nav>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          {tab=="employees" && <> 
            <Table className="min-w-full divide-y divide-gray-200">
              <TableHeader>
                <TableRow className="uppercase bg-gray-100 dark:bg-gray-800">
                  <TableHead colSpan={2} className="border border-gray-300 text-center">
                    <div className="flex items-center justify-center">Details</div>
                  </TableHead>

                  <TableHead colSpan={2} className="border border-gray-300 text-center bg-blue-100">
                    <div className="flex items-center justify-center"> Total Earnings <Plus className="ml-2 cursor-pointer text-blue-500" size={16} /></div>
                  </TableHead>

                  <TableHead className="border border-gray-300 text-center bg-green-100">
                    <div className="flex items-center justify-center">Total Additions <Plus className="ml-2 cursor-pointer text-green-500" size={16} /></div>
                  </TableHead>

                  <TableHead className="border border-gray-300 text-center bg-red-100" colSpan={2}>
                    <div className="flex items-center justify-center w-full">Toal Deductions <Minus className="ml-2 cursor-pointer text-red-500" size={16} /></div>
                  </TableHead>

                  <TableHead className="border border-gray-300 text-center bg-blue-100" rowSpan={2}>
                    <div className="flex items-center justify-center" >Total Net Salaries</div>
                  </TableHead>
                </TableRow>

                <TableRow className="uppercase">
                  <TableHead className="  text-center w-1/6 border-b-0"></TableHead>
                  <TableHead className="  text-center w-1/6 border-b-0"></TableHead>

                  <TableHead className="border border-gray-300 text-center bg-blue-50">Basic Salary</TableHead>
                  <TableHead className="border border-gray-300 text-center bg-blue-50">Fringe Benefits</TableHead>

                  <TableHead className="border border-gray-300 text-center bg-green-50">Additions</TableHead>
                  <TableHead   className="border border-gray-300 text-center bg-red-50 ">Taxes</TableHead>
                  <TableHead className="border border-gray-300 text-center bg-red-50">Others</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow className="text-center text-lg font-bold bg-gray-100">
                  <TableCell className="font-bold bg-white border" colSpan={2} rowSpan={2}>Total</TableCell>
                  <TableCell className="border border-gray-400 bg-blue-100">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(
                      payroll?.totalMonthlyGross || 0
                    )}
                  </TableCell>
                  <TableCell className="border border-gray-400 bg-blue-100"></TableCell>
                  <TableCell className="border border-gray-400 bg-green-100">
                    <ul className="divide-y divide-gray-300 rounded-lg">
                      { payroll?.totalAdditionalIncomes.map((income, index) => (
                          <li key={index} className="grid grid-cols-1 text-sm">
                            <span className="p-2 font-extrabold">
                              {income.type}
                            </span>
                            
                            <span className="p-2 text-right font-medium">
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll.currency}).format(income.amount)}
                            </span>
                          </li>
                        ))}
                        <li className="font-bold">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency}).format(
                            payroll?.totalAdditonalIncomesAmount ||0
                          )}
                        </li>
                    </ul>
                  </TableCell>
                  <TableCell className="border border-gray-400 bg-red-100 p-0">
                    <ul className="divide-y divide-gray-300 rounded-lg">
                      { payroll?.totalTaxes.map((tax, index) => (
                          <li key={index} className="grid grid-cols-1 text-sm">
                            <span className="p-2  font-extrabold">
                              {tax.name}
                            </span>
                            
                            <span className="p-2 text-right font-medium">
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll.currency }).format(tax.amount)}
                            </span>
                          </li>
                        ))}
                          <li className="font-bold">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency}).format(
                              payroll?.totalTaxesAmount ||0
                            )}
                          </li>
                    </ul>
                  </TableCell>
                  <TableCell className="border border-gray-400 bg-red-100 p-0">
                    <ul className="divide-y divide-gray-300 rounded-lg">
                      { payroll?.totalDeductions.map((deduction, index) => (
                          <li key={index} className="grid grid-cols-1 text-sm">
                            <span className="p-2 border-r border-gray-400 font-extrabold">
                              {deduction.reason}
                            </span>
                            
                            <span className="p-2 text-right font-medium">
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll.currency }).format(deduction.amount)}
                            </span>
                          </li>
                        ))}
                          <li className="border  font-bold">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency}).format(
                              payroll?.totalDeductionsAmount ||0
                            )}
                          </li>
                    </ul>
                  </TableCell>
                  <TableCell className="border border-gray-400 font-bold">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency}).format(
                      payroll?.totalNetSalary ||0
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Table className="min-w-full divide-y divide-gray-200">
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

                  <TableHead className="border border-gray-300 text-center bg-red-100" colSpan={2}>
                    <div className="flex items-center justify-center w-full">Deductions <Minus className="ml-2 cursor-pointer text-red-500" size={16} /></div>
                  </TableHead>

                  <TableHead className="border border-gray-300 text-center bg-blue-100" rowSpan={2}>
                    <div className="flex items-center justify-center" >Net Salary</div>
                  </TableHead>
                </TableRow>

                <TableRow className="uppercase bg-gray-200">
                  <TableHead className="border border-gray-300 text-center w-1/6">#</TableHead>
                  <TableHead className="border border-gray-300 text-center w-1/6">Names</TableHead>

                  <TableHead className="border border-gray-300 text-center bg-blue-50">Basic Salary</TableHead>
                  <TableHead className="border border-gray-300 text-center bg-blue-50">Fringe Benefits</TableHead>

                  <TableHead className="border border-gray-300 text-center bg-green-50">Additions</TableHead>
                  <TableHead   className="border border-gray-300 text-center bg-red-50 ">Taxes</TableHead>
                  <TableHead className="border border-gray-300 text-center bg-red-50">Others</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {payroll?.processedEmployees.map((employee, index) => (
                  <TableRow 
                    key={employee.id}
                    className="hover:bg-gray-50 cursor-pointer even:bg-gray-50/50"
                  >
                    <TableCell className="w-fit border border-gray-300">{index + 1}</TableCell>
                    <TableCell className="w-fit border border-gray-300">
                      {employee.firstName} {employee.secondName}
                    </TableCell>
                    <TableCell className="border border-gray-300 bg-blue-50">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(employee.monthlyGross) || "0.00"}
                    </TableCell>
                    <TableCell className="border border-gray-300 bg-blue-50">
                      <ul>
                        {employee?.benefits.map((benefit, index) => <li key={index}>{benefit.benefit}</li>)}
                      </ul>
                    </TableCell>
                    <TableCell className="border border-gray-300 text-center bg-green-50">
                      <ul className="divide-y divide-gray-200 rounded-lg">
                        {employee.additionalIncomes.map((income, index) => (
                          <li key={index} className="grid grid-cols-1 text-sm">
                            <span className="p-2 font-extrabold">
                              {income.type}
                            </span>
                            <span className="p-2 text-right font-medium">
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(income.amount)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className="border border-gray-300 text-center bg-red-50 p-0" >
                      <ul className="divide-y divide-gray-200 rounded-lg">
                        {employee.appliedTaxes.map((tax, index) => (
                          <li key={index} className="grid grid-cols-1 text-sm">
                            <span className="p-2 border-r  font-extrabold">
                              {tax.tax.name}
                            </span>
                            <span className="p-2 text-center text-gray-600 font-bold">
                              {(tax.tax.rate * 100).toFixed(1)}%
                            </span>
                            <span className="p-2 text-right font-medium">
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(employee.monthlyGross * tax.tax.rate)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </TableCell>

                    <TableCell className="border border-gray-300 text-center bg-red-50 p-0" >
                      <ul className="divide-y divide-gray-200  rounded-lg">
                        {employee.deductions.map((deduction, index) => (
                          <li key={index} className="grid grid-cols-1 text-sm">
                            <span className="p-2 border-r  font-extrabold">
                              {deduction.reason}
                            </span>
                            <span className="p-2 text-right font-medium">
                              {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(deduction.amount)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    
                    <TableCell className="border border-gray-300 text-center bg-blue-50">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(
                        employee.netSalary
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>}

          {tab=="contractors" && <> 
            <Table className="min-w-full divide-y divide-gray-200">
              <TableHeader>
                <TableRow className="uppercase bg-gray-100 dark:bg-gray-800">
                  <TableHead colSpan={2} className="border border-gray-300 text-center">
                    <div className="flex items-center justify-center">Details</div>
                  </TableHead>

                  <TableHead colSpan={2} className="border border-gray-300 text-center bg-blue-100">
                    <div className="flex items-center justify-center"> Total Earnings <Plus className="ml-2 cursor-pointer text-blue-500" size={16} /></div>
                  </TableHead>

                  <TableHead className="border border-gray-300 text-center bg-green-100">
                    <div className="flex items-center justify-center">Total Additions <Plus className="ml-2 cursor-pointer text-green-500" size={16} /></div>
                  </TableHead>

                  <TableHead className="border border-gray-300 text-center bg-red-100" colSpan={2}>
                    <div className="flex items-center justify-center w-full">Toal Deductions <Minus className="ml-2 cursor-pointer text-red-500" size={16} /></div>
                  </TableHead>

                  <TableHead className="border border-gray-300 text-center bg-blue-100" rowSpan={2}>
                    <div className="flex items-center justify-center" >Total Net Salaries</div>
                  </TableHead>
                </TableRow>

                <TableRow className="uppercase">
                  <TableHead className="  text-center w-1/6 border-b-0"></TableHead>
                  <TableHead className="  text-center w-1/6 border-b-0"></TableHead>

                  <TableHead className="border border-gray-300 text-center bg-blue-50">Basic Salary</TableHead>
                  <TableHead className="border border-gray-300 text-center bg-blue-50">Fringe Benefits</TableHead>

                  <TableHead className="border border-gray-300 text-center bg-green-50">Additions</TableHead>
                  <TableHead   className="border border-gray-300 text-center bg-red-50 ">Taxes</TableHead>
                  <TableHead className="border border-gray-300 text-center bg-red-50">Others</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow className="text-center text-lg font-bold bg-gray-100">
                  <TableCell className="font-bold bg-white border" colSpan={2} rowSpan={2}>Total</TableCell>
                  <TableCell className="border border-gray-400 bg-blue-100">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(
                      contractors?.TotalOverallSalaries || 0
                    )}
                  </TableCell>
                  <TableCell className="border border-gray-400 bg-blue-100"></TableCell>
                  <TableCell className="border border-gray-400 bg-green-100">
                    {/* Empty cell since contractors don't have additions */}
                  </TableCell>
                  <TableCell className="border border-gray-400 bg-red-100" colSpan={2}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(
                      contractors?.totalTaxes || 0
                    )}
                  </TableCell>
                  <TableCell className="border border-gray-400 font-bold">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(
                      contractors?.totalNetSalary || 0
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Table className="min-w-full divide-y divide-gray-200">
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

                  <TableHead className="border border-gray-300 text-center bg-red-100" colSpan={2}>
                    <div className="flex items-center justify-center w-full">Deductions <Minus className="ml-2 cursor-pointer text-red-500" size={16} /></div>
                  </TableHead>

                  <TableHead className="border border-gray-300 text-center bg-blue-100" rowSpan={2}>
                    <div className="flex items-center justify-center" >Net Salary</div>
                  </TableHead>
                </TableRow>

                <TableRow className="uppercase bg-gray-200">
                  <TableHead className="border border-gray-300 text-center w-1/6">#</TableHead>
                  <TableHead className="border border-gray-300 text-center w-1/6">Names</TableHead>

                  <TableHead className="border border-gray-300 text-center bg-blue-50">Basic Salary</TableHead>
                  <TableHead className="border border-gray-300 text-center bg-blue-50">Fringe Benefits</TableHead>

                  <TableHead className="border border-gray-300 text-center bg-green-50">Additions</TableHead>
                  <TableHead   className="border border-gray-300 text-center bg-red-50 ">Taxes</TableHead>
                  <TableHead className="border border-gray-300 text-center bg-red-50">Others</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {contractors?.processedContractors.map((contractor, index) => (
                  <TableRow 
                    key={contractor.contractor.id}
                    className="hover:bg-gray-50 cursor-pointer even:bg-gray-50/50"
                  >
                    <TableCell className="w-fit border border-gray-300">{index + 1}</TableCell>
                    <TableCell className="w-fit border border-gray-300">
                      {contractor.contractor.firstName} {contractor.contractor.secondName}
                    </TableCell>
                    <TableCell className="border border-gray-300 bg-blue-50">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(contractor.TotalContractsSalaries) || "0.00"}
                    </TableCell>
                    <TableCell className="border border-gray-300 bg-blue-50">
                      <ul>
                        {contractor?.contractor.contracts.map((contract, index) => <li key={index}>{contract.notes}</li>)}
                      </ul>
                    </TableCell>
                    <TableCell className="border border-gray-300 text-center bg-green-50">
                      <ul className="divide-y divide-gray-200 rounded-lg">
                       
                      </ul>
                    </TableCell>
                    <TableCell className="border border-gray-300 text-center bg-red-50 p-0" >
                      <ul className="divide-y divide-gray-200 rounded-lg">
                      </ul>
                    </TableCell>

                    <TableCell className="border border-gray-300 text-center bg-red-50 p-0" >
                      {contractor?.contractor.contracts.map((taxesContractor, index) => {
                        return <ul className="divide-y divide-gray-200  rounded-lg" key={index}>
                          {  taxesContractor.taxes.map((tax, index) => (
                            <li key={index} className="grid grid-cols-1 text-sm">
                              <span className="p-2 border-r  font-extrabold">
                                {tax.name}
                              </span>
                              <span className="p-2 text-center text-gray-600 font-bold">
                                {(tax.rate * 100).toFixed(1)}%
                              </span>
                              <span className="p-2 text-right font-medium">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(tax.amount)}
                              </span>
                            </li>
                          ))
                          
                        }
                      </ul>
                    })}
                    </TableCell>
                    
                    <TableCell className="border border-gray-300 text-center bg-blue-50">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(
                        contractor.TotalContractsSalaries
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>}
        </div>
        
        {/* Pagination */}
        <div className="py-4 px-6 border-t border-gray-200">
          <Pagination 
            totalPages={pagination?.totalPages ? pagination.totalPages : 0} 
          />
        </div>
      </div>
    </div>
  );
}
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
     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600/80 font-medium">Total Gross</p>
              <p className="text-2xl font-bold text-blue-900 mt-2">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(
                  tab === "employees" ? payroll?.totalMonthlyGross || 0 : contractors?.TotalOverallSalaries || 0
                )}
              </p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-6 shadow-sm border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600/80 font-medium">Total Deductions</p>
              <p className="text-2xl font-bold text-red-900 mt-2">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(
                  tab === "employees" ? payroll?.totalDeductionsAmount || 0 : contractors?.totalTaxes || 0
                )}
              </p>
            </div>
            <div className="bg-red-500/10 p-3 rounded-xl">
              <Minus className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 shadow-sm border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600/80 font-medium">Net Amount</p>
              <p className="text-2xl font-bold text-green-900 mt-2">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(
                  tab === "employees" ? payroll?.totalNetSalary || 0 : contractors?.totalNetSalary || 0
                )}
              </p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-xl">
              <Info className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          {tab=="employees" && <> 
            <Table className="min-w-full border-collapse">
              <TableHeader>
                <TableRow>
                  <TableHead 
                    colSpan={2} 
                    className="border border-gray-200 bg-gray-50 px-6 py-4 text-center font-semibold text-gray-900"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      Details
                    </div>
                  </TableHead>

                  <TableHead 
                    colSpan={2} 
                    className="border border-gray-200 bg-blue-50 px-6 py-4 text-center font-semibold text-blue-900"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      Total Earnings 
                      <Plus className="ml-2 cursor-pointer text-blue-500 hover:text-blue-600" size={16} />
                    </div>
                  </TableHead>

                  <TableHead 
                    className="border border-gray-200 bg-green-50 px-6 py-4 text-center font-semibold text-green-900"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      Total Additions 
                      <Plus className="ml-2 cursor-pointer text-green-500 hover:text-green-600" size={16} />
                    </div>
                  </TableHead>

                  <TableHead 
                    colSpan={2}
                    className="border border-gray-200 bg-red-50 px-6 py-4 text-center font-semibold text-red-900"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      Total Deductions 
                      <Minus className="ml-2 cursor-pointer text-red-500 hover:text-red-600" size={16} />
                    </div>
                  </TableHead>

                  <TableHead 
                    className="border border-gray-200 bg-blue-50 px-6 py-4 text-center font-semibold text-blue-900"
                  >
                    <div className="flex items-center justify-center">
                      Net Salary
                    </div>
                  </TableHead>
                </TableRow>

                <TableRow>
                  <TableHead className="border border-gray-200 bg-gray-50/80 px-4 py-3 text-center text-sm font-medium text-gray-900">#</TableHead>
                  <TableHead className="border border-gray-200 bg-gray-50/80 px-4 py-3 text-center text-sm font-medium text-gray-900">Name</TableHead>
                  <TableHead className="border border-gray-200 bg-blue-50/80 px-4 py-3 text-center text-sm font-medium text-blue-900">Basic</TableHead>
                  <TableHead className="border border-gray-200 bg-blue-50/80 px-4 py-3 text-center text-sm font-medium text-blue-900">Benefits</TableHead>
                  <TableHead className="border border-gray-200 bg-green-50/80 px-4 py-3 text-center text-sm font-medium text-green-900">Additions</TableHead>
                  <TableHead className="border border-gray-200 bg-red-50/80 px-4 py-3 text-center text-sm font-medium text-red-900">Taxes</TableHead>
                  <TableHead className="border border-gray-200 bg-red-50/80 px-4 py-3 text-center text-sm font-medium text-red-900">Others</TableHead>
                  <TableHead className="border border-gray-200 bg-blue-50/80 px-4 py-3 text-center text-sm font-medium text-blue-900">Total</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow className="bg-gray-50/30">
                  <TableCell colSpan={2} className="border border-gray-200 px-6 py-4 text-center font-bold text-gray-900">
                    Total
                  </TableCell>
                  <TableCell className="border border-gray-200 px-6 py-4 text-center text-lg font-bold text-blue-900">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(payroll?.totalMonthlyGross || 0)}
                  </TableCell>
                  <TableCell className="border border-gray-200 px-6 py-4 text-center">
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
                  <TableCell className="border border-gray-200 px-6 py-4 text-center">
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
                  <TableCell className="border border-gray-200 px-6 py-4 text-center">
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
               
                  <TableCell className="border border-gray-200 px-6 py-4 text-center text-lg font-bold text-blue-900">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency}).format(payroll?.totalNetSalary || 0)}
                  </TableCell>
                </TableRow>

                {payroll?.processedEmployees.map((employee, index) => (
                  <TableRow 
                    key={employee.id}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    <TableCell className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-600">
                      {index + 1}
                    </TableCell>
                    <TableCell className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                      {employee.firstName} {employee.secondName}
                    </TableCell>
                    <TableCell className="border border-gray-200 px-6 py-4 text-sm text-gray-600">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(employee.monthlyGross) || "0.00"}
                    </TableCell>
                    <TableCell className="border border-gray-200 px-6 py-4 text-sm text-gray-600">
                      <ul>
                        {employee?.benefits.map((benefit, index) => <li key={index}>{benefit.benefit}</li>)}
                      </ul>
                    </TableCell>
                    <TableCell className="border border-gray-200 px-6 py-4 text-sm text-gray-600">
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
                    <TableCell className="border border-gray-200 px-6 py-4 text-sm text-gray-600">
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

                    <TableCell className="border border-gray-200 px-6 py-4 text-sm text-gray-600">
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
                    
                    <TableCell className="border border-gray-200 px-6 py-4 text-sm text-gray-600">
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
            <Table className="min-w-full border-collapse">
              <TableHeader>
                <TableRow>
                  <TableHead 
                    colSpan={2} 
                    className="border border-gray-200 bg-gray-50 px-6 py-4 text-center font-semibold text-gray-900"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      Details
                    </div>
                  </TableHead>

                  <TableHead 
                    colSpan={2} 
                    className="border border-gray-200 bg-blue-50 px-6 py-4 text-center font-semibold text-blue-900"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      Total Earnings 
                      <Plus className="ml-2 cursor-pointer text-blue-500 hover:text-blue-600" size={16} />
                    </div>
                  </TableHead>

                  <TableHead 
                    className="border border-gray-200 bg-green-50 px-6 py-4 text-center font-semibold text-green-900"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      Total Additions 
                      <Plus className="ml-2 cursor-pointer text-green-500 hover:text-green-600" size={16} />
                    </div>
                  </TableHead>

                  <TableHead 
                    colSpan={2}
                    className="border border-gray-200 bg-red-50 px-6 py-4 text-center font-semibold text-red-900"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      Total Deductions 
                      <Minus className="ml-2 cursor-pointer text-red-500 hover:text-red-600" size={16} />
                    </div>
                  </TableHead>

                  <TableHead 
                    rowSpan={2}
                    className="border border-gray-200 bg-blue-50 px-6 py-4 text-center font-semibold text-blue-900"
                  >
                    <div className="flex items-center justify-center">
                      Net Salary
                    </div>
                  </TableHead>
                </TableRow>

                <TableRow>
                  <TableHead className="border border-gray-200 bg-gray-50/80 px-4 py-3 text-center text-sm font-medium text-gray-900">#</TableHead>
                  <TableHead className="border border-gray-200 bg-gray-50/80 px-4 py-3 text-center text-sm font-medium text-gray-900">Name</TableHead>
                  <TableHead className="border border-gray-200 bg-blue-50/80 px-4 py-3 text-center text-sm font-medium text-blue-900">Basic Salary</TableHead>
                  <TableHead className="border border-gray-200 bg-blue-50/80 px-4 py-3 text-center text-sm font-medium text-blue-900">Benefits</TableHead>
                  <TableHead className="border border-gray-200 bg-green-50/80 px-4 py-3 text-center text-sm font-medium text-green-900">Additions</TableHead>
                  <TableHead className="border border-gray-200 bg-red-50/80 px-4 py-3 text-center text-sm font-medium text-red-900">Taxes</TableHead>
                  <TableHead className="border border-gray-200 bg-red-50/80 px-4 py-3 text-center text-sm font-medium text-red-900">Others</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Totals Row */}
                <TableRow className="bg-gray-50/30">
                  <TableCell 
                    colSpan={2} 
                    className="border border-gray-200 px-6 py-4 text-center font-bold text-gray-900"
                  >
                    Total
                  </TableCell>
                  <TableCell className="border border-gray-200 px-6 py-4 text-lg font-bold text-blue-900">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(
                      contractors?.TotalOverallSalaries || 0
                    )}
                  </TableCell>
                  <TableCell className="border border-gray-200 px-6 py-4"></TableCell>
                  <TableCell className="border border-gray-200 px-6 py-4"></TableCell>
                  <TableCell 
                    colSpan={2}
                    className="border border-gray-200 px-6 py-4 text-lg font-bold text-red-900"
                  >
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(
                      contractors?.totalTaxes || 0
                    )}
                  </TableCell>
                  <TableCell className="border border-gray-200 px-6 py-4 text-lg font-bold text-blue-900">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(
                      contractors?.totalNetSalary || 0
                    )}
                  </TableCell>
                </TableRow>

                {/* Contractor Rows */}
                {contractors?.processedContractors.map((contractor, index) => (
                  <TableRow 
                    key={contractor.contractor.id}
                    className="transition-colors hover:bg-gray-50/50"
                  >
                    <TableCell className="border border-gray-200 px-4 py-3 text-center text-sm text-gray-600">
                      {index + 1}
                    </TableCell>
                    <TableCell className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                      {contractor.contractor.firstName} {contractor.contractor.secondName}
                    </TableCell>
                    <TableCell className="border border-gray-200 px-6 py-4 text-sm text-gray-600">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(contractor.TotalContractsSalaries)}
                    </TableCell>
                    <TableCell className="border border-gray-200 px-6 py-4 text-sm text-gray-600">
                      <ul className="space-y-1">
                        {contractor?.contractor.contracts.map((contract, index) => (
                          <li key={index}>{contract.notes}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className="border border-gray-200 px-6 py-4"></TableCell>
                    <TableCell 
                      colSpan={2}
                      className="border border-gray-200 px-6 py-4 text-sm text-gray-600"
                    >
                      {contractor?.contractor.contracts.map((taxesContractor, index) => (
                        <ul key={index} className="divide-y divide-gray-200 rounded-lg">
                          {taxesContractor.taxes.map((tax, index) => (
                            <li key={index} className="grid grid-cols-3 gap-2 py-2">
                              <span className="font-semibold text-gray-900">{tax.name}</span>
                              <span className="text-center text-gray-600">{(tax.rate * 100).toFixed(1)}%</span>
                              <span className="text-right">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(tax.amount)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </TableCell>
                    <TableCell className="border border-gray-200 px-6 py-4 text-sm font-medium text-gray-900 text-right">
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
        <div className="py-4 px-6 border-t border-gray-100 flex justify-center">
          <Pagination totalPages={pagination?.totalPages ? pagination.totalPages : 0} />
        </div>
      </div>
    </div>
  );
}
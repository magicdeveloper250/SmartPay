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
     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Gross</p>
              <p className="text-2xl font-semibold mt-1">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(
                  tab === "employees" ? payroll?.totalMonthlyGross || 0 : contractors?.TotalOverallSalaries || 0
                )}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Plus className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Deductions</p>
              <p className="text-2xl font-semibold mt-1">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(
                  tab === "employees" ? payroll?.totalDeductionsAmount || 0 : contractors?.totalTaxes || 0
                )}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <Minus className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Amount</p>
              <p className="text-2xl font-semibold mt-1">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: payroll?.currency }).format(
                  tab === "employees" ? payroll?.totalNetSalary || 0 : contractors?.totalNetSalary || 0
                )}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Info className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
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

        {/* Pagination with updated styling */}
        <div className="py-4 px-6 border-t border-gray-100">
          <Pagination totalPages={pagination?.totalPages ? pagination.totalPages : 0} />
        </div>
      </div>
    </div>
  );
}
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {  standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
 
import { getTopEmployees } from "@/actions/dashboardActions";
import toast from "react-hot-toast";

export async function TopEmployees({ className }: { className?: string }) {
  const data = await getTopEmployees();
  
  if("error" in data)
    toast.error(data.error)
  const employees = "employees" in data ? data.employees : []
  const currency = "settings" in data ? data.settings?.defaultCurrency : "USD"

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        Top Employees
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[120px] !text-left">Source</TableHead>
            <TableHead>Departement</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead className="!text-right">Salary</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.isArray(employees) && employees.map((employee, i) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={employee.id + i}
            >
              <TableCell className="flex min-w-fit items-center gap-3">
                 
                <div className="">{employee.firstName} {employee.secondName}</div>
              </TableCell>

              <TableCell>{employee.department}</TableCell>

          
               
          

              <TableCell>{employee.jobTitle}</TableCell>
              <TableCell>{employee.startDate.toLocaleDateString()}</TableCell>

              <TableCell className="!text-right text-green-light-1"> {currency}{standardFormat(employee.monthlyGross)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

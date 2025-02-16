import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {  standardFormat } from "@/lib/format-number";

 
import { getServerSession } from "next-auth";
import { getEmployees } from "@/data/getEmployees";
import { authOptions } from "@/utils/auth";
 

export default async function Page( {query, currentPage}:{query:string, currentPage:number}) {
 
  const session = await getServerSession(authOptions);
  
   

  if (!session?.user?.email) {
    return <div>Unauthorized</div>;
  }
  const { employees } = await getEmployees(session.user.email, query, currentPage);

  return (
    
      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[120px] !text-left">First Name</TableHead>
            <TableHead>Second Name</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="!text-right">Salary</TableHead>
            <TableHead>Bank</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {employees?.map((employee, i) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={employee.firstName + i}
            >
              <TableCell className="flex min-w-fit items-center gap-3">
                <div className="">{employee.firstName}</div>
              </TableCell>

              <TableCell>{employee.secondName}</TableCell>

              <TableCell className="!text-right text-green-light-1">
                {employee.jobTitle}
              </TableCell>

              <TableCell>{employee.department}</TableCell>

              <TableCell> ${standardFormat(Number(employee.monthlyGross))}</TableCell>
              <TableCell> ${employee.bankName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    
  );
}
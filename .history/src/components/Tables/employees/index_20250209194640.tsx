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
import Link from "next/link";
 

export default async function Page( {query, currentPage}:{query:string, currentPage:number}) {
 
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

            <TableHead >No</TableHead>
            <TableHead className="min-w-[120px] !text-left">First Name</TableHead>
            <TableHead>Second Name</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Bank Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {employees?.map((employee, i) => (
            <Link href={`/employee/internal/${employee.id}`}  className="text-center text-base font-medium text-dark dark:text-white border-b transition-colors hover:bg-neutral-100/50 data-[state=selected]:bg-neutral-100 dark:border-dark-3 dark:hover:bg-dark-2 dark:data-[state=selected]:bg-neutral-800">
              <TableRow
               
                key={employee.firstName + i}
              >
                <TableCell >
                  <div className="">{i+1}</div>
                </TableCell>
                

                <TableCell>{employee.firstName}</TableCell>
                <TableCell>{employee.secondName}</TableCell>
                <TableCell>{new Date(employee.startDate).toLocaleString()}</TableCell>

                <TableCell >
                  {employee.jobTitle}
                </TableCell>

                <TableCell>{employee.department}</TableCell>

                <TableCell> ${employee.bankName}</TableCell>
                
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={pagination?.totalPages?pagination.totalPages:0} />
      </div>
      </>
    
  );
}
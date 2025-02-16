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
import { Contractor, Employee } from "@prisma/client";
 

export default async function Page( {records, query, currentPage}:{query:string, currentPage:number, records:Contractor[] | Employee[] }) {
 
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

            <TableHead className="text-center" >Employee Details</TableHead>
            <TableHead className="text-center">Earnings</TableHead>
            <TableHead className="text-center">Additions</TableHead>
            <TableHead className="text-center">Deductions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {records?.map((employee, i) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={employee.firstName + i}
            >
              <TableCell>
                  <TableCell >
                    <div className="">{i+1}</div>
                  </TableCell>
                  <TableCell>{employee.firstName}</TableCell>
                  <TableCell>{employee.secondName}</TableCell>
                  <TableCell >
                    {employee.jobTitle}
                  </TableCell>
              </TableCell>

              <TableCell>
                  <TableCell >
                    <div className="">{i+1}</div>
                  </TableCell>
                  <TableCell>{employee.firstName}</TableCell>
                  <TableCell>{employee.secondName}</TableCell>
                  <TableCell >
                    {employee.jobTitle}
                  </TableCell>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={pagination?.totalPages?pagination.totalPages:0} />
      </div>
      </>
    
  );
}
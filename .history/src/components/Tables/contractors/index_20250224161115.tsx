import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

 
import { getServerSession } from "next-auth";
import { getContractors } from "@/data/getContractors";
import { authOptions } from "@/utils/auth";
import Pagination from "@/components/Pagination";
import { ContractorTableRow } from "./tableRow";
 

export default async function Page( {query, currentPage}:{query:string, currentPage:number}) {
 
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div>Unauthorized</div>;
  }
  const { contractors, pagination } = await getContractors(session.user.email, query, currentPage);
 

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
          </TableRow>
        </TableHeader>

        <TableBody>
          {contractors?.map((contractor, i) => (
            <ContractorTableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={contractor.firstName + i}
              contractorId={contractor.id}
            >
              <TableCell >
                <div className="">{i+1}</div>
              </TableCell>
              

              <TableCell>{contractor.firstName}</TableCell>
              <TableCell>{contractor.secondName}</TableCell>
              <TableCell>{new Date(contractor.createdAt).toLocaleString()}</TableCell>

              <TableCell >
                {contractor.jobTitle}
              </TableCell>

              <TableCell>{contractor.department}</TableCell>

              <TableCell> ${contractor.bankName}</TableCell>
            </ContractorTableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={pagination?.totalPages?pagination.totalPages:0} />
      </div>
      </>
    
  );
}
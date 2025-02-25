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

export default async function Page({query, currentPage}: {query: string, currentPage: number}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div>Unauthorized</div>;
  }
  const { contractors, pagination } = await getContractors(session.user.email, query, currentPage);

  if (!contractors?.processedContractors) {
    return <div>No contractors found</div>;
  }

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
          {contractors.processedContractors.map((item, i) => (
            <ContractorTableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={item.contractor.firstName + i}
              contractorId={item.contractor.id}
            >
              <TableCell>
                <div className="">{i + 1}</div>
              </TableCell>

              <TableCell>{item.contractor.firstName}</TableCell>
              <TableCell>{item.contractor.secondName}</TableCell>
              <TableCell>{new Date(item.contractor.createdAt).toLocaleString()}</TableCell>
              <TableCell>{item.contractor.jobTitle}</TableCell>
              <TableCell>{item.contractor.department}</TableCell>
              <TableCell>${item.contractor.bankName}</TableCell>
            </ContractorTableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={pagination?.totalPages ?? 0} />
      </div>
    </>
  );
}
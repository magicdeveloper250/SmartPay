import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function EmployeesSkeleton() {
  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h2 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
      <Skeleton className="h-8" />
      </h2>

      <Table>
      <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[120px] !text-left"><Skeleton className="h-8" /></TableHead>
            <TableHead><Skeleton className="h-8" /></TableHead>
            <TableHead><Skeleton className="h-8" /></TableHead>
            <TableHead><Skeleton className="h-8" /></TableHead>
            <TableHead className="!text-right"><Skeleton className="h-8" /></TableHead>
            <TableHead><Skeleton className="h-8" /></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={100}>
                <Skeleton className="h-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

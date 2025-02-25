"use client"
import { cn } from "@/lib/utils";
import * as React from "react";
import { useRouter } from 'next/navigation';
import { TableCell } from "@/components/ui/table";
import { Loader } from "lucide-react";
import { useState } from "react";


interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  employeeId: string;  
}

export function EmployeeTableRow({
  className,
  employeeId,  
  ...props
}: TableRowProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleClick = async () => {
    try {
      setLoading(true);
      // Wait for the navigation to complete
      await router.push(`/employee/internal/${employeeId}`);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      // In case the navigation fails, we still want to reset the loading state
      setLoading(false);
    }
  };

  return (
    <tr
      onClick={handleClick}  
      className={cn(
        "relative border-b transition-colors hover:bg-neutral-100/50 data-[state=selected]:bg-neutral-100 dark:border-dark-3 dark:hover:bg-dark-2 dark:data-[state=selected]:bg-neutral-800 cursor-pointer",
        className,
      )}
      {...props}
    >
      {loading && (
        <TableCell className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50">
          <Loader className="w-5 h-5 text-black dark:text-white animate-spin" />
        </TableCell>
      )}
      {props.children}
    </tr>
  );
}
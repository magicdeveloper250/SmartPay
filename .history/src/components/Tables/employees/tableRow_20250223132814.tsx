"use client"
import { cn } from "@/lib/utils";
import * as React from "react";
import { useRouter } from 'next/navigation';
import { TableCell } from "@/components/ui/table";
import { Loader, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";


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
      
      await router.push(`/employee/internal/${employeeId}`, {scroll:false});
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
    
      setLoading(false);
    }
  };

  return (
    <>
      <tr
        className={cn(
          "relative border-b transition-colors hover:bg-neutral-100/50 data-[state=selected]:bg-neutral-100 dark:border-dark-3 dark:hover:bg-dark-2 dark:data-[state=selected]:bg-neutral-800",
          className,
        )}
        {...props}
      >
        <td onClick={handleClick} className="cursor-pointer" colSpan={props.children?.length}>
          {props.children}
        </td>
        <TableCell className="w-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleClick}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </TableCell>
      </tr>
      {loading && (
        <tr className="absolute top-0 left-0 w-full h-full bg-white/50 dark:bg-black/50">
          <td className="flex items-center justify-center h-full">
            <Loader className="w-5 h-5 text-black dark:text-white animate-spin" />
          </td>
        </tr>
      )}
    </>
  );
}
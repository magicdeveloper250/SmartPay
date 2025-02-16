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
  const[loading, setLoading]= useState<Boolean>(false)
  const router = useRouter();

  const handleClick = () => {
    setLoading(true)
     
    router.push(`/employee/internal/${employeeId}`);
    setLoading(false)
  };

  return (
    <tr
      onClick={handleClick}  
      className={cn(
        "border-b transition-colors hover:bg-neutral-100/50 data-[state=selected]:bg-neutral-100 dark:border-dark-3 dark:hover:bg-dark-2 dark:data-[state=selected]:bg-neutral-800 cursor-pointer", // Add cursor-pointer for better UX
        className,
      )}
      
      {...props}
    >
      {loading&&<TableCell><Loader className="w-5 h-5  text-white"  /></TableCell>}
      {props.children}
    </tr>
  );
}
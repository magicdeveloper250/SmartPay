"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { compactFormat, standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { EmployeeData } from "@/types/employee";
import { useEffect, useState } from "react";
export function EmployeesTable({ className }: { className?: string }) {
  const[employees, setEmployees]= useState<EmployeeData[]>([])
  
const getEmployees= async()=>{
  try {
    const resp= await fetch("api/employees", {method:"GET"})
    const employeesData= await resp.json()
    console.log(employeesData)
 
    
  } catch (error) {
    
  }
}

useEffect(()=>{
  getEmployees()
},[])

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        Top Channels
      </h2>

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
          {employees.map((employee, i) => (
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

              <TableCell> ${standardFormat(employee.monthlyGross)}</TableCell>
              <TableCell> ${employee.bankName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

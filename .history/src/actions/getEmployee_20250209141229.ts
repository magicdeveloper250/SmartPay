'use server'

import { handleActionsPrismaError } from "@/lib/error-handler";
export async function getEmployee(employeeId:string) {
   
  try {
    const response = await fetch(`/api/employee/?id=${employeeId}`);
    console.log("Employee response: ", response)
    const data = await response.json();
    return data;
    
  } catch (error) {
  return  handleActionsPrismaError(error)
  }
}
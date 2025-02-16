"use client";

import EmployeeDetails from "@/components/EmployeeDetails";
import {DetailsModal} from "@/components/Modal";


export default async function Page(props: {
  employeeParams?: Promise<{
    employeeId?: string;
  }>;
}) {
  const params  = await props.employeeParams;
  return (
    <DetailsModal 
      title="Employee Information" 
      backButtonDisabled={true}
    >
       <EmployeeDetails employeeId={params?.employeeId || ""}/>
    </DetailsModal>
  );
}

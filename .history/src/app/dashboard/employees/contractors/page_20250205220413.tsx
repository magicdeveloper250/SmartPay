import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import  EmployeesTable from "@/components/Tables/employees";
import { EmployeesSkeleton } from "@/components/Tables/employees/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tables",
};

const  EmployeePage =() => {
  return (
    <>
      <Breadcrumb pageName="Employees"  />

      <div className="space-y-10">
         <Suspense fallback={<EmployeesSkeleton/>}>
         <EmployeesTable/>
         </Suspense>
      </div>
    </>
  );
};

export default EmployeePage;

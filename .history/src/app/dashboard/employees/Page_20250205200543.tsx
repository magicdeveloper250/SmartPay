import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { EmployeesTable } from "@/components/Tables/employees";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tables",
};

const  EmployeePage =async () => {
  return (
    <>
      <Breadcrumb pageName="Employees" />

      <div className="space-y-10">
         <Suspense fallback={<h1>Loading</h1>}>
         <EmployeesTable/>
         </Suspense>
      </div>
    </>
  );
};

export default EmployeePage;

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PayrollTable from "@/components/Tables/payroll";
import { EmployeesSkeleton } from "@/components/Tables/employees/skeleton";
import { Metadata } from "next";
import { Suspense} from "react";
import Search from "@/components/Search";
import PayrollTabSelector from "@/components/PayrollTabSelector";
import ExportControl from "@/components/ExportPayroll";

import { exportPayrollToCSV } from "@/actions/payroll";

export const metadata: Metadata = {
  title: "Payroll",
};

const PayrollPage = async (props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    tab?:string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const tab=searchParams?.tab || ""
  const currentPage = Number(searchParams?.page) || 1;
 
  
   
  return (
    <div className="grid rounded-[10px] bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-lg">
      <div className="mb-4">
        <Breadcrumb pageName="Payroll" />
      </div>

      <div className="flex items-center justify-between border-b pb-3">
        <PayrollTabSelector/>

        <div className="w-1/3">
          <Search placeholder="Search employees" />
        </div>

      <ExportControl query={query} page={currentPage}/>
       

      </div>

      <div className="mt-6 space-y-6 overflow-x-auto">
        <Suspense fallback={<EmployeesSkeleton />}>
          <PayrollTable tab={tab} query={query} currentPage={currentPage} />
        </Suspense>
      </div>
    </div>
  );
};

export default PayrollPage;

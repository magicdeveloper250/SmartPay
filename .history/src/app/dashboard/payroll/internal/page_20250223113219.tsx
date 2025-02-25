import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PayrollTable from "@/components/Tables/payroll";
import { EmployeesSkeleton } from "@/components/Tables/employees/skeleton";
import { Metadata } from "next";
import { Suspense} from "react";
import Search from "@/components/Search";
import PayrollTabSelector from "@/components/PayrollTabSelector";
import ExportControl from "@/components/ExportPayroll";
import { Menu } from 'lucide-react';


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

      <div className="flex flex-col gap-4 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
      <button className="ml-2 sm:hidden">
        <Menu className="h-6 w-6" />
      </button>

      <div className="w-full sm:w-auto">
        <PayrollTabSelector />
      </div>

      <div className="w-full sm:w-1/3 md:w-1/4 lg:w-1/3">
        <Search placeholder="Search employees" />
      </div>

      <div className="hidden sm:block">
        <ExportControl query={query} page={currentPage} />
      </div>

      <div className="sm:hidden">
        <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-white">
          Export
        </button>
      </div>
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



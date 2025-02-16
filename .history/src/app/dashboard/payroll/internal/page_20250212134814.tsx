import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PayrollTable from "@/components/Tables/payroll";
import { EmployeesSkeleton } from "@/components/Tables/employees/skeleton";
import { Metadata } from "next";
import { Suspense} from "react";
import Search from "@/components/Search";
import PayrollTabSelector from "@/components/PayrollTabSelector";

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


        <div className="p-4 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="text-lg font-medium text-gray-900">
        Pay Date: May 01 - May 30, 2023
      </div>
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Select a date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
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

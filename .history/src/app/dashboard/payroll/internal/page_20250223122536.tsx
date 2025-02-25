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
  const tab = searchParams?.tab || "";
  const currentPage = Number(searchParams?.page) || 1;
   
  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6">
        <Breadcrumb pageName="Payroll" />
      </div>

      <div className="rounded-2xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* Header Section */}
        <div className="p-4 md:p-6 xl:p-7.5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button className="block rounded-full p-2 hover:bg-gray-100 lg:hidden">
                <Menu className="h-6 w-6" />
              </button>
              <div className="w-full max-w-[240px] sm:w-auto">
                <PayrollTabSelector />
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="w-full sm:w-auto">
                <Search 
                  placeholder="Search employees" 
                 
                />
              </div>

              {/* Desktop Export Button */}
              <div className="hidden sm:block">
                <ExportControl query={query} page={currentPage} />
              </div>

              {/* Mobile Export Button */}
              <div className="sm:hidden">
                <button className="w-full rounded-xl bg-primary px-6 py-2.5 text-white hover:bg-primary-dark">
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="px-4 pb-6 md:px-6 xl:px-7.5">
          <Suspense fallback={<EmployeesSkeleton />}>
            <PayrollTable tab={tab} query={query} currentPage={currentPage} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;



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
    <div className="mx-auto max-w-screen-2xl p-3 sm:p-4 md:p-6 2xl:p-2">
      <div className="mb-4 sm:mb-6">
        <Breadcrumb pageName="Payroll" />
      </div>

      <div className="rounded-2xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-3 sm:p-4 md:p-6 xl:p-7.5">
         
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1 mx-3">
              <PayrollTabSelector />
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            
            <div className="hidden lg:block w-full max-w-[240px]">
              <PayrollTabSelector />
            </div>

            <div className="flex flex-col gap-3 sm:flex-col sm:items-center w-full lg:w-auto">
            
              <div className="w-full sm:max-w-[280px]">
                <Search 
                  placeholder="Search employees"
                
                />
              </div>
 
            
              <div className="hidden sm:block flex-shrink-0">
                <ExportControl query={query} page={currentPage} />
              </div>
 
           
              
            </div>
          </div>
        </div>
 
      
        <div className="px-3 pb-4 sm:px-4 sm:pb-6 md:px-6 xl:px-7.5">
          <Suspense 
            fallback={
              <div className="mt-4">
                <EmployeesSkeleton />
              </div>
            }
          >
            <PayrollTable tab={tab} query={query} currentPage={currentPage} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;



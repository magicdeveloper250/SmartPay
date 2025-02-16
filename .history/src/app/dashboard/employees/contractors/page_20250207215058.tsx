import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import  EmployeesTable from "@/components/Tables/employees";
import { EmployeesSkeleton } from "@/components/Tables/employees/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";
import  Search from "@/components/Search";
import { cn } from "@/lib/utils";
export const metadata: Metadata = {
  title: "Contractors",
};

const  ContractorPage =async(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  
  return (
    <div
          className={cn(
            "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card ",
          )}
        >
          
          <Breadcrumb pageName="Employees" />
          <Search placeholder="Search employees" />
     

      <div className="space-y-10 overflow-x-auto">
         <Suspense fallback={<EmployeesSkeleton/>}>
         <EmployeesTable query={query} currentPage={currentPage}/>
         </Suspense>
      </div>
      
    </div>
  );
};

export   default ContractorPage;

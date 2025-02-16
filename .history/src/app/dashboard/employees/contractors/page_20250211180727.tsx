import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import  ContractorsTable from "@/components/Tables/contractors";
import { EmployeesSkeleton } from "@/components/Tables/employees/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";
import  Search from "@/components/Search";
import { cn } from "@/lib/utils";
import Link from "next/link";
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
          
          <Breadcrumb pageName="Contractors" />
          <div className="flex items-center justify-between border-b pb-3">
    <div className="flex gap-2 bg-gray-200 p-1 rounded-md dark:bg-gray-700">
      <button
         className={`px-4 py-2 rounded-md transition "bg-transparent text-gray-700 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-600` }
      >
        Employees
      </button>
      <button
        className={`px-4 py-2 rounded-md transition "bg-transparent text-gray-700 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-600` }
    
      >
        Contractors
      </button>
    </div>
    </div>
          <Link href={"/contractor"} scroll={false}>New</Link>
          <Search placeholder="Search contractors" />
     

      <div className="space-y-10 overflow-x-auto">
         <Suspense fallback={<EmployeesSkeleton/>}>
         <ContractorsTable query={query} currentPage={currentPage}/>
         </Suspense>
      </div>
      
    </div>
  );
};

export   default ContractorPage;

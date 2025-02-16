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
          <Link href={"/contractor"}>New</Link>
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

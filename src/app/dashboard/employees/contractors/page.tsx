import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ContractorsTable from "@/components/Tables/contractors";
import { EmployeesSkeleton } from "@/components/Tables/employees/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";
import Search from "@/components/Search";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contractors",
};

const ContractorPage = async (props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  
  return (
    <div className="mx-auto max-w-screen-2xl p-3 sm:p-4 md:p-6 2xl:p-2">
      {/* Header Section */}
      <div className="mb-6">
        <Breadcrumb pageName="Contractors" />
        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Contractor Directory
          </h1>
          <Link href={"/contractor"} scroll={false} className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 transition-colors">
            Add Contractor
          </Link>
        </div>
      </div>

      <div className={cn(
        "rounded-xl bg-white shadow-sm dark:bg-gray-dark",
        "overflow-hidden border border-gray-100 dark:border-gray-800"
      )}>
        <div className="border-b border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Search 
                placeholder="Search by name, email, or department" 
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700">
                <span>Filter</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700">
                <span>Export</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto px-4">
          <Suspense fallback={<EmployeesSkeleton />}>
            <ContractorsTable query={query} currentPage={currentPage} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ContractorPage;

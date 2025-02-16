import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PayrollTable from "@/components/Tables/payroll";
import { EmployeesSkeleton } from "@/components/Tables/employees/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";
import Search from "@/components/Search";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contractors",
};

const PayrollPage = async (props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-lg"
      )}
    >
      {/* Breadcrumb Navigation */}
      <div className="mb-4">
        <Breadcrumb pageName="Payroll" />
      </div>

      {/* Navigation Links */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="space-x-4">
          <Link
            href={""}
            className="text-sm font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
          >
            Employees
          </Link>
          <Link
            href={""}
            className="text-sm font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
          >
            Contractors
          </Link>
        </div>

        {/* Search Bar */}
        <div className="w-1/3">
          <Search placeholder="Search employees" />
        </div>
      </div>

      {/* Payroll Table */}
      <div className="mt-6 space-y-6 overflow-x-auto">
        <Suspense fallback={<EmployeesSkeleton />}>
          <PayrollTable payrollType="employee" query={query} currentPage={currentPage} />
        </Suspense>
      </div>
    </div>
  );
};

export default PayrollPage;

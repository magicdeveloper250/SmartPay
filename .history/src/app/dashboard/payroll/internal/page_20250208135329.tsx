import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PayrollTable from "@/components/Tables/payroll";
import { EmployeesSkeleton } from "@/components/Tables/employees/skeleton";
import { Metadata } from "next";
import { Suspense} from "react";
import Search from "@/components/Search";
import { useDebouncedCallback } from "use-debounce";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

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
  const tab=searchParams?.query || ""
  const currentPage = Number(searchParams?.page) || 1;
    const pathname = usePathname();
    const { replace } = useRouter();
  
  const handleToggleTab = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('tab', term);
    } else {
      params.delete('tab');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 100);

  return (
    <div className="grid rounded-[10px] bg-white p-6 shadow-md dark:bg-gray-800 dark:shadow-lg">
      <div className="mb-4">
        <Breadcrumb pageName="Payroll" />
      </div>

      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex gap-2 bg-gray-200 p-1 rounded-md dark:bg-gray-700">
          <button
            className={`px-4 py-2 rounded-md transition ${
              tab === "employees"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-transparent text-gray-700 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}

            onClick={()=>handleToggleTab("employees")}
             
          >
            Employees
          </button>
          <button
            className={`px-4 py-2 rounded-md transition ${
              tab === "contractors"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-transparent text-gray-700 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
            onClick={()=>handleToggleTab("contractors")}
        
          >
            Contractors
          </button>
        </div>

        <div className="w-1/3">
          <Search placeholder="Search employees" />
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

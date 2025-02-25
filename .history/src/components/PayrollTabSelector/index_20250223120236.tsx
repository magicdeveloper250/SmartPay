'use client';
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
 
export default function PayrollTabSelector() {
  const searchParams = useSearchParams()
  const pathname = usePathname();
  const { replace } = useRouter();
 
  const [activeTab, setActiveTab] = useState("employees");
  const urlTab = searchParams.get("tab") || "employees";
  
  const handleToggleTab = (term: string) => {
    setActiveTab(term);
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('tab', term);
    } else {
      params.delete('tab');
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }
  useEffect(() => {
    setActiveTab(urlTab);
  }, [urlTab]);
  useEffect(() => {
    if (!searchParams.get('tab')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', "employees");
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, []);
  
  return (
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
      <div className="flex gap-3 bg-gray-200/80 p-1.5 rounded-lg dark:bg-gray-700/90 backdrop-blur-sm">
        <button
          className={`px-5 py-1 rounded-md transition-all duration-200 font-medium ${
            activeTab === "employees"
              ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
              : "bg-transparent text-gray-700 hover:bg-gray-300/80 dark:text-gray-300 dark:hover:bg-gray-600/80"
          }`}
          onClick={() => handleToggleTab("employees")}
        >
          Employees
        </button>
        <button
          className={`px-5 py-1 rounded-md transition-all duration-200 font-medium ${
            activeTab === "contractors"
              ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
              : "bg-transparent text-gray-700 hover:bg-gray-300/80 dark:text-gray-300 dark:hover:bg-gray-600/80"
          }`}
          onClick={() => handleToggleTab("contractors")}
        >
          Contractors
        </button>

        <Link
          className={`px-5 py-2.5 rounded-md transition-all duration-200 font-medium
            text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-gray-600/50
            flex items-center gap-1`}
          href="/history"
          scroll={false}
        >
          Payroll History
        </Link>
      </div>
    </div>
  );
}
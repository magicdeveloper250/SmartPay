'use client';
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDebouncedCallback } from 'use-debounce';
 
export default function PayrollTabSelector( ) {
  const searchParams= useSearchParams()
  const pathname = usePathname();
  const { replace } = useRouter();

  const tab = new URLSearchParams(searchParams).get("tab");
  
  const handleToggleTab = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('tab', term);
    } else {
      params.delete('tab');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 10);
 useEffect(()=>{
  const params = new URLSearchParams(searchParams);
  params.set('tab', "employees");
  replace(`${pathname}?${params.toString()}`);
 },[])
  
  return <div className="flex items-center justify-between border-b pb-3">
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

      <Link
        className={`px-4 py-2 rounded-md transition ${
          tab === "history"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-transparent text-gray-700 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}
         href={"/history"}
         scroll={false}
    
      >
        History
      </Link>
    </div>
    </div>
  
}
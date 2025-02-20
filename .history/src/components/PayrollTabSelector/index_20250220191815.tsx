'use client';
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
 
export default function PayrollTabSelector( ) {
  const searchParams= useSearchParams()
  const pathname = usePathname();
  const { replace } = useRouter();

  const tab = new URLSearchParams(searchParams).get("tab");
  
  const handleToggleTab = (term:string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('tab', term);
    } else {
      params.delete('tab');
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }
 useEffect(()=>{
  const params = new URLSearchParams(searchParams);
  params.set('tab', "employees");
  replace(`${pathname}?${params.toString()}`, {scroll:false});
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
        className={`px-4 py-2 rounded-md transition  underline`}
         href={"/history"}
         scroll={false}
    
      >
        Payroll History
      </Link>
    </div>
    </div>
  
}
'use client';
import { SearchIcon } from "@/assets/icons";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';
 
export default function TabSelector({ placeholder }: { placeholder: string }) {
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
  }, 100);
 
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
    </div>
    </div>
  
}
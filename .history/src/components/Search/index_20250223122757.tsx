'use client';
import { SearchIcon } from "@/assets/icons";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';
 
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);
 
  return (
    <div className="relative flex flex-1 flex-shrink-0 group">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full min-w-[280px] rounded-xl border-[1.5px] border-gray-200 bg-gray-50/50 px-4 py-2.5 pl-11 text-sm
          backdrop-blur-sm
          placeholder:text-gray-400
          outline-none transition-all duration-200
          hover:bg-gray-50/70
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200
          dark:border-gray-700 dark:bg-gray-800/50 dark:placeholder:text-gray-500
          dark:focus:border-blue-400 dark:focus:ring-blue-800/30"
        placeholder={placeholder}
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 
        text-gray-400 transition-colors duration-200
        peer-focus:text-blue-500 peer-hover:text-gray-600
        dark:text-gray-500 dark:peer-focus:text-blue-400" />
    </div>
  );
}
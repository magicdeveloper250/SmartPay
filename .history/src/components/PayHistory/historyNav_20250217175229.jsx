"use client"
import React from 'react'
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { PaymentStatus } from '@prisma/client';

export function HistoryNav( ) {
  const tabs = [... Object.values(PaymentStatus).map(status=> {
    return { name: status, current: true }
  })];
 

  const searchParams= useSearchParams()
  const pathname = usePathname();
  const { replace } = useRouter();

 const payrollStatus = new URLSearchParams(searchParams).get("status");
 const handleToggleTab = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('status', term);
    } else {
      params.delete('status');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 10);
  return  <nav className="flex space-x-8 border-b">
  {tabs.map((tab) => (
    <button
      key={tab.name}
      className={`pb-2 px-1 ${
        payrollStatus==tab.name
          ? 'border-b-2 border-blue-600 text-blue-600'
          : 'text-gray-500'
      }`}
      onClick={()=>handleToggleTab(tab.name)}
    >
      {tab.name}
    </button>
  ))}
</nav>
}

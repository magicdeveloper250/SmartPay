"use client"
import React from 'react'
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { PaymentStatus } from '@prisma/client';
import { useEffect } from 'react';

export function HistoryNav() {
  const tabs = Object.values(PaymentStatus).map(status => ({
    name: status,
    label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }));

  const searchParams = useSearchParams()
  const pathname = usePathname();
  const { replace } = useRouter();

  const payrollStatus = searchParams.get("status");

  // Debounce the tab switching to prevent rapid changes
  const handleToggleTab = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('status', term);
    } else {
      params.delete('status');
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 150); // 150ms delay

  useEffect(() => {
    if (!payrollStatus) {
      const params = new URLSearchParams(searchParams);
      params.set('status', PaymentStatus.Pending);
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, []);

  return (
    <nav className="flex items-center gap-1 p-1 bg-gray-50 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => handleToggleTab(tab.name)}
          className={`
            relative px-4 py-2 rounded-md transition-all duration-200 ease-in-out
            ${payrollStatus === tab.name
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
            }
            font-medium text-sm
          `}
        >
          {tab.label}
          {payrollStatus === tab.name && (
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-blue-600" />
          )}
        </button>
      ))}
    </nav>
  );
}

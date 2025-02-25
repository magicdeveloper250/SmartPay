"use client"
import React, { useState } from 'react'
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

  const [activeStatus, setActiveStatus] = useState<PaymentStatus>(PaymentStatus.All);
      const urlStatus = searchParams.get("status") || PaymentStatus.All;

  const handleToggleTab = (term:string) => {
      setActiveStatus(term as PaymentStatus);
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('status', term);
    } else {
      params.delete('status');
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    setActiveStatus(urlStatus as PaymentStatus);
  }, [urlStatus]);

  useEffect(() => {
    if (!searchParams.get('status')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('status', PaymentStatus.Pending);
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, []);

  return (
    <div className="flex items-center justify-between pb-3">
      <div className="flex gap-2 bg-gray-200/80 p-1 rounded-lg dark:bg-gray-700/90 backdrop-blur-sm">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleToggleTab(tab.name)}
            className={`
              px-4 py-1.5 rounded-md transition-all duration-200 font-medium
              ${activeStatus === tab.name
                ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                : "bg-transparent text-gray-700 hover:bg-gray-300/80 dark:text-gray-300 dark:hover:bg-gray-600/80"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

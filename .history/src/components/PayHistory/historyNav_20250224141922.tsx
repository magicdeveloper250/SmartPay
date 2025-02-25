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
  const [paymentType, setPaymentType] = useState<'employee' | 'contractor'>('employee');
  const urlStatus = searchParams.get("status") || PaymentStatus.All;
  const urlType = searchParams.get("type") || 'employee';

  const handleToggleTab = (term: string) => {
    setActiveStatus(term as PaymentStatus);
    const params = new URLSearchParams(searchParams.toString());
    params.set('status', term);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleToggleType = (type: 'employee' | 'contractor') => {
    setPaymentType(type);
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', type);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    setActiveStatus(urlStatus as PaymentStatus);
    setPaymentType(urlType as 'employee' | 'contractor');
  }, [urlStatus, urlType]);

  useEffect(() => {
    if (!searchParams.get('status')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('status', PaymentStatus.Pending);
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 pb-3">
      <div className="flex items-center gap-4">
        <div className="flex gap-2 bg-gray-200/80 p-1 rounded-lg dark:bg-gray-700/90">
          <button
            onClick={() => handleToggleType('employee')}
            className={`px-4 py-1.5 rounded-md transition-all duration-200 font-medium
              ${paymentType === 'employee'
                ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                : "bg-transparent text-gray-700 hover:bg-gray-300/80 dark:text-gray-300 dark:hover:bg-gray-600/80"
              }`}
          >
            Employees
          </button>
          <button
            onClick={() => handleToggleType('contractor')}
            className={`px-4 py-1.5 rounded-md transition-all duration-200 font-medium
              ${paymentType === 'contractor'
                ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                : "bg-transparent text-gray-700 hover:bg-gray-300/80 dark:text-gray-300 dark:hover:bg-gray-600/80"
              }`}
          >
            Contractors
          </button>
        </div>
      </div>
      
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

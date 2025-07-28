"use client"
import React, { useState } from 'react'
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { PaymentStatus, PayrollType } from '@prisma/client';
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
  const [payrollType, setPayrollType] = useState<PayrollType>(PayrollType.MIXED);
  
  const urlStatus = searchParams.get("status") || PaymentStatus.All;
  const urlType = (searchParams.get("type") as PayrollType) || PayrollType.MIXED;

  const handleToggleTab = (term: string) => {
    setActiveStatus(term as PaymentStatus);
    const params = new URLSearchParams(searchParams.toString());
    params.set('status', term);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleTypeChange = (type: PayrollType) => {
    if (type === payrollType) {
      return;  
        } 
    setPayrollType(type);
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', type);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    setActiveStatus(urlStatus as PaymentStatus);
    setPayrollType(urlType);
  }, [urlStatus, urlType]);

  useEffect(() => {
    if (!searchParams.get('status')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('status', PaymentStatus.All);
      params.set('type', PayrollType.MIXED);
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 pb-3">
      <div className="flex flex-col gap-4 pb-3">
  <fieldset className="w-full">
    <legend className="sr-only">Payroll Type Selection</legend>
    <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-gray-100 p-4 rounded-lg dark:bg-gray-700">
      <label className="flex items-center gap-2 cursor-pointer min-w-[90px]" htmlFor="mixed-payroll">
        <input
          id="mixed-payroll"
          type="radio"
          checked={payrollType === PayrollType.MIXED}
          onChange={() => handleTypeChange(PayrollType.MIXED)}
          className="w-5 h-5 text-primary focus:ring-primary focus:ring-offset-1"
          name="payrollType"
        />
        <span className="font-medium text-gray-700 dark:text-gray-300">
          Mixed
        </span>
      </label>
      
      <label className="flex items-center gap-2 cursor-pointer min-w-[90px]" htmlFor="employee-payroll">
        <input
          id="employee-payroll"
          type="radio"
          checked={payrollType === PayrollType.EMPLOYEE}
          onChange={() => handleTypeChange(PayrollType.EMPLOYEE)}
          className="w-5 h-5 text-primary focus:ring-primary focus:ring-offset-1"
          name="payrollType"
        />
        <span className="font-medium text-gray-700 dark:text-gray-300">
          Employees
        </span>
      </label>
      
      <label className="flex items-center gap-2 cursor-pointer min-w-[90px]" htmlFor="contractor-payroll">
        <input
          id="contractor-payroll"
          type="radio"
          checked={payrollType === PayrollType.CONTRACTOR}
          onChange={() => handleTypeChange(PayrollType.CONTRACTOR)}
          className="w-5 h-5 text-primary focus:ring-primary focus:ring-offset-1"
          name="payrollType"
        />
        <span className="font-medium text-gray-700 dark:text-gray-300">
          Contractors
        </span>
      </label>
    </div>
  </fieldset>
</div>
      
      <div className="flex gap-2 bg-gray-200/80 p-1 rounded-lg dark:bg-gray-700/90 backdrop-blur-sm">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleToggleTab(tab.name)}
            className={`
              px-4 py-1.5 rounded-md transition-all duration-200 font-medium
              ${activeStatus === tab.name
                ? "bg-primary text-white shadow-lg hover:bg-primary"
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

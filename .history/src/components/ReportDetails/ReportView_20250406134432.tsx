"use client"
import React, {  useEffect, useState, useTransition } from 'react';
import { Plus, PencilIcon, MinusIcon,  Loader, Building2, Phone, Wallet2, CreditCard, BadgeCheck, BookHeartIcon, Trash, X, AlertCircle, Loader2 } from "lucide-react";
import { Employee, EmployeeBenefit, AppliedTax, PredefinedTax, AdditionalIncome, PaymentStatus, Deduction, PredefinedContribution, AppliedContribution} from '@prisma/client';
import toast from 'react-hot-toast';
import { addEmployeeBenefit, addEmployeeContribution, addEmployeeTax, changeEmployeeDeductionStatus, changeEmployeeIncomeStatus, deleteEmployee, deleteEmployeeBenefit, deleteEmployeeContribution, deleteEmployeeDeduction, deleteEmployeeIncome, deleteEmployeeTax } from '@/actions/employeeActions';
import Link from 'next/link';
import { BenefitName } from '@prisma/client';
import { formatPaymentFrequency } from '@/utils/fomatters';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useRouter } from 'next/navigation';

export default function ReportDisplay({ employee, benefits, taxes,contributions, additionalIncomes, deductions }: { employee: Employee, benefits: EmployeeBenefit[], taxes: AppliedTax[], contributions:AppliedContribution[],additionalIncomes:AdditionalIncome[], deductions:Deduction[] }) {
 
  

  return (
   
 
    <div className="w-full max-w-7xl mx-auto p-4">
   
    </div>
  );
}

 
 
 

 

 
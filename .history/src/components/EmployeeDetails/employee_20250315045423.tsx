"use client"
import React, {  useEffect, useState, useTransition } from 'react';
import { Plus, PencilIcon, MinusIcon,  Loader, Building2, Phone, Wallet2, CreditCard, BadgeCheck } from "lucide-react";
import { Employee, EmployeeBenefit, AppliedTax, PredefinedTax, AdditionalIncome, PaymentStatus, Deduction} from '@prisma/client';
import toast from 'react-hot-toast';
import { addEmployeeBenefit, addEmployeeTax, changeEmployeeDeductionStatus, changeEmployeeIncomeStatus, deleteEmployeeBenefit, deleteEmployeeDeduction, deleteEmployeeIncome, deleteEmployeeTax } from '@/actions/employeeActions';
import Link from 'next/link';
import { BenefitName } from '@prisma/client';
import { formatPaymentFrequency } from '@/utils/fomatters';

export default function EmployeeDisplay({ employee, benefits, taxes,additionalIncomes, deductions }: { employee: Employee, benefits: EmployeeBenefit[], taxes: AppliedTax[], additionalIncomes:AdditionalIncome[], deductions:Deduction[] }) {
 
  const [showBenefits, setShowBenefits] = useState<Boolean>(false);
  const [showTaxes, setShowTaxes] = useState<Boolean>(false);
  const [AllTaxes, setTaxes] = useState<PredefinedTax[]>([]);
  const[isAddingBenefit, startAdddingBenefitTransition]= useTransition()
  const[isDeletingBenefit, startDeletingBenefitTransition]= useTransition() 
  const[isAddingTax, startAdddingTaxTransition]= useTransition()
  const[isDeletingTax, startDeletingTaxTransition]= useTransition() 
  const[isDeletingIncome, startDeletingIncomeTransition]= useTransition() 
  const[isChangingIncomeStatus, startChangingStatusTransition]= useTransition() 
  const[isAddingDeduction, startAdddingDeductionTransition]= useTransition()
  const[isDeletingDeduction, startDeletingDeductionTransition]= useTransition() 
  const[isChangingDeductionStatus, startChangingDeductionStatusTransition]= useTransition() 
  const [loadingBenefitId, setLoadingBenefitId] = useState<string | null>(null);
  const [loadingIncomeId, setLoadingIncomeId] = useState<string | null>(null);
  const [loadingDeductionId, setLoadingDeductionId] = useState<string | null>(null);

  const getTaxes = async () => {
    try {
      const resp = await fetch("/api/tax");
      const data = await resp.json();
      if ("error" in data){
        toast.error(data.error)
      }else{
        setTaxes(data.taxes);
      }
    } catch (error) {
      toast.error("Unable to fetch taxes");
    }
  };
 

  const handleAddingBenefit= (employeeId:string, benefit:string)=>{
    startAdddingBenefitTransition(async()=>{
      const response= await addEmployeeBenefit(employeeId, benefit)
    })
  }


  const handleDeletingBenefit= (id:string, employeeId:string, benefit:string)=>{
    setLoadingBenefitId(id);
    startDeletingBenefitTransition(async()=>{
      const response= await deleteEmployeeBenefit(id, employeeId, benefit)
      setLoadingBenefitId(null);
    })
  }


  const handleAddingTax= (employeeId:string, taxId:string)=>{
    startAdddingTaxTransition(async()=>{
      const response= await addEmployeeTax( employeeId, taxId)
    })
  }


  const handleDeletingTax= (id:string, employeeId:string,)=>{
    startDeletingTaxTransition(async()=>{
      const response= await deleteEmployeeTax(id, employeeId)
    })
  }

  const handleDeletingIncome= (id:string, employeeId:string,)=>{
    setLoadingIncomeId(id);
    startDeletingIncomeTransition(async()=>{
      const response= await deleteEmployeeIncome(id, employeeId)
      setLoadingIncomeId(null);
    })
  }

  const handleChanngeIncomeStatus= (id:string, employeeId:string,newStatus:PaymentStatus)=>{
    setLoadingIncomeId(id);
    startChangingStatusTransition(async()=>{
      const response= await changeEmployeeIncomeStatus(id, employeeId, newStatus)
      setLoadingIncomeId(null);
    })
  }
  



  const handleDeletingDeduction= (id:string, employeeId:string,)=>{
    setLoadingDeductionId(id);
    startDeletingDeductionTransition(async()=>{
      const response= await deleteEmployeeDeduction(id, employeeId)
      setLoadingDeductionId(null);
    })
  }

  const handleChanngeDeductionStatus= (id:string, employeeId:string,newStatus:PaymentStatus)=>{
    setLoadingDeductionId(id);
    startChangingDeductionStatusTransition(async()=>{
      const response= await changeEmployeeDeductionStatus(id, employeeId, newStatus)
      setLoadingDeductionId(null);
    })
  }
  useEffect(() => {
    Promise.all([ getTaxes()]);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Main Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {employee.firstName} {employee.secondName}
            </h1>
            <p className="text-sm text-gray-500">Employee ID: {employee.id}</p>
          </div>
          <Link
            href={`/employee/internal/${employee.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            scroll={false}
          >
            <PencilIcon className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-medium">Edit Details</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current Status</p>
              <p className="text-base font-semibold text-gray-900">Active Employee</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Contact</p>
              <p className="text-base font-semibold text-gray-900">{employee.phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Wallet2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{formatPaymentFrequency(employee.paymentFrequency)} Salary</p>
              <p className="text-base font-semibold text-gray-900">
                {new Intl.NumberFormat('en-US', { 
                  style: 'currency', 
                  currency: employee.currency 
                }).format(employee.monthlyGross)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <CreditCard className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payment Method</p>
              <p className="text-base font-semibold text-gray-900">{employee.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <BadgeCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Benefits</h2>
          </div>
          <PrimaryButton 
            onClick={() => setShowBenefits(!showBenefits)}
            loading={isAddingBenefit || isDeletingBenefit}
          >
            {showBenefits ? (
              <>
                <MinusIcon className="w-5 h-5" />
                <span>Close</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Add Benefit</span>
              </>
            )}
          </PrimaryButton>
        </div>
        <div className="mb-4">
          {showBenefits && (
            <select className="w-full p-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>handleAddingBenefit(employee.id, e.target.value)}>
              <option value="" disabled selected>Select Benefit</option>
              {Object.values(BenefitName).map((eBenefit, index) => (
                <option key={index} className={`text-gray-700 ${benefits.some((benefit)=>benefit.benefit==eBenefit) && "bg-gray-6"}`} disabled={benefits.some((benefit)=>benefit.benefit==eBenefit)}>{eBenefit}</option>
              ))}
            </select>
          )}
        </div>
        {benefits.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-600">
            {benefits.map((benefit, index) => (
                 <div className="w-full flex justify-between gap-4 mb-6" key={index}>
                  <li  className="mb-2">{benefit.benefit}</li>
                 <SecondaryButton
                   variant="danger"
                   onClick={() => handleDeletingBenefit(benefit.id, employee.id, benefit.benefit)}
                   loading={loadingBenefitId === benefit.id}
                 >
                   <MinusIcon className="w-5 h-5" />
                 </SecondaryButton>
               </div>
             
            ))}
          </ul>
        ) : <span className="text-gray-500">No allowed Benefit Found</span>}
      </div>

      {/* Additional Incomes Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Wallet2 className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Additional Incomes</h2>
          </div>
          <Link
            href={`/employee/internal/${employee.id}/additionals`}
            scroll={false}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white 
              hover:bg-primary-600 transition-all duration-200"
          >
            {isDeletingIncome || isChangingIncomeStatus ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Add Income</span>
              </>
            )}
          </Link>
        </div>
        <div>
        { additionalIncomes.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-600">
          {additionalIncomes.map((income, index) => (
            <div className="w-full flex justify-between gap-4 mb-6" key={index}>
         <li className="mb-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"  key={index}>
            <div className="flex flex-col space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-gray-800">{income.incomeType}</span>
                  <span className="text-emerald-600 font-medium">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: employee.currency }).format(income.amount)}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {new Date(income.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="flex flex-wrap items-center ju gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    income.paymentStatus === PaymentStatus.Paid
                      ? 'bg-emerald-50 text-emerald-700'
                      : income.paymentStatus === PaymentStatus.Pending
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {income.paymentStatus}
                  </span>
                  
                 <div className='p-5'>
                 {income.paymentStatus === PaymentStatus.Pending && (
                    <SecondaryButton
                      variant="danger"
                      onClick={() => handleChanngeIncomeStatus(income.id, employee.id, PaymentStatus.Cancelled)}
                      loading={loadingIncomeId === income.id}
                    >
                      Cancel
                    </SecondaryButton>
                  )}
                   {(income.paymentStatus == PaymentStatus.Cancelled) && (
                    <SecondaryButton
                      onClick={() => handleChanngeIncomeStatus(income.id, employee.id, PaymentStatus.Pending)}
                      loading={loadingIncomeId === income.id}
                    >
                      Pending
                    </SecondaryButton>
                  )}
                  {(income.paymentStatus !== PaymentStatus.Paid && income.paymentStatus !== PaymentStatus.Cancelled) && (
                    <PrimaryButton
                      onClick={() => handleChanngeIncomeStatus(income.id, employee.id, PaymentStatus.Paid)}
                      loading={loadingIncomeId === income.id}
                    >
                      Pay
                    </PrimaryButton>
                  )}

                  
                  <SecondaryButton
                    variant="danger"
                    onClick={() => handleDeletingIncome(income.id, employee.id)}
                    loading={loadingIncomeId === income.id}
                    className="!p-2"
                  >
                    <MinusIcon className="w-5 h-5" />
                  </SecondaryButton>
                 </div>
                </div>
              </div>

              {income.description && (
                <div className="text-gray-500 text-sm italic border-t border-gray-100 pt-2">
                  {income.description}
                </div>
              )}
            </div>
          </li>
         </div>
          
          ))}
        </ul>
        
        ) : <span className="text-gray-500">No additional income Found</span>}
        </div>
      </div>

      {/* Taxes Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <BadgeCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Taxes</h2>
          </div>
          <button
            onClick={() => setShowTaxes(!showTaxes)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white 
              hover:bg-primary-600 transition-all duration-200"
          >
            {!showTaxes ? (
              isAddingTax || isDeletingTax ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add Tax</span>
                </>
              )
            ) : (
              <>
                <MinusIcon className="w-5 h-5" />
                <span>Close</span>
              </>
            )}
          </button>
        </div>
        <div className="mb-4">
          {showTaxes && (
            <select 
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>handleAddingTax(employee.id, e.target.value)}
            >
              <option value="" disabled selected>Select Tax</option>
              {AllTaxes.map((tax, index) => {
                const disabled = employee.monthlyGross < tax.min ||
                  (tax.max !== null && employee.monthlyGross > tax.max) ||
                  taxes.some(etax => etax.taxId === tax.id)
                return (
                  <option 
                    key={index} 
                    className={`text-gray-700 ${disabled && "bg-gray-100"}`} 
                    value={tax.id} 
                    disabled={disabled}
                  >
                    {tax.name} [
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: employee.currency }).format(tax.min ?? 0)}
                    -
                    {tax.max !== null 
                      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: employee.currency }).format(tax.max) 
                      : "More"} 
                      =
                    {` ${tax.rate * 100}%`}]
                  </option>
                )
              })}
            </select>
          )}
        </div>
        {taxes.length > 0 ? (
          <ul className="space-y-4">
            {taxes.map((tax, index) => (
              <li 
                key={index}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <span className="font-medium text-gray-900">
                  {AllTaxes.find((Atax) => Atax.id === tax.taxId)?.name || "Unknown Tax"}
                </span>
                <SecondaryButton
                  variant="danger"
                  onClick={() => handleDeletingTax(tax.id, employee.id)}
                  loading={isDeletingTax}
                  className="!p-2"
                >
                  <MinusIcon className="w-5 h-5" />
                </SecondaryButton>
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-gray-500">No assigned Taxes Found</span>
        )}
      </div>

      {/* Deductions Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Wallet2 className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Deductions</h2>
          </div>
          <Link
            href={`/employee/internal/${employee.id}/deduction`}
            scroll={false}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white 
              hover:bg-primary-600 transition-all duration-200"
          >
            {isAddingDeduction || isDeletingDeduction || isChangingDeductionStatus ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Add Deduction</span>
              </>
            )}
          </Link>
        </div>
        <div>
        { deductions.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-600">
          {deductions.map((deduction, index) => (
            <div className="w-full flex justify-between gap-4 mb-6" key={index} >
         <li className="mb-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
            <div className="flex flex-col space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-red-600 font-medium">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: employee.currency }).format(deduction.amount)}
                  </span>
                  <span className="text-gray-600 text-sm">
                  {new Date(deduction.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="flex flex-wrap items-center ju gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    deduction.status === PaymentStatus.Paid
                      ? 'bg-emerald-50 text-emerald-700'
                      : deduction.status === PaymentStatus.Pending
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {deduction.status}
                  </span>
                  
                 <div className='p-5'>
                 {deduction.status === PaymentStatus.Pending && (
                    <SecondaryButton
                      variant="danger"
                      onClick={() => handleChanngeDeductionStatus(deduction.id, employee.id, PaymentStatus.Cancelled)}
                      loading={loadingDeductionId === deduction.id}
                    >
                      Cancel
                    </SecondaryButton>
                  )}
                   {(deduction.status == PaymentStatus.Cancelled) && (
                    <SecondaryButton
                      onClick={() => handleChanngeDeductionStatus(deduction.id, employee.id, PaymentStatus.Pending)}
                      loading={loadingDeductionId === deduction.id}
                    >
                      Pending
                    </SecondaryButton>
                  )}
                  {(deduction.status !== PaymentStatus.Paid && deduction.status !== PaymentStatus.Cancelled) && (
                    <PrimaryButton
                      onClick={() => handleChanngeDeductionStatus(deduction.id, employee.id, PaymentStatus.Paid)}
                      loading={loadingDeductionId === deduction.id}
                    >
                      Pay
                    </PrimaryButton>
                  )}

                  
                  <SecondaryButton
                    variant="danger"
                    onClick={() => handleDeletingDeduction(deduction.id, employee.id)}
                    loading={loadingDeductionId === deduction.id}
                    className="!p-2"
                  >
                    <MinusIcon className="w-5 h-5" />
                  </SecondaryButton>
                 </div>
                </div>
              </div>

              {deduction.reason && (
                <div className="text-gray-500 text-sm italic border-t border-gray-100 pt-2">
                  {deduction.reason}
                </div>
              )}
            </div>
          </li>
         </div>
          
          ))}
        </ul>
        
        ) : <span className="text-gray-500">No Deductions Found</span>}
        </div>
       
      </div>
    </div>
  );
}

 

function PrimaryButton({ children, onClick, loading, className = "" }: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  loading?: boolean,
  className?: string 
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white 
        hover:bg-primary-600 disabled:bg-primary-300 transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
    >
      {loading && <Loader className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, loading, variant = "default", className = "" }: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  loading?: boolean,
  variant?: "default" | "danger",
  className?: string 
}) {
  const variants = {
    default: "bg-gray-50 text-gray-700 hover:bg-gray-100",
    danger: "bg-red-50 text-red-700 hover:bg-red-100"
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg
        ${variants[variant]} disabled:opacity-50 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    >
      {loading && <Loader className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
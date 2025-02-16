"use client"
import React, {  useEffect, useState, useTransition } from 'react';
import { Plus, PencilIcon, MinusIcon,  Loader} from "lucide-react";
import { Employee, EmployeeBenefit, AppliedTax, PredefinedTax, AdditionalIncome, PaymentStatus, Deduction} from '@prisma/client';
import toast from 'react-hot-toast';
import { addEmployeeBenefit, addEmployeeTax, changeEmployeeDeductionStatus, changeEmployeeIncomeStatus, deleteEmployeeBenefit, deleteEmployeeDeduction, deleteEmployeeIncome, deleteEmployeeTax } from '@/actions/employeeActions';
import Link from 'next/link';
import { BenefitName } from '@prisma/client';

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
  const getTaxes = async () => {
    try {
      const resp = await fetch("/api/tax");
      const data = await resp.json();
      setTaxes(data.taxes);
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
    startDeletingBenefitTransition(async()=>{
      const response= await deleteEmployeeBenefit(id, employeeId, benefit)
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
    startDeletingIncomeTransition(async()=>{
      const response= await deleteEmployeeIncome(id, employeeId)
    })
  }

  const handleChanngeIncomeStatus= (id:string, employeeId:string,newStatus:PaymentStatus)=>{
    startChangingStatusTransition(async()=>{
      const response= await changeEmployeeIncomeStatus(id, employeeId, newStatus)
    })
  }
  



  const handleDeletingDeduction= (id:string, employeeId:string,)=>{
    startDeletingDeductionTransition(async()=>{
      const response= await deleteEmployeeDeduction(id, employeeId)
    })
  }

  const handleChanngeDeductionStatus= (id:string, employeeId:string,newStatus:PaymentStatus)=>{
    startChangingDeductionStatusTransition(async()=>{
      const response= await changeEmployeeDeductionStatus(id, employeeId, newStatus)
    })
  }
  useEffect(() => {
    Promise.all([ getTaxes()]);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 transform transition-all hover:shadow-2xl">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
        <Link
          href={`/employee/internal/${employee.id}/edit`}
          className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
          scroll={false}
        >
          <PencilIcon className="w-5 h-5 text-blue-600" />
        </Link>
      </div>
      
        <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          <span className="font-medium text-gray-700">ID:</span>
          <span className="text-gray-600">{employee.id}</span>
          <span className="font-medium text-gray-700">First name:</span>
          <span className="text-gray-600">{employee.firstName}</span>
          <span className="font-medium text-gray-700">Second name:</span>
          <span className="text-gray-600">{employee.secondName}</span>
          <span className="font-medium text-gray-700">Phone:</span>
          <span className="text-gray-600">{employee.phoneNumber}</span>
          <span className="font-medium text-gray-700">Salary:</span>
          <span className="text-gray-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: employee.currency }).format(employee.monthlyGross) }</span>
          <span className="font-medium text-gray-700">Payment Method:</span>
          <span className="text-gray-600">{employee.paymentMethod}</span>
        </div>
      
      <div className="mb-6">
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Benefits</h2>
          <button
            onClick={() => setShowBenefits(!showBenefits)}
            className="transition-colors p-2 rounded-full   hover:bg-primary-200 bg-primary"
          >
           {
          !showBenefits ? (
            isAddingBenefit || isDeletingBenefit ? (
              <Loader className="w-5 h-5  text-white" />
            ) : (
              <Plus className="w-5 h-5  text-white" />
            )
          ) : (
            (
              isAddingBenefit || isDeletingBenefit ? (
                <Loader className="w-5 h-5  text-white"  />
              ) : (
                <MinusIcon className="w-5 h-5  text-white" />
              )
            )
          )
        }
          </button>
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
                 <div className="w-full flex justify-between gap-4 mb-6">
                  <li key={index} className="mb-2">{benefit.benefit}</li>
                 <button
                   className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                  onClick={()=>handleDeletingBenefit(benefit.id, employee.id,benefit.benefit)}
                 >
                   {<MinusIcon className="w-5 h-5 text-red-600" />}
                 </button>
               </div>
             
            ))}
          </ul>
        ) : <span className="text-gray-500">No allowed Benefit Found</span>}
      </div>

      

      <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Additional Incomes</h2>
          <Link
            href={`/employee/internal/${employee.id}/additionals`}
            scroll={false}
            className="transition-colors p-2 rounded-full   hover:bg-primary-200 bg-primary"
          > 
             
              {isDeletingIncome || isChangingIncomeStatus? (
                <Loader className="w-5 h-5  text-white"  />
              ) : (
                <Plus className="w-5 h-5  text-white" />
              )}
            
              
          </Link>
        </div>
        <div>
        { additionalIncomes.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-600">
          {additionalIncomes.map((income, index) => (
            <div className="w-full flex justify-between gap-4 mb-6">
         <li key={index} className="mb-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
            <div className="flex flex-col space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-gray-800">{income.income_type}</span>
                  <span className="text-emerald-600 font-medium">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: employee.currency }).format(income.amount)}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {new Date(income.effective_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="flex flex-wrap items-center ju gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    income.payment_status === PaymentStatus.Paid
                      ? 'bg-emerald-50 text-emerald-700'
                      : income.payment_status === PaymentStatus.Pending
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {income.payment_status}
                  </span>
                  
                 <div className='p-5'>
                 {income.payment_status === PaymentStatus.Pending && (
                    <button
                      onClick={() => handleChanngeIncomeStatus(income.id, employee.id, PaymentStatus.Cancelled)}
                      className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  )}
                   {(income.payment_status == PaymentStatus.Cancelled) && (
                    <button 
                      onClick={() => handleChanngeIncomeStatus(income.id, employee.id, PaymentStatus.Pending)}
                      className="px-4 py-2 text-sm font-medium   bg-amber-50 text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2 transition-colors duration-200">
                      Pending
                    </button>
                  )}
                  {(income.payment_status !== PaymentStatus.Paid && income.payment_status !== PaymentStatus.Cancelled) && (
                    <button 
                      onClick={() => handleChanngeIncomeStatus(income.id, employee.id, PaymentStatus.Paid)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                      Pay
                    </button>
                  )}

                  
                  <button className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors duration-200"
                  onClick={()=>handleDeletingIncome(income.id, employee.id)}
                  >
                    <MinusIcon className="w-5 h-5 text-red-600" />
                  </button>
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

        <div>
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Taxes</h2>
          <button
            onClick={() => setShowTaxes(!showTaxes)}
            className="transition-colors p-2 rounded-full   hover:bg-primary-200 bg-primary"
          >
            {!showTaxes ? (
            isAddingTax || isDeletingTax || isChangingIncomeStatus ? (
              <Loader className="w-5 h-5  text-white" />
            ) : (
              <Plus className="w-5 h-5  text-white" />
            )
          ) : (
            (
              isAddingTax || isDeletingTax ? (
                <Loader className="w-5 h-5  text-white"  />
              ) : (
                <MinusIcon className="w-5 h-5  text-white" />
              )
            )
          )}
          </button>
        </div>
        <div className="mb-4">
          {showTaxes && (
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>handleAddingTax(employee.id, e.target.value)}>
              <option value="" disabled selected>Select Tax</option>
              {AllTaxes.map((tax, index) => {
                const disabled =   employee.monthlyGross < tax.min ||
                (tax.max !== null && employee.monthlyGross > tax.max) ||
                taxes.some(etax => etax.taxId === tax.id)
                return <option key={index} className={`text-gray-700 ${disabled && "bg-gray-6"}`} value={tax.id} disabled={disabled}>
                {tax.name} [
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: employee.currency }).format(tax.min ?? 0)}
                -
                {tax.max !== null 
                  ? new Intl.NumberFormat('en-US', { style: 'currency', currency: employee.currency }).format(tax.max) 
                  : "More"} 
                  =
                {` ${tax.rate * 100}%`}]
              </option>
              
})}
            </select>
          )}
        </div>
        {taxes.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-600">
          {taxes.map((tax, index) => (
            <div className="w-full flex justify-between gap-4 mb-6">
              <li key={index} className="mb-2">
              {AllTaxes.find((Atax) => Atax.id === tax.taxId)?.name || "Unknown Tax"}
            </li>
           <button
             className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
            onClick={()=>handleDeletingTax(tax.id, employee.id,)}
           >
             {<MinusIcon className="w-5 h-5 text-red-600" />}
           </button>
         </div>
          
          ))}
        </ul>
        
        ) : <span className="text-gray-500">No assigned Taxes Found</span>}
      </div>


      <div>
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Deductions</h2>
          <Link
            href={`/employee/internal/${employee.id}/deduction`}
            scroll={false}
            className="transition-colors p-2 rounded-full   hover:bg-primary-200 bg-primary"
          > 
         
          {  isAddingDeduction || isDeletingDeduction|| isChangingDeductionStatus ? (
              <Loader className="w-5 h-5  text-white" />
            ) : (
              <Plus className="w-5 h-5  text-white" />
            )}
         
          </Link>
        </div>
        <div>
        { deductions.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-600">
          {deductions.map((deduction, index) => (
            <div className="w-full flex justify-between gap-4 mb-6">
         <li key={index} className="mb-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
            <div className="flex flex-col space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-red-600 font-medium">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: employee.currency }).format(deduction.amount)}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {new Date(deduction.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
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
                    <button
                      onClick={() => handleChanngeDeductionStatus(deduction.id, employee.id, PaymentStatus.Cancelled)}
                      className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  )}
                   {(deduction.status == PaymentStatus.Cancelled) && (
                    <button 
                      onClick={() => handleChanngeDeductionStatus(deduction.id, employee.id, PaymentStatus.Pending)}
                      className="px-4 py-2 text-sm font-medium   bg-amber-50 text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2 transition-colors duration-200">
                      Pending
                    </button>
                  )}
                  {(deduction.status !== PaymentStatus.Paid && deduction.status !== PaymentStatus.Cancelled) && (
                    <button 
                      onClick={() => handleChanngeDeductionStatus(deduction.id, employee.id, PaymentStatus.Paid)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                      Pay
                    </button>
                  )}

                  
                  <button className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors duration-200"
                  onClick={()=>handleDeletingDeduction(deduction.id, employee.id)}
                  >
                    <MinusIcon className="w-5 h-5 text-red-600" />
                  </button>
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
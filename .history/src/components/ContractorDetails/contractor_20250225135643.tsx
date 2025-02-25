"use client"
import React, {  useEffect, useState, useTransition } from 'react';
import { Plus, PencilIcon, MinusIcon, Loader, EyeIcon, ChevronRight, BadgeCheck, Building2, Phone, Wallet2, CreditCard } from "lucide-react";
import { Contractor,ContractorBenefit, AppliedTax, PredefinedTax, ContractTerms } from '@prisma/client';
import toast from 'react-hot-toast';
import { addContractorBenefit, addContractorTax, deleteContractorBenefit, deleteContractorTax } from '@/actions/contractorActions';
 
import Link from 'next/link';

export default function ContractorDisplay({ contractor, benefits, taxes, contracts }: { contractor: Contractor, benefits: ContractorBenefit[], taxes: AppliedTax[], contracts:ContractTerms[] }) {
 
  const [AllBenefits, setBenefits] = useState<string[]>([]);
  const [showBenefits, setShowBenefits] = useState<Boolean>(false);
  const [showTaxes, setShowTaxes] = useState<Boolean>(false);
  const [AllTaxes, setTaxes] = useState<PredefinedTax[]>([]);
  const[isAddingBenefit, startAdddingBenefitTransition]= useTransition()
  const[isDeletingBenefit, startDeletingBenefitTransition]= useTransition() 
  const[isAddingTax, startAdddingTaxTransition]= useTransition()
  const[isDeletingTax, startDeletingTaxTransition]= useTransition() 
 
  const getBenefits = async () => {
    try {
      const resp = await fetch("/api/benefit");
      const data = await resp.json();
      setBenefits(data);
    } catch (error) {
      toast.error("Unable to fetch benefits");
    }
  };

  const getTaxes = async () => {
    try {
      const resp = await fetch("/api/tax");
      const data = await resp.json();
      setTaxes(data.taxes);
    } catch (error) {
      toast.error("Unable to fetch taxes");
    }
  };

  const handleAddingBenefit= (contractorId:string, benefit:string)=>{
    startAdddingBenefitTransition(async()=>{
      const response= await addContractorBenefit(contractorId, benefit)
    })
  }


  const handleDeletingBenefit= (id:string, contractorId:string, benefit:string)=>{
    startDeletingBenefitTransition(async()=>{
      const response= await deleteContractorBenefit(id, contractorId)
    })
  }


  const handleAddingTax= (contractorId:string, taxId:string)=>{
    startAdddingTaxTransition(async()=>{
      const response= await addContractorTax( contractorId, taxId)
    })
  }


  const handleDeletingTax= (id:string, contractorId:string,)=>{
    startDeletingTaxTransition(async()=>{
      const response= await deleteContractorTax(id, contractorId)
    })
  }
 
  useEffect(() => {
    Promise.all([getBenefits(), getTaxes()]);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
     
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {contractor.firstName} {contractor.secondName}
            </h1>
            <p className="text-sm text-gray-500">Contractor ID: {contractor.id}</p>
          </div>
          <Link
            href={`/contractor/internal/${contractor.id}/edit`}
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
              <p className="text-base font-semibold text-gray-900">Active Contractor</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Contact</p>
              <p className="text-base font-semibold text-gray-900">{contractor.phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Wallet2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current Salary</p>
              <p className="text-base font-semibold text-gray-900">
                {new Intl.NumberFormat('en-US', { 
                  style: 'currency', 
                  currency: contractor.currency 
                }).format(contracts[0]?.salary || 0)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <CreditCard className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payment Method</p>
              <p className="text-base font-semibold text-gray-900">{contractor.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contract History Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <details className="group" open>
          <summary className="flex cursor-pointer list-none items-center justify-between p-6 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <BadgeCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Contract History</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {contracts.length} Contracts
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 transition-transform duration-200 group-open:rotate-90" />
          </summary>

          <div className="border-t border-gray-100">
            {contracts.map((contract, index) => (
              <div 
                key={contract.id}
                className={`p-6 ${index !== contracts.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-gray-900">
                        Contract {contracts.length - index}
                      </h3>
                      {index === 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Start Date:</span>
                        <span className="ml-2 text-gray-900 font-medium">
                          {new Date(contract.startDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Salary:</span>
                        <span className="ml-2 text-gray-900 font-medium">
                          {new Intl.NumberFormat('en-US', { 
                            style: 'currency', 
                            currency: contractor.currency 
                          }).format(contract.salary)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/contractor/internal/${contract.id}/contract`}
                    scroll={false}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                    aria-label={`View contract details for ${contractor.firstName} ${contractor.secondName} starting ${new Date(contract.startDate).toLocaleDateString()}`}
                  >
                    <EyeIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-600 font-medium">Details</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </details>
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
            <select className="w-full p-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>handleAddingBenefit(contractor.id, e.target.value)}>
              <option value="" disabled selected>Select Benefit</option>
              {AllBenefits.map((eBenefit, index) => (
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
                 <button
                   className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                  onClick={()=>handleDeletingBenefit(benefit.id, contractor.id,benefit.benefit)}
                 >
                   {<MinusIcon className="w-5 h-5 text-red-600" />}
                 </button>
               </div>
             
            ))}
          </ul>
        ) : <span className="text-gray-500">No allowed Benefit Found</span>}
      </div>

      <div>
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Taxes</h2>
          <button
            onClick={() => setShowTaxes(!showTaxes)}
            className="transition-colors p-2 rounded-full   hover:bg-primary-200 bg-primary"
          >
            {!showTaxes ? (
            isAddingTax || isDeletingTax ? (
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
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>handleAddingTax(contractor.id, e.target.value)}>
              <option value="" disabled selected>Select Tax</option>
              {AllTaxes.map((tax, index) => {
                const disabled =   contracts[0].salary < tax.min ||
                (tax.max !== null && contracts[0].salary > tax.max) ||
                taxes.some(etax => etax.taxId === tax.id)
                return <option key={index} className={`text-gray-700 ${disabled && "bg-gray-6"}`} value={tax.id} disabled={disabled}>
                {tax.name} [
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: contractor.currency }).format(tax.min ?? 0)}
                -
                {tax.max !== null 
                  ? new Intl.NumberFormat('en-US', { style: 'currency', currency: contractor.currency }).format(tax.max) 
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
            <div className="w-full flex justify-between gap-4 mb-6" key={index}>
              <li  className="mb-2">
              {AllTaxes.find((Atax) => Atax.id === tax.taxId)?.name || "Unknown Tax"}
            </li>
           <button
             className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
            onClick={()=>handleDeletingTax(tax.id, contractor.id,)}
           >
             {<MinusIcon className="w-5 h-5 text-red-600" />}
           </button>
         </div>
          
          ))}
        </ul>
        
        ) : <span className="text-gray-500">No assigned Taxes Found</span>}
      </div>
    </div>
  );
}
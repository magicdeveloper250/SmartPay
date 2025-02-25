"use client"
import React, {  useEffect, useState, useTransition } from 'react';
import { Plus, PencilIcon, MinusIcon, Loader, EyeIcon, ChevronRight} from "lucide-react";
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
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 transform transition-all hover:shadow-2xl">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
        <Link
          href={`/contractor/internal/${contractor.id}/edit`}
          className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
          scroll={false}
        >
          <PencilIcon className="w-5 h-5 text-blue-600" />
        </Link>
      </div>

      
        <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          <span className="font-medium text-gray-700">ID:</span>
          <span className="text-gray-600">{contractor.id}</span>
          <span className="font-medium text-gray-700">First name:</span>
          <span className="text-gray-600">{contractor.firstName}</span>
          <span className="font-medium text-gray-700">Second name:</span>
          <span className="text-gray-600">{contractor.secondName}</span>
          <span className="font-medium text-gray-700">Phone:</span>
          <span className="text-gray-600">{contractor.phoneNumber}</span>
          <span className="font-medium text-gray-700">Salary:</span>
          <span className="text-gray-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: contractor.currency }).format(contracts[0].salary || 0) }</span>
          <span className="font-medium text-gray-700">Payment Method:</span>
          <span className="text-gray-600">{contractor.paymentMethod}</span>
          
          <div className="col-span-2 mt-4">
            <details className="group rounded-lg border border-gray-200 bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4 transition-colors hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">Contract History</h3>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {contracts.length}
                  </span>
                </div>
                <div className="transition-transform duration-200 group-open:rotate-180">
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                </div>
              </summary>
              
              <div className="border-t border-gray-200">
                {contracts.map((contract, index) => (
                  <div 
                    key={contract.id}
                    className={`flex items-center justify-between p-4 ${
                      index !== contracts.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        Contract {index + 1}
                      </p>
                      <p className="text-sm text-gray-500">
                        Valid from: {new Date(contract.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Salary: {new Intl.NumberFormat('en-US', { 
                          style: 'currency', 
                          currency: contractor.currency 
                        }).format(contract.salary)}
                      </p>
                    </div>
                    <Link
                      href={`/contractor/internal/${contract.id}/contract`}
                      scroll={false}
                      className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-100 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      aria-label={`View contract details for ${contractor.firstName} ${contractor.secondName} from ${new Date(contract.startDate).toLocaleDateString()}`}
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>View Details</span>
                    </Link>
                  </div>
                ))}
              </div>
            </details>
          </div>
          

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
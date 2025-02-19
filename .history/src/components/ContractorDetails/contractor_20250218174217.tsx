"use client"
import React, {  useEffect, useState, useTransition } from 'react';
import { Plus, PencilIcon, MinusIcon, Loader, EyeIcon} from "lucide-react";
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
          <Link 
              href={`/contractor/internal/${contracts[0].id}/contract`} 
              scroll={false} 
              className='inline-flex p-2 border-2 border-dark rounded-lg'
            >
              <EyeIcon className='w-5 h-5'/> View Contract
            </Link>

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
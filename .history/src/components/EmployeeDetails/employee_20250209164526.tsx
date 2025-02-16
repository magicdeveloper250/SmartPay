"use client"
import React, { useEffect } from 'react'
import { Plus, PencilIcon, MinusIcon } from "lucide-react";
import { Employee,EmployeeBenefit, Tax } from '@prisma/client';
import toast from 'react-hot-toast';
import { useState } from 'react';
export default function EmployeeDisplay({employee, benefits, taxes}:{employee:Employee, benefits:EmployeeBenefit[], taxes:Tax[]}) {
  const[AllBenefits, setBenefits]=useState<string[]>([])
  const[showBenefits, setShowBenefits]=useState<Boolean>(false)
  const[showTaxes, setShowTaxes]=useState<Boolean>(false)

  const[AllTaxes, setTaxes]=useState<string[]>([])

  const getBenefits= async()=>{
    try {
      const resp= await fetch("/api/benefit");
      const data= await resp.json();
      setBenefits(data)
      
    } catch (error) {
      toast.error("Unable to fetch benefits");
      
    }
  }

  const getTaxes= async()=>{
    try {
      const resp= await fetch("/api/tax");
      const data= await resp.json();
      setTaxes(data)
      
    } catch (error) {
      toast.error("Unable to fetch benefits");
      
    }
  }

  useEffect(()=>{
    Promise.all([getBenefits(), getTaxes()])
  },[])
  return ( <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-4">
  <div className="w-full flex justify-between items-center mb-3">
  <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
  <button><PencilIcon className="w-5 h-5" /></button>

  </div>
 
  <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-3 mb-3">
    <span className="font-medium">ID:</span>
    <span className="text-gray-600">{employee.id}</span>
    <span className="font-medium">First name:</span>
    <span className="text-gray-600">{employee.firstName}</span>
    <span className="font-medium">Second name:</span>
    <span className="text-gray-600">{employee.secondName}</span>
    <span className="font-medium">Phone:</span>
    <span className="text-gray-600">{employee.phoneNumber}</span>
  </div>
  
    <div>
      <div className="w-full flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Benefits</h2>
        <button onClick={()=>setShowBenefits(!showBenefits)}>{!showBenefits?<Plus className="w-5 h-5" />:<MinusIcon className="w-5 h-5" />}</button>
      </div>
      <div>
        {showBenefits&&<select name="" id="">
          <option value="" disabled selected>Select Benefit</option>
          {AllBenefits.map((benefit, index)=>{
            return <option key={index}> {benefit}</option>
          })}
        </select>}
      </div>
  {benefits.length > 0 ? (
      <ul className="list-disc pl-5 text-gray-600">
        {benefits.map((benefit, index) => (
          <li key={index}>{benefit.benefitId}</li>
        ))}
      </ul>
  ):<span>No allowed Benefit Found</span>}
    </div>
  
    <div>
      <div className="w-full flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Taxes</h2>
        <button onClick={()=>setShowBenefits(!showTaxes)}>{!showBenefits?<Plus className="w-5 h-5" />:<MinusIcon className="w-5 h-5" />}</button>
      </div>
      <div>
        {showTaxes&&<select name="" id="">
          <option value="" disabled selected>Select tax</option>
          {AllBenefits.map((tax, index)=>{
            return <option key={index}> {tax}</option>
          })}
        </select>}
      </div>
  {taxes.length > 0 ? (
      <ul className="list-disc pl-5 text-gray-600">
        {taxes.map((tax, index) => (
          <li key={index}>{tax.type}</li>
        ))}
      </ul>
  ):<span>No assigned Taxes Found</span>}
    </div>
</div>
);
}

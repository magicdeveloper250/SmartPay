"use client"
import React, {  useEffect, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema, employeeSchemaType } from "@/validations/employeeSchema";
import type { BankType } from "@/types/bankType";
import { createEmployee } from "@/actions/employeeActions";
import Loader from '../Common/Loader';
import { Employee } from '@prisma/client';
 
 export default  function EditEmployeeForm({employeeId}:{employeeId:string}) {
   const[banckType, setBankType]= useState<BankType>("phone");
   const [employee, setEmployee]= useState<Employee|null>(null)
    const[currencies, setCurrencies]=useState<string[]>([])
      const[isUpdating, startUpdatingTransition]= useTransition()
       const { 
          register, 
          handleSubmit, 
          setValue,
          reset,
          formState: { errors, isValid }, 
        } = useForm<employeeSchemaType>({
          resolver: zodResolver(employeeSchema),
          mode: "onBlur"
        });

        const getCurrencies= async()=>{
          try {
            const resp= await fetch("/api/currency");
            const data= await resp.json();
            setCurrencies(data)
            
          } catch (error) {
            toast.error("Unable to fetch Currencies");
            
          }
        }

        const getEmployee= async()=>{
          try {
            const resp= await fetch(`/api/employee/?id=${employeeId}`);
            const data= await resp.json();
            setEmployee(data.employee)
            
          } catch (error) {
            toast.error("Unable to fetch empoyee");
            
          }
        }
 const onSubmit = (data: employeeSchemaType) => {
    startUpdatingTransition(async () => {
      const response = await createEmployee(data);
      if (response?.error) {
        toast.error(response?.error || "Registration failed");
      } else {
        toast.success("Employee registered successfully");
        reset()
      }
    });
  };
  const handlePaymentMethodChange = (type: BankType) => {
    setBankType(type);
    setValue("paymentMethod", type);
  };

  useEffect(() => {
    Promise.all([getCurrencies(), getEmployee()]);
  }, []);
  useEffect(() => {
    setBankType(employee?.paymentMethod || "phone")
  }, [employee]);
        
   return <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
   <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
   <legend className="text-xl font-semibold mb-4 col-span-2">Personal Information</legend>
    <div>
      <label className="block text-sm font-medium mb-1">First Name</label>
      <input 
        {...register("firstName")}
       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
       value={employee?.firstName}
      />
      {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
          )}
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Second Name</label>
      <input 
        {...register("secondName")}
       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
       value={employee?.secondName}
      />
      {errors.secondName && (
            <p className="text-red-500 text-sm mt-1">{errors.secondName.message}</p>
          )}
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Email</label>
      <input 
        {...register("email")}
       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
       value={employee?.email}
      />
      {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Phone</label>
      <input 
        {...register("phoneNumber")}
       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
       value={employee?.phoneNumber}
      />
      {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
          )}
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Address</label>
      <input 
        {...register("address")}
       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
       value={employee?.address}
      />
      {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Employee ID</label>
      <input 
        {...register("employeeID")}
       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
       value={employee?.employeeID}
      />
      {errors.employeeID && (
            <p className="text-red-500 text-sm mt-1">{errors.employeeID.message}</p>
          )}
      
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">National ID/Passport</label>
      <input 
        {...register("nationalID")}
       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
       value={employee?.nationalID}
      />
      {errors.nationalID && (
            <p className="text-red-500 text-sm mt-1">{errors.nationalID.message}</p>
          )}
      
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">start Date</label>
      <input 
        {...register("startDate")}
        type="date"
       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
       value={new Date(employee?.startDate || "2024-11-27T00:00:00.000Z").toISOString().split('T')[0]}
      />
      {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
          )}
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Job Title</label>
      <input 
        {...register("jobTitle")}
       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
       value={employee?.jobTitle}
      />
      {errors.jobTitle && (
            <p className="text-red-500 text-sm mt-1">{errors.jobTitle.message}</p>
          )}
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Monthly Gross</label>
      <input 
        type="number"
        step="0.01"
        {...register("monthlyGross")}
       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
       value={employee?.monthlyGross}
      />
      {errors.monthlyGross && (
            <p className="text-red-500 text-sm mt-1">{errors.monthlyGross.message}</p>
          )}
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Currency</label>
      <select 
        {...register("currency")}
        required
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        value={employee?.currency}
      >
        <option value="" disabled>Select currency</option>
        {currencies.map(currency=>{
          return <option key={currency} value={currency}>{currency}</option>

        })}
      </select>
      {errors.currency && (
            <p className="text-red-500 text-sm mt-1">{errors.currency.message}</p>
          )}
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Department</label>
      <input 
        {...register("department")}
       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
       value={employee?.department}
      />
      {errors.department && (
            <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
          )}
    </div>
   </fieldset>

   <fieldset className="mt-8">
     <legend className="text-xl font-semibold mb-4">Payment Details</legend>
     <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-6">  
          <button 
            onClick={() => handlePaymentMethodChange("bank")}
            className={`h-12 border-2 rounded-lg transition-colors ${
              banckType === "bank" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
            }`}
            type="button"
          >
            Bank
          </button>
          <button 
            onClick={() => handlePaymentMethodChange("crypto")}
            className={`h-12 border-2 rounded-lg transition-colors ${
              banckType === "crypto" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
            }`}
            type="button"
          >
            Crypto Wallet
          </button>
          <button 
            onClick={() => handlePaymentMethodChange("phone")}
            className={`h-12 border-2 rounded-lg transition-colors ${
              banckType === "phone" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
            }`}
            type="button"
          >
            Mobile Phone
          </button>
          <input {...register("paymentMethod")} type="hidden" value={banckType} />
        </div>
    {banckType=="bank"&&<>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
     <div>
   
     <label className="block text-sm font-medium mb-1">Bank Name</label>
      <input 
        {...register("bankName")}
       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
      {errors.bankName && (
            <p className="text-red-500 text-sm mt-1">{errors.bankName.message}</p>
          )}
     
     </div>
     <div>
     <label className="block text-sm font-medium mb-1">Bank Account Number</label>
      <input 
        {...register("bankAccountNumber")}
       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
       value={employee?.bankAccountNumber ||""}
      />
      {errors.bankAccountNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.bankAccountNumber.message}</p>
          )}
     </div>
     
     <div>
     <label className="block text-sm font-medium mb-1">Swift Code</label>
      <input 
        {...register("swiftCode")}
       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
       value={employee?.swiftCode ||""}
      />
      {errors.swiftCode && (
            <p className="text-red-500 text-sm mt-1">{errors.swiftCode.message}</p>
          )}
     </div>
   
     <div>
     <label className="block text-sm font-medium mb-1">Domicile</label>
      <input 
        {...register("Domicile")}
       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
       value={employee?.Domicile ||""}
      />
      {errors.Domicile && (
            <p className="text-red-500 text-sm mt-1">{errors.Domicile.message}</p>
          )}
     </div>
    </div>
    </>}
    {banckType=="crypto"&& <div>
      <div>
            <label className="block text-sm font-medium mb-2">Wallet Address</label>
            <input 
              {...register("walletAddress")}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={employee?.walletAddress ||""}
            />
            {errors.walletAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.walletAddress.message}</p>
            )}
          </div>
    </div>}

    {banckType=="phone"&& <div>
      <div>
            <label className="block text-sm font-medium mb-2">Payment Phone Number</label>
            <input 
              {...register("paymentPhone")}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={employee?.paymentPhone ||""}
            />
            {errors.paymentPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentPhone.message}</p>
            )}
          </div>
    </div>}
     </fieldset>
     <div className="flex gap-6">
      <button 
        type="submit"
        disabled={isUpdating || !isValid}
         className="flex-1 p-2  flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-dark"
      >
        Submit {isUpdating && <Loader/>}
      </button>
       
    </div>
  </form>
 }
 
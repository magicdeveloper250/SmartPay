"use client"

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  IncomeType } from '@prisma/client';  
import { AdditionalIncomeSchemaType, additionalIncomeSchema } from '@/validations/additionalIncome';
 import { useTransition } from 'react';
import toast from 'react-hot-toast';
import { addAdditionalIncome } from '@/actions/additionalIncomeActions';
import { useRouter } from 'next/navigation';
import Loader from '../Common/Loader';
const AdditionalIncomeForm = ({ employeeId }: { employeeId: string }) => {
  const router= useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<AdditionalIncomeSchemaType>({
    resolver: zodResolver(additionalIncomeSchema),
    mode:"onSubmit",
    
  });
const [isSubmitting, startTransition] = useTransition();

const onSubmit = (data: AdditionalIncomeSchemaType) => {
  startTransition(async () => {
    const response = await addAdditionalIncome(data, employeeId);
    if (response?.error) {
      toast.error(response?.error || "Adding additional income failed");
    } else {
      toast.success("income added successfully");
      reset()
      router.back()
    }
  });
};



 

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6">
      <form  onSubmit={handleSubmit(onSubmit)}  className="space-y-6">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            {...register('amount')}
            type="number"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
 
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Income Type
          </label>
          <select
            {...register('incomeType')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.incomeType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {Object.values(IncomeType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.incomeType && (
            <p className="mt-1 text-sm text-red-600">{errors.incomeType.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">

          <div className="flex gap-3">
           
            <button 
              type="submit"
              disabled={isSubmitting}
               className="flex-1 p-2  flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-dark"
            >
              Submit {isSubmitting && <Loader/>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdditionalIncomeForm;
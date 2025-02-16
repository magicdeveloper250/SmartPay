"use client"

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
 import { useTransition } from 'react';
import toast from 'react-hot-toast';
import { addDeduction } from '@/actions/additionalIncomeActions';
import Loader from '../Common/Loader';
import { deductionSchema, deductionSchemaType } from '@/validations/deductionSchema';
const DeductionForm = ({ employeeId }: { employeeId: string }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<deductionSchemaType>({
    resolver: zodResolver(deductionSchema),
    mode:"onSubmit",
    
  });
const [isSubmitting, startTransition] = useTransition();

const onSubmit = (data: deductionSchemaType) => {
  startTransition(async () => {
    const response = await addDeduction(data, employeeId);
    if (response?.error) {
      toast.error(response?.error || "Adding additional income failed");
    } else {
      toast.success("income added successfully");
      reset()
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
            Deduction Reason
          </label>
          <textarea
            {...register('reason')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.reason ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.reason && (
            <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
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

export default DeductionForm;
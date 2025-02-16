"use client"

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Currency, IncomeType, PaymentStatus } from '@prisma/client';  
import { AdditionalIncomeSchemaType, additionalIncomeSchema } from '@/validations/additionalIncome';
 

const AdditionalIncomeForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<AdditionalIncomeSchemaType>({
    resolver: zodResolver(additionalIncomeSchema),
    defaultValues: {
      currency: "USD",
      is_taxable: true,
    },
  });

  const paymentStatus = watch("payment_status");

  const onSubmit = async (data: AdditionalIncomeSchemaType) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Form submitted:', data);
      // Handle success
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      console.log('Delete income record requested');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
       

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
            Effective Date
          </label>
          <input
            {...register('effective_date')}
            type="date"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.effective_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.effective_date && (
            <p className="mt-1 text-sm text-red-600">{errors.effective_date.message}</p>
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
            {...register('income_type')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.income_type ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {Object.values(IncomeType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.income_type && (
            <p className="mt-1 text-sm text-red-600">{errors.income_type.message}</p>
          )}
        </div>
 
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Status
          </label>
          <select
            {...register('payment_status')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.payment_status ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {Object.values(PaymentStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {errors.payment_status && (
            <p className="mt-1 text-sm text-red-600">{errors.payment_status.message}</p>
          )}
        </div>
 
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            {...register('currency')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.currency ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {Object.values(Currency).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          {errors.currency && (
            <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
          )}
        </div>
 
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Is Taxable?
          </label>
          <input
            {...register('is_taxable')}
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          {errors.is_taxable && (
            <p className="mt-1 text-sm text-red-600">{errors.is_taxable.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdditionalIncomeForm;
"use client"
import React from 'react';

export function  ContractorFormSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 animate-pulse">
      {/* Personal Information Section Skeleton */}
      <div className="mb-8">
        <div className="h-7 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* 8 form fields placeholders */}
          {[...Array(8)].map((_, i) => (
            <div key={`personal-${i}`}>
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Details Section Skeleton */}
      <div className="mt-12 mb-8">
        <div className="h-7 bg-gray-200 rounded w-1/4 mb-6"></div>
        
        {/* Payment method buttons */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={`payment-btn-${i}`} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
        
        {/* Payment fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={`payment-field-${i}`}>
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Contract Terms Section Skeleton */}
      <div className="mt-12 mb-8">
        <div className="h-7 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={`contract-${i}`}>
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button Skeleton */}
      <div className="mt-8">
        <div className="h-12 bg-gray-200 rounded w-full md:w-1/3"></div>
      </div>
    </div>
  );
}
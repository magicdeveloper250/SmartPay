"use client";

import { useState } from "react";
import Loader from "@/components/Common/Loader";

export  function ContractorDetailsSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto rounded-lg p-6 bg-white shadow-md">
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
      
      <div className="space-y-8">
        {/* Personal Information Section */}
        <fieldset className="border rounded-lg p-6 bg-gray-50">
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Field skeletons */}
            {[...Array(10)].map((_, i) => (
              <div key={i}>
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Payment Details Section */}
        <fieldset className="border rounded-lg p-6 bg-gray-50">
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
          
          <div className="mb-4">
            <div className="h-5 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">  
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 border-2 rounded-lg bg-gray-100 animate-pulse"></div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-12 bg-gray-100 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </fieldset>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <div className="h-12 bg-gray-300 rounded-lg animate-pulse sm:flex-1"></div>
          <div className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center">
          <Loader />
        </div>
      </div>
    </div>
  );
}
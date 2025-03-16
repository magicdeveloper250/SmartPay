"use client"
import React from 'react';

export  function EmployeeDetailsSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Main flex container with responsive column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Personal Details (~30% on desktop) */}
        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-sm p-6 border border-gray-100 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <div className="h-8 w-48 bg-gray-200 rounded-md"></div>
              <div className="h-4 w-32 bg-gray-100 rounded-md"></div>
            </div>
            <div className="h-10 w-28 bg-blue-50 rounded-lg"></div>
          </div>

          {/* Employee details skeleton */}
          <div className="space-y-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg h-10 w-10"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-100 rounded-md"></div>
                  <div className="h-5 w-32 bg-gray-200 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column - Four sections in a 2x2 grid (~70% on desktop) */}
        <div className="w-full lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 1 - Top Left */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 min-h-[200px]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-blue-100 rounded-full"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
                </div>
                <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-100 rounded-md"></div>
                <div className="h-4 w-5/6 bg-gray-100 rounded-md"></div>
                <div className="h-4 w-4/6 bg-gray-100 rounded-md"></div>
              </div>
            </div>

            {/* Section 3 - Top Right */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 min-h-[200px]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-blue-100 rounded-full"></div>
                  <div className="h-6 w-36 bg-gray-200 rounded-md"></div>
                </div>
                <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-100 rounded-md"></div>
                <div className="h-4 w-5/6 bg-gray-100 rounded-md"></div>
                <div className="h-4 w-4/6 bg-gray-100 rounded-md"></div>
              </div>
            </div>

            {/* Section 2 - Bottom Left */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 min-h-[200px]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-green-100 rounded-full"></div>
                  <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
                </div>
                <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-3">
                <div className="h-12 w-full bg-gray-100 rounded-md"></div>
                <div className="h-12 w-full bg-gray-100 rounded-md"></div>
              </div>
            </div>

            {/* Section 4 - Bottom Right */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 min-h-[200px]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-red-100 rounded-full"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
                </div>
                <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-3">
                <div className="h-12 w-full bg-gray-100 rounded-md"></div>
                <div className="h-12 w-full bg-gray-100 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
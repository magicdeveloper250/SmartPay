import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Skeleton */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
        {/* Logo Skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Menu Items Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mb-4"></div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-2 gap-6">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex gap-4">
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
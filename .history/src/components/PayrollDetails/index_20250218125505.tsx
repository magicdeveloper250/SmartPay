"use client"
import React from 'react';
import { Clock, MapPin, Package, Copy } from 'lucide-react';
import { MainPayroll, Payroll } from '@prisma/client';

export function PayrollDetail ({ mainPayroll, payrolls }: { mainPayroll: MainPayroll, payrolls: Payroll[] }){
  const handleCopyTracking = () => {
    navigator.clipboard.writeText('871291892812');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">#8981786</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
          On Deliver
        </span>
      </div>

      {/* Delivery Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg col-span-1 md:col-span-1">
          <div className="flex items-center mb-2">
            <Package className="w-5 h-5 mr-2 text-gray-600" />
            <p className="font-medium">Be patient, package on deliver!</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm text-gray-600">Malang, Indonesia</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm text-gray-600">Emir's House, Indonesia</span>
            </div>
          </div>
          <div className="mt-4 w-full bg-orange-500 h-1 rounded"></div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Estimated Arrival</p>
          <p className="font-medium">9 July 2024</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Delivered in</p>
          <p className="font-medium">5 Days</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Timeline</h2>
        <div className="space-y-6">
          <div className="flex">
            <div className="flex flex-col items-center mr-4">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <div className="w-0.5 h-full bg-gray-200"></div>
            </div>
            <div>
              <p className="font-medium">Your package is packed by the courier</p>
              <p className="text-sm text-gray-600">Malang, East Java, Indonesia</p>
              <div className="flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                <span className="text-sm text-gray-400">06:00</span>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="flex flex-col items-center mr-4">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-0.5 h-full bg-gray-200"></div>
            </div>
            <div>
              <p className="font-medium">Shipment has been created</p>
              <p className="text-sm text-gray-600">Malang, Indonesia</p>
              <div className="flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                <span className="text-sm text-gray-400">06:00</span>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="flex flex-col items-center mr-4">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
            <div>
              <p className="font-medium">Order placed</p>
              <div className="flex items-center gap-2">
                <img src="/api/placeholder/24/24" alt="Nike" className="w-6 h-6" />
                <span className="font-medium">Nike</span>
                <span className="text-blue-500">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-medium mb-4">Shipment</h2>
          <div className="flex items-start gap-4">
            <img src="/api/placeholder/48/48" alt="Doordash" className="w-12 h-12" />
            <div>
              <p className="font-medium">Doordash Indonesia</p>
              <p className="text-sm text-gray-600">Surabaya, Lo kidul, East Java, Indonesia</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">Tracking Information</h2>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="text-sm text-gray-600">Tracking No.</p>
              <p className="font-medium">871291892812</p>
            </div>
            <button 
              onClick={handleCopyTracking}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
            >
              <Copy className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-medium">Items</h2>
          <span className="text-sm text-gray-600">4</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4">
            <img src="/api/placeholder/80/80" alt="Nike Air Max SYSTM" className="w-20 h-20 object-cover rounded" />
            <div>
              <p className="font-medium">Nike Air Max SYSTM</p>
              <p className="text-gray-600">Rp 1,459,000</p>
              <p className="text-sm text-gray-500">Size: 24</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <img src="/api/placeholder/80/80" alt="Nike Air Rift" className="w-20 h-20 object-cover rounded" />
            <div>
              <p className="font-medium">Nike Air Rift</p>
              <p className="text-gray-600">Rp 1,909,000</p>
              <p className="text-sm text-gray-500">Size: 24</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

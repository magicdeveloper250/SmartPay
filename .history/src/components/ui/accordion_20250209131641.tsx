"use client"
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Accordion(){
  const [openAccordion, setOpenAccordion] = useState<string | null>("1");

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return <div className="space-y-2">
  <div className="border rounded-lg">
    <button
      onClick={() => toggleAccordion("1")}
      className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
    >
      <span className="text-lg font-medium text-gray-800">Additional Information</span>
      <ChevronDown
        className={`w-5 h-5 transition-transform duration-200 ${
          openAccordion === "1" ? "rotate-180" : ""
        }`}
      />
    </button>
    <div
      className={`px-4 overflow-hidden transition-all duration-200 ${
        openAccordion === "1"
          ? "max-h-40 py-3"
          : "max-h-0"
      }`}
    >
      <p className="text-gray-600">
        This section contains additional details about the order and customer.
      </p>
    </div>
  </div>

  {/* Second Accordion Item */}
  <div className="border rounded-lg">
    <button
      onClick={() => toggleAccordion("2")}
      className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
    >
      <span className="text-lg font-medium text-gray-800">Shipping Details</span>
      <ChevronDown
        className={`w-5 h-5 transition-transform duration-200 ${
          openAccordion === "2" ? "rotate-180" : ""
        }`}
      />
    </button>
    <div
      className={`px-4 overflow-hidden transition-all duration-200 ${
        openAccordion === "2"
          ? "max-h-40 py-3"
          : "max-h-0"
      }`}
    >
      <p className="text-gray-600">
        Information about shipping address and delivery preferences.
      </p>
    </div>
  </div>

  {/* Third Accordion Item */}
  <div className="border rounded-lg">
    <button
      onClick={() => toggleAccordion("3")}
      className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
    >
      <span className="text-lg font-medium text-gray-800">Payment Information</span>
      <ChevronDown
        className={`w-5 h-5 transition-transform duration-200 ${
          openAccordion === "3" ? "rotate-180" : ""
        }`}
      />
    </button>
    <div
      className={`px-4 overflow-hidden transition-all duration-200 ${
        openAccordion === "3"
          ? "max-h-40 py-3"
          : "max-h-0"
      }`}
    >
      <p className="text-gray-600">
        Details about payment method and transaction history.
      </p>
    </div>
  </div>
</div>

}
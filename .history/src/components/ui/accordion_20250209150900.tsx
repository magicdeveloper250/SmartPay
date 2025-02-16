"use client";
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  items: Record<string, any>[];
  defaultOpen?: string | null;
  maxHeight?: string;
}

export default function Accordion({ 
  items, 
  defaultOpen = null,
  maxHeight = "max-h-40"
}: AccordionProps) {
  const keys = items.length > 0 ? Object.keys(items[0]) : [];
  const [openAccordion, setOpenAccordion] = useState<string | null>(defaultOpen);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border rounded-lg">
          <button
            onClick={() => toggleAccordion(item.id)}
            className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-medium text-gray-800">{item[keys[0]]}</span>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${
                openAccordion === item.id ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`px-4 overflow-hidden transition-all duration-200 ${
              openAccordion === item.id
                ? `${maxHeight} py-3`
                : "max-h-0"
            }`}
          >
            {keys.slice(1).map((key) => (
              <p key={key} className="text-gray-600">
                <strong>{key}:</strong> {item[key]}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
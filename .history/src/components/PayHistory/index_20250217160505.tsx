import React from 'react';
import { Package} from 'lucide-react';
import { getPayrollHistory } from '@/actions/payroll';

export async function PayrollHistory ( ) {

  const history= await getPayrollHistory()
  const tabs = [
    { name: 'Order History', current: true },
     
  ];

  return (
    <div className="w-full max-w-2xl p-4">
      <nav className="flex space-x-8 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`pb-2 px-1 ${
              tab.current
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </nav>

      <div className="mt-8 space-y-8">
        {history.map((history, index) => (
          <div key={index} className="flex gap-4">
            <div className="relatyyyyyyyyive flex items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <div className="text-blue-600"><Package className="w-4 h-4" /></div>
              </div>
               
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{history.paymentDate?.toLocaleDateString()}</h3>
                  <p className="text-sm text-gray-500 mt-1">{history.id}</p>
                </div>
                {history.payrolls.length > 0 && (
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    See Details
                  </button>
                )}
              </div>

             
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

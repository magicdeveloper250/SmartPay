import { PlusIcon } from "lucide-react";

export default async function EmployeeDetails({ employeeId }: { employeeId: string }) {
  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-4">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-6">
        <span>ID</span>
      <h5 className="text-sm font-semibold">

            <b>{employeeId}</b>
        </h5>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      
        <div>
          <h2 className="text-lg font-semibold mb-4">Order Details</h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium">Sports Jacket</span>
              <span className="text-gray-600"> - Fashion</span>
              <span className="block text-gray-600">1pcs - $120.99</span>
            </div>
            <div>
              <span className="font-medium">Created at:</span>
              <span className="text-gray-600"> March 03, 2024</span>
            </div>
             
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium">Customer name:</span>
              <span className="text-gray-600"> Cameron Williamson</span>
            </div>
            <div>
              <span className="font-medium">Email:</span>
              <span className="text-gray-600"> cameronwilliamson@mail.com</span>
            </div>
            <div>
              <span className="font-medium">Phone:</span>
              <span className="text-gray-600"> (+1) 840-492-1485</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 space-y-4">
        {/* Benefits Section */}
        <details className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <summary className="flex justify-between items-center p-4 cursor-pointer list-none">
            <h2 className="text-lg font-semibold text-gray-800">Benefits</h2>
            <span className="text-gray-500 transition-transform duration-200 group-open:rotate-180">▼</span>
          </summary>
          <div className="px-4 pb-4 space-y-3">
            <div className="text-gray-600">Timeline item 1</div>
            <div className="text-gray-600">Timeline item 2</div>
            <div className="text-gray-600">Timeline item 3</div>
            <div className="text-gray-600">Timeline item 4</div>
          </div>
        </details>

        {/* Taxes Section */}
        <details className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <summary className="flex justify-between items-center p-4 cursor-pointer list-none">
            <h2 className="text-lg font-semibold text-gray-800">Taxes</h2>
            <span className="text-gray-500 transition-transform duration-200 group-open:rotate-180">▼</span>
          </summary>
          <div className="px-4 pb-4 space-y-3">
            <div className="text-gray-600">Timeline item 1</div>
            <div className="text-gray-600">Timeline item 2</div>
            <div className="text-gray-600">Timeline item 3</div>
            <div className="text-gray-600">Timeline item 4</div>
          </div>
        </details>
      </div>

     
    </div>
  );
}
import { PlusIcon } from "lucide-react";

export default async function EmployeeDetails({ employeeId }: { employeeId: string }) {
  return (
    <div className="w-full max-w-10 mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          The Employee ID is <b>{employeeId}</b>
        </h1>
        <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Benefit/Tax
        </button>
      </div>

      {/* Details Section */}
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
            <div>
              <span className="font-medium">Delivery Services:</span>
              <span className="text-gray-600"> Express</span>
            </div>
            <div>
              <span className="font-medium">Payment method:</span>
              <span className="text-gray-600"> Bank Transfer</span>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <span className="text-green-600"> Processed</span>
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

      {/* Timeline Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Timeline</h2>
        <div className="space-y-3">
          {/* Timeline items can be added here */}
          <div className="text-gray-600">Timeline item 1</div>
          <div className="text-gray-600">Timeline item 2</div>
        </div>
      </div>

      {/* Toolbar for Adding Benefits and Taxes */}
      <div className="flex justify-end space-x-4">
        <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Benefit
        </button>
        <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Tax
        </button>
      </div>
    </div>
  );
}
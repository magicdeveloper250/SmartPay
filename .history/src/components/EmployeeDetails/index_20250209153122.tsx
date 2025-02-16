import { getEmployee } from "@/actions/employeeActions";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";

export default async function EmployeeDetails({ employeeId }: { employeeId: string }) {
  const employee = await getEmployee(employeeId);
  if ("error" in employee) {
    notFound();
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
      <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-3 mb-3">
        <span className="font-medium">ID:</span>
        <span className="text-gray-600">{employee.id}</span>
        <span className="font-medium">First name:</span>
        <span className="text-gray-600">{employee.firstName}</span>
        <span className="font-medium">Second name:</span>
        <span className="text-gray-600">{employee.secondName}</span>
        <span className="font-medium">Phone:</span>
        <span className="text-gray-600">{employee.phoneNumber}</span>
      </div>
      
      {employee.benefits.length > 0 && (
        <div>
          <div className="w-full flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Benefits</h2>
            <button><Plus className="w-5 h-5" /></button>
          </div>
          <ul className="list-disc pl-5 text-gray-600">
            {employee.benefits.map((benefit, index) => (
              <li key={index}>{benefit.id}</li>
            ))}
          </ul>
        </div>
      )}
      
      {employee.taxes.length > 0 && (
        <div className="mt-4">
          <div className="w-full flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Taxes</h2>
            <Plus className="w-5 h-5" />
          </div>
          <ul className="list-disc pl-5 text-gray-600">
            {employee.taxes.map((tax, index) => (
              <li key={index}>{tax.id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

import { getEmployee } from "@/actions/employeeActions";
import { notFound } from "next/navigation";


export default async function EmployeeDetails({ employeeId }: { employeeId: string }) {

  const employee= await getEmployee(employeeId)
  if('error' in employee){
    notFound()
  }
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
          <h2 className="text-lg font-semibold mb-4">Employee Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 mb-3">
              <span className="font-medium">First name:</span>
              <span className="text-gray-600"> {employee.firstName}</span>
            
              <span className="font-medium">Second name:</span>
              <span className="text-gray-600"> {employee.secondName}</span>
           
              <span className="font-medium">Phone:</span>
              <span className="text-gray-600"> {employee.phoneNumber}</span>
            
          </div>
        </div>
      </div>
    {/* <Accordion items={employee}/> */}
      
    </div>
  );
}
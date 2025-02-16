import { getEmployee } from "@/actions/employeeActions";
import { notFound } from "next/navigation";
import Accordion from "../ui/accordion";


export default async function EmployeeDetails({ employeeId }: { employeeId: string }) {

  const employee= await getEmployee(employeeId)
  if('error' in employee){
    notFound()
  }
  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-4">
      

        <div>
          <h2 className="text-lg font-semibold mb-4">Employee Details</h2>
          <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-3 mb-3">
              <span className="font-medium">ID:</span>
              <span className="text-gray-600"> {employee.id}</span>
              <span className="font-medium">First name:</span>
              <span className="text-gray-600"> {employee.firstName}</span>
            
              <span className="font-medium">Second name:</span>
              <span className="text-gray-600"> {employee.secondName}</span>
           
              <span className="font-medium">Phone:</span>
              <span className="text-gray-600"> {employee.phoneNumber}</span>
            
          </div>
        </div>
      <Accordion items={employee.benefits}/>
      
    </div>
  );
}
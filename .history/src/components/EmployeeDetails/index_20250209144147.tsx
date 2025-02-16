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
          <div className="space-y-3">
            <div>
              <span className="font-medium">Employee name:</span>
              <span className="text-gray-600"> {employee?.firstname}</span>
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
    {/* <Accordion items={employee}/> */}
      
    </div>
  );
}
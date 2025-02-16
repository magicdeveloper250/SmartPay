export async function getEmployee(employeeId:string) {
   
  try {

      
     const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
            include:{
              benefits:true,
              taxes:true,

            }
          });
      
          if (!employee) {
            return { error: "Company not found" };
          }else{
            return {
              employeeData:employee
            }  
          }
    
  } catch (error) {
  return  handleActionsPrismaError(error)
  }
}
"use client";

export default function OnBoarding({ params }: { params: { employeeId: string } }) {
  const { employeeId } = params;
 
  return (
     
        <div >
      <h1>
        The Employee ID is <b>{employeeId}</b>   
      </h1>
    </div>
  );
}

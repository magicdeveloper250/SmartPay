import React from "react";

type Props = Promise<{ employeeId: string }>

export default async function Page( props: { params: Props }) {
  const { employeeId } = await props.params;
  return (
    <div className="bg-slate-500 w-96 text-center my-20 p-10 mx-20">
      <h1>
        The Employee ID is <b>{employeeId}</b>   
      </h1>
    </div>
  );
};

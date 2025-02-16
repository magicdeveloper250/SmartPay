 
"use client"
export function TableButton({text, callBack}:{text:String;
  onClick: ()=>void}){

  return <button onClick={callBack}>
    {text}
  </button>

}
 
"use client"
export function TableButton({text, callBack}:{text:String;
  callBack: ()=>void}){

  return <button onClick={callBack}>
    {text}
  </button>

}
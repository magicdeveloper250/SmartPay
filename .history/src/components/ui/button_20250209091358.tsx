 
export function TableButton({text, onClick}:{text:String;
  onClick: ()=>void}){

  return <button onClick={onClick}>
    {text}
  </button>

}
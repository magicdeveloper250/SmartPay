"use client";
 
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { useEffect } from "react";
 
 

export default function LoginRRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   
  const{data:session}= useSession()
  const router = useRouter()
useEffect(()=>{
  if(! session?.user){
    router.push("/signin")
  }
},[])

  return (
   <>
             
      {children}
   </>
             
  );
}

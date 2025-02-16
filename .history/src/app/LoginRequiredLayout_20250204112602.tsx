"use client";
 
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
 
 
 

export default function LoginRRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   
  const{data:session}= useSession()
  const router = useRouter()
  if(! session?.user){
    router.push("/signin")
  }

  return (
   <>
    <Header />
             
      {children}
   </>
             
  );
}

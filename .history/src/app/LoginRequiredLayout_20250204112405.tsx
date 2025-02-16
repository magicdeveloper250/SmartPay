"use client";
 
import Header from "@/components/Header";
 
 
 

export default function LoginRRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   

  return (
   <>
    <Header />
             
      {children}
   </>
             
  );
}

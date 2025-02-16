"use client";
 
import Header from "@/components/Header";
 
import ToasterContext from "./api/contex/ToasetContex";
import { useEffect, useState } from "react";
 
 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
   <>
    <Header />
             
      {children}
   </>
             
  );
}

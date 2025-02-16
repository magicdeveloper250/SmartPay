"use client";
 
import Header from "@/components/Header";
 
import ToasterContext from "./api/contex/ToasetContex";
import { useEffect, useState } from "react";
 
 

export default function RootLayout({
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

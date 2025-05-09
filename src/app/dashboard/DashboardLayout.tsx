import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";
import React from "react";
import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import { Providers } from "./providers";
import OnBoardingRequiredLayout from "@/components/Layouts/onBoardingRequired";

export const metadata: Metadata = {
  title: {
    template: "%s | impanoPay - Dashboard",
    default: "impanoPay - Dashboard",
  },
  description:
    "impanoPay is a cutting-edge financial technology platform designed to make sending, receiving, and managing funds seamless, secure, and efficient. Experience instant transfers, multi-currency support, and advanced security features today",
};

export default function DashboardLayout({ children }:Readonly<{children:React.ReactNode}>) {
  return (
   
    <OnBoardingRequiredLayout  >
      
            <Providers>
              

              <div className="flex min-h-screen">
                <Sidebar />

                <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
                  <Header />

                  <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                    {children}
                  </main>
                </div>
              </div>
            </Providers>
         
      </OnBoardingRequiredLayout>
  );
}

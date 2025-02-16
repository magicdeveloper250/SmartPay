"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import ToasterContext from "./api/contex/ToasetContex";
import { useEffect, useState } from "react";
import PreLoader from "@/components/Common/PreLoader";
import { Work_Sans } from 'next/font/google'
import NextTopLoader from "nextjs-toploader";

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-work-sans',
})

export default function RootLayout({
  children,
  modal
}: Readonly<{children:React.ReactNode, modal:React.ReactNode}>) {

  

  return (
    <html suppressHydrationWarning={true} className={`!scroll-smooth ${workSans.variable}`} lang="en"  >
      <head />

      <body>
      <NextTopLoader showSpinner={false} />
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              enableSystem={false}
              defaultTheme="light"
            >
              <ToasterContext />
             {modal}
              {children}
              <Footer />
              <ScrollToTop />
            </ThemeProvider>
          </SessionProvider>
        
      </body>
    </html>
  );
}

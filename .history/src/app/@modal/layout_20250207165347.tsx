"use client";

import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import NextTopLoader from "nextjs-toploader";
import Modal from "@/components/Modal";

 

export default function RootLayout({
  children,
}: Readonly<{children:React.ReactNode,}>) {

  

  return (
     <Modal>
      {children}
     </Modal>
  );
}

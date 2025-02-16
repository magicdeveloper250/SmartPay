"use client";

import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { SessionProvider } from "next-auth/react";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import Modal from "@/components/Modal";

 

export default function ModalLayout({
  children,
}: Readonly<{children:React.ReactNode,}>) {

  

  return (
     <Modal>
      {children}
     </Modal>
  );
}

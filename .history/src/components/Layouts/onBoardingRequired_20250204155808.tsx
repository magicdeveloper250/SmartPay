"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentCompany } from "@/hooks/use-current-company";
import Modal from "../Modal";

export default function OnBoardingRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { company, loading } = useCurrentCompany();

  return <>
  {!company?.onBoardingFinished&& <Modal><h1>On boarding</h1></Modal>}
  {children}
  </>;
}

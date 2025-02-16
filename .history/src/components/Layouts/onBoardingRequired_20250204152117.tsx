"use client";
import { useCurrentCompany } from "@/hooks/use-current-company";

export default function OnBoardingRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { company, loading } = useCurrentCompany();

  if (loading) return <h1>Loading...</h1>;

  return company?.onBoardingFinished ? children : <h1>Not boarded</h1>;
}

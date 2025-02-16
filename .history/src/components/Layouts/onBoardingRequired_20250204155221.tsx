"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentCompany } from "@/hooks/use-current-company";

export default function OnBoardingRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { company, loading } = useCurrentCompany();
  const router = useRouter();
  console.log(company?.onBoardingFinished)

  useEffect(() => {
    if (!loading) {
      if (company?.onBoardingFinished) {
        return;
      } else {
        router.push("/onboarding");
      }
    }
  }, [company, loading, router]);

  if (loading) return <h1>Loading...</h1>;

  return <>{children}</>;
}

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

  useEffect(() => {
    if (!loading) {
      if (company?.onBoardingFinished) {
        return;
      } else {
        router.push("/onboarding");
      }
    }
  }, [company, loading, router]);
 

  return <>{children}</>;
}

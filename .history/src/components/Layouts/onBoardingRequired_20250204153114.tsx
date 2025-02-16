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
      if (company?.onboardingFinished) {
        // If onboarding is completed, render the children
        return;
      } else {
        // Redirect to the onboarding route
        router.push("/onboarding");
      }
    }
  }, [company, loading, router]);

  if (loading) return <h1>Loading...</h1>;

  // The children will be rendered only if the onboarding is completed
  return <>{children}</>;
}

"use client";

import { useRouter } from "next/navigation";
import { onBoardingFinished } from "@/actions/companyActions";
import { useEffect } from "react";
import toast from "react-hot-toast";
export default function OnBoardingRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkOnBoardingStatus = async () => {
      try {
        const result = await onBoardingFinished();

        if (typeof result === "boolean" && !result) {
          router.push("/onboarding", { scroll: false });
        }
      } catch (error) {
        toast.error("An error occurred while checking onboarding status");
      }
    };

    checkOnBoardingStatus();
  }, [router]);

  return children;
}
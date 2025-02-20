"use client";

import { useRouter } from "next/navigation";
import { onBoardingFinished } from "@/actions/companyActions";
import { useEffect, useState } from "react";

export default function OnBoardingRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkOnBoardingStatus = async () => {
      const result = await onBoardingFinished();
      console.log(result);

      if (typeof result === "boolean") {
        setIsFinished(result);
        if (!result) {
          router.push("/onboarding", { scroll: false });
        }
      } else {
        console.error("Error checking onboarding status:", result);
      }
    };

    checkOnBoardingStatus();
  }, [router]);

 

  return children;  
}
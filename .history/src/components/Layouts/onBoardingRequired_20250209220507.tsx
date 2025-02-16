"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
 
import { getCurrentCompany } from "@/actions/companyActions";
import toast from "react-hot-toast";

import type { CompanyWithCount } from "@/types/companyWithCompny";

export default function OnBoardingRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [company, setCompany] = useState<CompanyWithCount | null>(null);
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  // Fetch the current company
  const getCompany = () => {
    startTransition(async () => {
      const resp = await getCurrentCompany();
      if ("error" in resp) {
        toast.error(resp.error);
      } else {
        setCompany(resp);
      }
    });
  };

  // Fetch company data on component mount
  useEffect(() => {
    getCompany();
  }, []);

  // Handle onboarding logic
  useEffect(() => {
    if (!loading && company) {
      const employeesCount = company._count?.employees ?? 0;
      const contractorsCount = company._count?.contractors ?? 0;

      if (company.onBoardingFinished && (employeesCount > 0 || contractorsCount > 0)) {
        // Onboarding is complete, do nothing
        return;
      } else {
        // Redirect to onboarding page if onboarding is not finished
        router.push("/onboarding", { scroll: false });
      }
    }
  }, [company, loading, router]);

  return <>{children}</>;
}
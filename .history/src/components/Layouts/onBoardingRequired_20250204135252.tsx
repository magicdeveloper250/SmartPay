 
import { useCurrentCompany } from "@/hooks/use-current-company";
import { useRouter } from "next/router";

export default async function OnBoardingRRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   
   const company= await useCurrentCompany()
   const router=useRouter()
  if(!company?.onBoardingFinished)
    router.push("/onboarding")

  return (
   <>
             
      {children}
   </>
             
  );
}

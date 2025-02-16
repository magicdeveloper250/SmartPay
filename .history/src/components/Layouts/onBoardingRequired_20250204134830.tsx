 
import { useCurrentCompany } from "@/hooks/use-current-company";

export default function OnBoardingRRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   
   const company= useCurrentCompany()
   console.log(company)
  return (
   <>
             
      {children}
   </>
             
  );
}

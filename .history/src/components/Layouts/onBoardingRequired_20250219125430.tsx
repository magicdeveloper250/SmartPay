 
import { onBoardingFinished } from "@/actions/companyActions";
import { useRouter } from "next/router";

export default  async function OnBoardingRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const finished= await onBoardingFinished();
  const router = useRouter();
 
      if ( finished) {
        return <>{children}</>;
      } else {
        router.push("/onboarding",  );
      }
  
 

 
}

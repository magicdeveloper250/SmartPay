import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onBoardingFinished } from "@/actions/companyActions";

export default  async function OnBoardingRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const finished= await onBoardingFinished();
  const router = useRouter();

  useEffect(() => {
      if ( finished) {
        return;
      } else {
        router.push("/onboarding", {scroll:true});
      }
  });
 

  return <>{children}</>;
}

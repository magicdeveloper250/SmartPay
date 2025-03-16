import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";
import OTPInput from "@/components/OTP";

export const metadata: Metadata = {
  title: "Verify OTP | Enter Your OTP code.",
  description:
    "For the sake of your account security, we ask for otp code for confirming authenticity",
  keywords:
    "ImpanoPay login, OTP Code, payroll dashboard access, employee payment management, payroll processing portal",
  openGraph: {
    title: "Verify OTP | Enter Your OTP code.",
    description:
      "For the sake of your account security, we ask for otp code for confirming authenticity",
    images: ["/images/impanopay-signin-secure.jpg"],
  },
};

const VerifyOTPPage = async ({
  searchParams,
}: {
  searchParams: { identifier?: string; callback?: string };
}) => {
  const identifier = searchParams.identifier || "";
  const callback = searchParams.callback || "/dashboard"; 
  const decodedIdentifier = (() => {
    try {
      return identifier ? atob(identifier) : "";
    } catch (error) {
      console.error("Invalid base64 encoding in identifier:", error);
      return "";
    }
  })();
  

  return (
    <>
      <Breadcrumb pageName="Verify Your Identity." />

      <div className="flex justify-center pb-10">
        <OTPInput identifier={decodedIdentifier} callback={callback} />
      </div>
    </>
  );
};

export default VerifyOTPPage;

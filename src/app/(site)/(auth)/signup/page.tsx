import SignUp from "@/components/Auth/SignUp";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: 'Sign Up for ImpanoPay | Streamline Your Payroll Today',
  description: 'Join ImpanoPay and start managing your company\'s payroll with ease. Simple registration process with powerful payroll management tools.',
  keywords: 'ImpanoPay sign up, payroll service registration, create payroll account, HR solutions registration',
  openGraph: {
    title: 'Sign Up for ImpanoPay | Streamline Your Payroll Today',
    description: 'Join ImpanoPay and start managing your company\'s payroll with ease. Simple registration process with powerful payroll management tools.',
    images: ['/images/impanopay-signup-banner.jpg'],
  }
}
const SignupPage = () => {
  return (
    <>
      <Breadcrumb pageName="Sign Up" />

      <SignUp />
    </>
  );
};

export default SignupPage;

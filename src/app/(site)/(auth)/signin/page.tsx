import Signin from "@/components/Auth/Login";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: 'Sign In to ImpanoPay | Access Your Payroll Dashboard',
  description: 'Securely access your ImpanoPay dashboard to process payroll, manage employee information, and generate payroll reports.',
  keywords: 'ImpanoPay login, payroll dashboard access, employee payment management, payroll processing portal',
  openGraph: {
    title: 'Sign In to ImpanoPay | Access Your Payroll Dashboard',
    description: 'Securely access your ImpanoPay dashboard to process payroll, manage employee information, and generate payroll reports.',
    images: ['/images/impanopay-signin-secure.jpg'],
  }
}

const SigninPage = () => {
  return (
    <>
      <Breadcrumb pageName="Sign In" />

      <Signin />
    </>
  );
};

export default SigninPage;

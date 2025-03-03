import Breadcrumb from "@/components/Common/Breadcrumb";
import NotFound from "@/components/NotFound";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: 'Error | ImpanoPay Payroll Services',
  description: 'We apologize for the inconvenience. Please try again or contact our payroll support team for assistance with ImpanoPay services.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Error | ImpanoPay Payroll Services',
    description: 'We apologize for the inconvenience. Please try again or contact our payroll support team for assistance with ImpanoPay services.',
    images: ['/images/impanopay-support-help.jpg'],
  }
}

const ErrorPage = () => {
  return (
    <>
      <Breadcrumb pageName="404" />

      <NotFound />
    </>
  );
};

export default ErrorPage;

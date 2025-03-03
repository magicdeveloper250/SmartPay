import Breadcrumb from "@/components/Common/Breadcrumb";
import Faq from "@/components/Faq";
import Pricing from "@/components/Pricing";
import { Metadata } from "next";

 
export const metadata:Metadata = {
  title: 'ImpanoPay Pricing | Affordable Payroll Services',
  description: 'Explore ImpanoPay\'s cost-effective payroll management pricing plans designed to fit businesses of all sizes with transparent pricing.',
  keywords: 'ImpanoPay pricing, payroll service plans, employee payment processing, payroll subscription plans',
  openGraph: {
    title: 'ImpanoPay Pricing | Affordable Payroll Services',
    description: 'Explore ImpanoPay\'s cost-effective payroll management pricing plans designed to fit businesses of all sizes with transparent pricing.',
    images: ['/images/impanopay-pricing-comparison.jpg'],
  }
}
const PricingPage = () => {
  return (
    <>
      <Breadcrumb pageName="Pricing" />
      <Pricing />
      <Faq />
    </>
  );
};

export default PricingPage;

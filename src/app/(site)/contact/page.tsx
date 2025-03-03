import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: 'Contact ImpanoPay | Payroll Support & Assistance',
  description: 'Connect with our payroll experts for assistance with ImpanoPay services. Get help with payroll processing, setup, and management.',
  keywords: 'contact ImpanoPay, payroll support, payroll assistance, technical support, employee payment help',
  openGraph: {
    title: 'Contact ImpanoPay | Payroll Support & Assistance',
    description: 'Connect with our payroll experts for assistance with ImpanoPay services. Get help with payroll processing, setup, and management.',
    images: ['/images/impanopay-contact-support.jpg'],
  }
}

const ContactPage = () => {
  return (
    <>
      <Breadcrumb pageName="Contact" />

      <Contact />
    </>
  );
};

export default ContactPage;

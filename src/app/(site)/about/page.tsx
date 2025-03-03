import About from "@/components/About";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Team from "@/components/Team";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: 'About ImpanoPay | Simplified Payroll Management',
  description: 'Learn about ImpanoPay, our mission to provide streamlined payroll management services with ease for businesses of all sizes.',
  keywords: 'ImpanoPay, payroll platform, payroll management, about us, payroll services',
  openGraph: {
    title: 'About ImpanoPay | Simplified Payroll Management',
    description: 'Learn about ImpanoPay, our mission to provide streamlined payroll management services with ease for businesses of all sizes.',
    images: ['/images/impanopay-about-banner.jpg'],
  }
}

const AboutPage = () => {
  return (
    <main>
      <Breadcrumb pageName="About Us" />
      <About />
      <Team />
    </main>
  );
};

export default AboutPage;

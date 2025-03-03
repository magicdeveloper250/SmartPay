import About from "@/components/About";
import HomeBlogSection from "@/components/Blog/HomeBlogSection";
import CallToAction from "@/components/CallToAction";
import Clients from "@/components/Clients";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Faq from "@/components/Faq";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import { getAllPosts } from "@/utils/markdown";
import { Metadata } from "next";
import HeaderLayout from "./headerLayout";

export const metadata:Metadata = {
  title: 'Welcome to ImpanoPay | Intelligent Payroll Solutions',
  description: 'Transform your payroll process with ImpanoPay. Our cloud-based platform combines automation, accuracy, and compliance to deliver seamless payroll management.',
  robots: 'index, follow',
  openGraph: {
    title: 'Welcome to ImpanoPay | Intelligent Payroll Solutions',
    description: 'Transform your payroll process with ImpanoPay. Our cloud-based platform combines automation, accuracy, and compliance to deliver seamless payroll management.',
    images: ['/images/logo/logo.svg'],
  }
}

export default function Home() {
  const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);

  return (
   <HeaderLayout>
     <main>
      <ScrollUp />
      <Hero />
      <Features />
      <About />
      <CallToAction />
      <Pricing />
      <Testimonials />
      <Faq />
      <Team />
      <HomeBlogSection posts={posts} />
      <Contact />
      <Clients />
    </main>
   </HeaderLayout>
  );
}

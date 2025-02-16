import { Feature } from "@/types/feature";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: (
      <svg width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12l-9 5-9-5V7l9 5 9-5v5z" />
      </svg>
    ),
    title: "Instant Money Transfers",
    paragraph: "Transfer funds instantly between Sawa Pay users, banks, and mobile wallets with competitive exchange rates.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 2,
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2c5.523 0 10 4.477 10 10S17.523 22 12 22 2 17.523 2 12 6.477 2 12 2zm0 18c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8z" />
      </svg>
    ),
    title: "Multi-Currency Support",
    paragraph: "Seamless transactions in multiple currencies with real-time conversion and minimal fees.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 3,
    icon: (
      <svg width="37" height="37" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2c-5.528 0-10 4.471-10 10s4.472 10 10 10 10-4.471 10-10-4.472-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zM11 7h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    ),
    title: "Enhanced Security",
    paragraph: "End-to-end encryption, multi-factor authentication, and AI-powered fraud prevention for secure transactions.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 4,
    icon: (
      <svg width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zM13 7h-2v6h2zm0 8h-2v2h2z" />
      </svg>
    ),
    title: "User-Friendly Interface",
    paragraph: "Intuitive design with mobile-friendly navigation and a customizable dashboard for financial management.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 5,
    icon: (
      <svg width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 9v-6h-4v6h-3v10h10v-10h-3zm-2-4v4h-4v-4h4z" />
      </svg>
    ),
    title: "Bill Payments & Recharge",
    paragraph: "Pay utility bills, subscriptions, and top-up mobile airtime seamlessly across providers.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 6,
    icon: (
      <svg width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 2v2h-3v10H9V4H6V2h3V0h6v2h3zm-6 3v8h2V5h-2zm-4 8v2h4v-2H8zm0 4v2h8v-2H8z" />
      </svg>
    ),
    title: "Merchant & Business Solutions",
    paragraph: "Integrate Sawa Pay with your e-commerce or POS, automate invoicing, and access custom APIs for business transactions.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 7,
    icon: (
      <svg width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2c-5.528 0-10 4.471-10 10s4.472 10 10 10 10-4.471 10-10-4.472-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-9h2v4h-2zm0 6h2v2h-2z" />
      </svg>
    ),
    title: "Savings & Investment Options",
    paragraph: "Grow your wealth with interest-earning savings and secure digital investment opportunities.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 8,
    icon: (
      <svg width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12l9-5v10zm11 5v-10l9 5z" />
      </svg>
    ),
    title: "24/7 Customer Support",
    paragraph: "Dedicated support via chat, email, and phone, plus a comprehensive help center with FAQs.",
    btn: "Learn More",
    btnLink: "/#",
  },
];

export default featuresData;

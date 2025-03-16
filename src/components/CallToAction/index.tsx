import Link from "next/link";

const CallToAction = () => {
  return (
    <section className="relative z-10 bg-gradient-to-r from-primary to-secondary py-20 lg:py-[115px]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white md:text-5xl leading-tight">
            Effortless & Secure Transactions with{" "}
            <span className="text-[#0BB489]">impanoPay</span>
          </h2>
          <p className="mt-4 text-lg text-gray-200">
            Experience seamless cross-border payments, instant transactions, and 
            robust security with <span className="font-semibold text-white">impanoPay</span>. 
            Whether you&apos;re sending money, managing payroll, or making global business payments, 
            we ensure fast, low-cost, and reliable transfers.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="inline-block rounded-lg bg-white text-primary font-semibold px-6 py-3 shadow-md transition hover:bg-gray-100"
            >
              Get Started
            </Link>
            <Link
              href="/business-solutions"
              className="inline-block rounded-lg border border-white text-white px-6 py-3 font-semibold transition hover:bg-white hover:text-primary"
            >
              Explore Business Solutions
            </Link>
          </div>
        </div>
      </div>
      {/* Decorative Elements */}
      <div className="absolute left-0 top-0 opacity-20">
        <svg width="495" height="470" viewBox="0 0 495 470" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="55" cy="442" r="138" stroke="white" strokeOpacity="0.04" strokeWidth="50" />
          <circle cx="446" r="39" stroke="white" strokeOpacity="0.04" strokeWidth="20" />
          <path d="M245.406 137.609L233.985 94.9852L276.609 106.406L245.406 137.609Z" stroke="white" strokeOpacity="0.08" strokeWidth="12" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 opacity-20">
        <svg width="493" height="470" viewBox="0 0 493 470" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="462" cy="5" r="138" stroke="white" strokeOpacity="0.04" strokeWidth="50" />
          <circle cx="49" cy="470" r="39" stroke="white" strokeOpacity="0.04" strokeWidth="20" />
          <path d="M222.393 226.701L272.808 213.192L259.299 263.607L222.393 226.701Z" stroke="white" strokeOpacity="0.06" strokeWidth="13" />
        </svg>
      </div>
    </section>
  );
};

export default CallToAction;

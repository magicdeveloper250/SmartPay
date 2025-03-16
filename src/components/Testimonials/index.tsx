import { Testimonial } from "@/types/testimonial";
import SectionTitle from "../Common/SectionTitle";
import SingleTestimonial from "./SingleTestimonial";

const testimonialData: Testimonial[] = [
  {
    id: 1,
    name: "Amina M.",
    designation: "Business Owner @ Nairobi Tech",
    content:
      "impanoPay has transformed how I manage payments for my employees. The payroll system is intuitive and ensures timely and accurate payouts.",
    image:  "/images/testimonials/author-01.png",
    star: 5,
  },
  {
    id: 2,
    name: "Kwame A.",
    designation: "Driver @ Accra Rides",
    content:
      "As a gig worker, accessing financial services through impanoPay has been life-changing. Saving and borrowing are now so much easier.",
    image: "/images/testimonials/author-01.png",
    star: 5,
  },
  {
    id: 3,
    name: "Fatima S.",
    designation: "HR Manager @ Kigali Solutions",
    content:
      "With impanoPay, payroll processing has never been smoother. It saves time and helps us focus on growing our business.",
    image:  "/images/testimonials/author-01.png",
    star: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gray-1 py-20 dark:bg-dark-2 md:py-[120px]">
      <div className="container px-4">
        <SectionTitle
          subtitle="Testimonials"
          title="What Our Clients Say"
          paragraph="Discover how impanoPay has empowered businesses and gig workers across Africa with innovative financial solutions."
          width="640px"
          center
        />

        <div className="mt-[60px] flex flex-wrap lg:mt-20 gap-y-8">
          {testimonialData.map((testimonial, i) => (
            <SingleTestimonial key={i} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

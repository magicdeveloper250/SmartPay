import HeaderLayout from "@/app/headerLayout";
import SingleBlog from "@/components/Blog/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { getAllPosts } from "@/utils/markdown";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: 'ImpanoPay Blog | Payroll Insights & Best Practices',
  description: 'Stay informed with the latest payroll trends, compliance updates, and tips for efficiently managing employee payments and benefits.',
  keywords: 'ImpanoPay blog, payroll tips, payroll compliance, employee benefits, payroll management insights',
  openGraph: {
    title: 'ImpanoPay Blog | Payroll Insights & Best Practices',
    description: 'Stay informed with the latest payroll trends, compliance updates, and tips for efficiently managing employee payments and benefits.',
    images: ['/images/impanopay-blog-featured.jpg'],
  }
}
const Blog = () => {
  const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);

  return (
    <HeaderLayout>
         <Breadcrumb pageName="Blogs" />

<section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
  <div className="container">
    <div className="-mx-4 flex flex-wrap justify-center">
      {posts.map((blog, i) => (
        <div key={i} className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3">
          <SingleBlog blog={blog} />
        </div>
      ))}
    </div>
  </div>
</section>
    </HeaderLayout>
  );
};

export default Blog;

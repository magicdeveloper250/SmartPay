import React from "react";
import ResetPassword from "@/components/Auth/ResetPassword";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Play SaaS Starter Kit and Boilerplate for Next.js",
};

interface ResetPasswordPageProps {
  params: { token: string };
}

const ResetPasswordPage = ({ params }: ResetPasswordPageProps) => {
  return (
    <>
      <Breadcrumb pageName="Reset Password" />
      <ResetPassword token={params.token} />
    </>
  );
};

export default ResetPasswordPage;
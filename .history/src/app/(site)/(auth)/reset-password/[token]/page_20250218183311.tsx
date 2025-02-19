import React from "react";
import ResetPassword from "@/components/Auth/ResetPassword";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Play SaaS Starter Kit and Boilerplate for Next.js",
};

const  ResetPasswordPage = async( props: {
  searchParams?: Promise<{
  token?: string;
  }>;
}) => {
  const searchParams = await props.searchParams || {};
  return (
    <>
      <Breadcrumb pageName="Reset Password" />
      <ResetPassword token={searchParams.token || ""} />
    </>
  );
};

export default ResetPasswordPage;

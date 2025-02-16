import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { EmployeesTable } from "@/components/Tables/employees";
import { InvoiceTable } from "@/components/Tables/invoice-table";
import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { TopProducts } from "@/components/Tables/top-products";
import { TopProductsSkeleton } from "@/components/Tables/top-products/skeleton";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tables",
};

const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Employees" />

      <div className="space-y-10">
         <EmployeesTable/>
      </div>
    </>
  );
};

export default TablesPage;

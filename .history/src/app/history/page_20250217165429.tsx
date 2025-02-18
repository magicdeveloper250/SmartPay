import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {FitModal} from "@/components/Modal";
import { PayrollHistory } from "@/components/PayHistory";
import { Suspense } from "react";

interface PageProps {
  params: {
    employeeId?: string;
  };
}

export default async function Page(props: {
  searchParams?: Promise<{
    page?: string;
  }>;
}){
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  return (
    <FitModal
      title="Recents Payrolls" 
      backButtonDisabled={true}
      width="xl"
    >
       <Suspense fallback={<EmployeeDetailsSkeleton/>}>
        <PayrollHistory currentPage={currentPage}/>
        
       </Suspense>
    </FitModal>
  );
}

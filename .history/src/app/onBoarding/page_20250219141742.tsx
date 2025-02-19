import OnBoarding from "@/components/OnBoarding";
import { Suspense } from "react";
import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";

export default async function Page() {
   
  
  return (
    <Suspense fallback={<EmployeeDetailsSkeleton/>}>
    <OnBoarding/>
    </Suspense>
  );
}

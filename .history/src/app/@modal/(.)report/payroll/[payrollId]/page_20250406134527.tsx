import EmployeeDetails from "@/components/EmployeeDetails";
import { EmployeeDetailsSkeleton } from "@/components/EmployeeDetails/skeleton";
import {DetailsModal, Modal} from "@/components/Modal";
import PayrollReportDetails from "@/components/ReportDetails";
import { Suspense } from "react";

type Props = Promise<{ payrollId: string }>

export default async function Page( props: { params: Props }) {
  const { payrollId } = await props.params;
  return (
    <Suspense fallback={<EmployeeDetailsSkeleton/>}>
    <PayrollReportDetails employeeId={payrollId ||""}/>
     
    </Suspense>
  );
}

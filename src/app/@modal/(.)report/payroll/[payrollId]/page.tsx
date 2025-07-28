 
import PayHistorySkeleton from "@/components/PayHistory/PayHistorySkeleton";
import PayrollReportDetails from "@/components/ReportDetails";
import { Suspense } from "react";

type Props = Promise<{ payrollId: string }>

export default async function Page( props: { params: Props }) {
  const { payrollId } = await props.params;
  return (
  
    <PayrollReportDetails payrollId={payrollId ||""}/>
     
     
  );
}

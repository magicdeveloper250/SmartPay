import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { UsedDevices } from "@/components/Charts/used-devices";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { TopEmployees } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { ChatsCard } from "./_components/chats-card";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import DashboardLayout from "../DashboardLayout";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { PayrollTimeRange } from "@/types/payroll";

 
type Props = Promise<{selected_time_frame?: string }>

export default async function Page( props: { params: Props }) {
  const { selected_time_frame } = await props.params;
 
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
   <Suspense fallback={<DashboardSkeleton/>}>
     <DashboardLayout>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <PaymentsOverview
          className="col-span-12 xl:col-span-7"
          key={extractTimeFrame("payments_overview")}
          timeFrame={extractTimeFrame("payments_overview")?.split(":")[1] as unknown as PayrollTimeRange}
        />

        <WeeksProfit
          key={extractTimeFrame("weeks_profit")}
          className="col-span-12 xl:col-span-5"
        />

       

        <div className="col-span-12 grid xl:col-span-8">
          <Suspense fallback={<TopChannelsSkeleton />}>
            <TopEmployees />
          </Suspense>
        </div>

     
      </div>
    </DashboardLayout>
   </Suspense>
  );
}

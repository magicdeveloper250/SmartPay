import { cn } from "@/lib/utils";
import { WeeksProfitChart } from "./chart";
import { StatusPicker } from "@/components/status-picker";
import { PaymentStatus } from "@prisma/client";
import { getDailyPaymentData } from "@/actions/dashboardActions";

type PropsType = {
  payrollType?: PaymentStatus;
  className?: string;
};

export async function WeeksProfit({ className, payrollType }: PropsType) {
  const rawData = await getDailyPaymentData(payrollType) as {
    data:{
      Payment?: { x: string, y: number }[],
    Paid?: { x: string, y: number }[],
    Pending?: { x: string, y: number }[],
    Cancelled?: { x: string, y: number }[],
    Failed?: { x: string, y: number }[],
    Ready?: { x: string, y: number }[],
    }
  };
  const transformData = (data?: { x: string, y: number }[]) => {
    return data ? data.map(item => ({ x: item.x, y: item.y })) : [];
  };

  const data = {
    Payment: transformData(rawData.data.Payment),
    Paid: transformData(rawData.data.Paid),
    Pending: transformData(rawData.data.Pending),
    Cancelled: transformData(rawData.data.Cancelled),
    Failed: transformData(rawData.data.Failed),
    Ready: transformData(rawData.data.Ready),
  };

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Total {payrollType || "Payrolls"}
        </h2>

        <StatusPicker
          items={ Object.values(PaymentStatus)}
          defaultValue={payrollType ||PaymentStatus.Paid}
          sectionKey="payroll_summary"
        />
      </div>

      <WeeksProfitChart data={data} />
    </div>
  );
}
 


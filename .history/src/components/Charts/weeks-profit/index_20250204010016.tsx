import { PeriodPicker } from "@/components/period-picker";
import { cn } from "@/lib/utils";
import { getWeeksProfitData } from "@/services/charts.services";
import { WeeksProfitChart } from "./chart";
import { StatusPicker } from "@/components/status-picker";

type PropsType = {
  payrollType?: string;
  className?: string;
};

export async function WeeksProfit({ className, payrollType }: PropsType) {
  const data = await getWeeksProfitData(payrollType);

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Total {payrollType || "Payment"}
        </h2>

        <StatusPicker
          items={["Payment", "Paid", "Pending",]}
          defaultValue={payrollType || "Payment"}
          sectionKey="payroll_summary"
        />
      </div>

      <WeeksProfitChart data={data} />
    </div>
  );
}

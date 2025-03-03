import { PeriodPicker } from "@/components/period-picker";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { PaymentsOverviewChart } from "./chart";
import { getPayrollHistoryData } from "@/actions/dashboardActions";
import { PayrollTimeRange, PayrollHistoryData} from "@/types/payroll";

type PropsType = {
  timeFrame?: PayrollTimeRange;
  payType?: string;
  className?: string;
};

export async function PaymentsOverview({
  timeFrame = PayrollTimeRange.THISMONTH,
  className,
}: PropsType) {
  const response = await getPayrollHistoryData(timeFrame);
  if ('error' in response) {
    return null;
  }
  const data: PayrollHistoryData = response;


  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Payroll History
        </h2>

        <PeriodPicker defaultValue={timeFrame} sectionKey="payroll_history" items={Object.values(PayrollTimeRange) as PayrollTimeRange[]} />
      </div>

      <PaymentsOverviewChart {...data} />

      <dl className="grid divide-stroke text-center dark:divide-dark-3 sm:grid-cols-2 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3">
          <dt className="text-xl font-bold text-dark dark:text-white">
          {data.currency}{standardFormat(data.paidAmounts.reduce((acc, amount) => acc + amount, 0))}
          </dt>
          <dd className="font-medium dark:text-dark-6">Paid Amount</dd>
        </div>

        <div>
          <dt className="text-xl font-bold text-dark dark:text-white">
          {data.currency}{standardFormat(data.dueAmounts.reduce((acc, amount) => acc + amount, 0))}
          </dt>
          <dd className="font-medium dark:text-dark-6">Due Amount</dd>
        </div>
      </dl>
    </div>
  );
}

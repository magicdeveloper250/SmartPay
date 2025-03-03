import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import { getOverviewData } from "@/actions/dashboardActions";
import { UserCheck, Users, ListCheck } from "lucide-react";

export async function OverviewCardsGroup() {
  const overviewData = await getOverviewData();

  if ("error" in overviewData) {
    return <div className="text-red-500">Error: {overviewData.error}</div>;
  }

  const { users, payrolls } = overviewData;
  

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-2 xl:grid-cols-2 2xl:gap-7.5 place-content-center">
      <OverviewCard
        label="Total Employees"
        data={{
          value: compactFormat(users.employees.value),
          growthRate: users.employees.growthRate,
        }}
        Icon={Users}
      />
      <OverviewCard
        label="Total Contractors"
        data={{
          value: compactFormat(users.contractors.value),  
          growthRate: users.contractors.growthRate,  
        }}
        Icon={UserCheck}
      />

      <OverviewCard
        label="Total Payrolls"
        data={{
          value: compactFormat(payrolls.count),  
          growthRate: payrolls.employees.growthRate,  
        }}
        Icon={ListCheck}
      />
    </div>
  );
}
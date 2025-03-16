import { prisma } from "@/utils/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { handleActionsPrismaError } from "@/lib/error-handler";
import { MainPayroll, PaymentStatus, PayrollType,} from "@prisma/client";
import { PayrollHistoryData, PayrollTimeRange } from "@/types/payroll";
type OverviewData = {
  views: {
    value: number;
    growthRate: number;
  };
  profit: {
    value: number;
    growthRate: number;
  };
  products: {
    value: number;
    growthRate: number;
  };
  users: {
    employees: {
      value: number;
      growthRate: number;
    };
    contractors: {
      value: number;
      growthRate: number;
    };
  };
  payrolls: {
    count:number,
    employees: {
      value: number;
      growthRate: number;
    };
   
  };
};

type ErrorResponse = {
  error: string;
};

export interface DailyPaymentData {
  days: string[];
  readyAmounts: number[];
  paidAmounts: number[];
  pendingAmounts: number[];
  cancelledAmounts: number[];
  failedAmounts: number[];
  totalReady: number;
  totalPaid: number;
  totalPending: number;
  totalCancelled: number;
  totalFailed: number;
  currency: string;
  weekStart: string;
  weekEnd: string;
  filteredStatus?: PaymentStatus;
}

export interface DailyPaymentChartData {
  data: {
    Payment: { x: string; y: number }[];
    Paid: { x: string; y: number }[];
    Pending: { x: string; y: number }[];
    Cancelled: { x: string; y: number }[];
    Failed: { x: string; y: number }[];
    Ready: { x: string; y: number }[];
  };
  totals: {
    total: number;
    paid: number;
    pending: number;
    cancelled: number;
    failed: number;
    ready: number;
  };
  currency: string;
  weekStart: string;
  weekEnd: string;
  filteredStatus?: PaymentStatus;
}

export async function getOverviewData(): Promise<OverviewData | ErrorResponse> {
  const session = await getServerSession(authOptions);

  try {
    if (!session?.user?.email) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include:{
        company:{
          include: {
            employees: {
              select: { createdAt: true, monthlyGross: true },
            },
            contractors: {
              select: { createdAt: true,},
            },
            payrolls: {
              select: { 
                id: true,
                paymentDate: true,
                status: true,
                createdAt: true, 
                updatedAt: true,
                companyId: true,
                payrollType: true,
                totalNetAmount: true,
                totalGrossAmount: true,
                totalTaxesAmount: true,
                totalAdditionalIncomeAmount: true,
                totalDeductionAmount: true
              },
            }
          },
        }
      }
    });

    if (!user|| !user.company) {
      return { error: "Company not found" };
    }

    const calculateMonthlyGrowth = (records: { createdAt: Date }[]) => {
      const monthlyCounts: { [key: string]: number } = {};

      records.forEach((record) => {
        const month = record.createdAt.toISOString().slice(0, 7);  
        monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
      });

      const sortedMonths = Object.keys(monthlyCounts).sort();
      const growthRates: number[] = [];

      for (let i = 1; i < sortedMonths.length; i++) {
        const prevCount = monthlyCounts[sortedMonths[i - 1]];
        const currentCount = monthlyCounts[sortedMonths[i]];
        const growthRate = ((currentCount - prevCount) / prevCount) * 100;
        growthRates.push(growthRate);
      }

      const averageGrowthRate = growthRates.reduce((a, b) => a + b, 0) / growthRates.length || 0;
      return averageGrowthRate;
    };

    


    const calculatePayrollMonthlyGrowth = (payrolls: MainPayroll[]) => {
      const monthlyPayrolls: { [key: string]: number } = {};
      
      payrolls.forEach((payroll) => {
        const month = payroll.createdAt.toISOString().slice(0, 7); 
        const amount = payroll.totalGrossAmount || 0;
        
        if (!monthlyPayrolls[month]) {
          monthlyPayrolls[month] = 0;
        }
        
        monthlyPayrolls[month] += amount;
      });
      
      const sortedMonths = Object.keys(monthlyPayrolls).sort();
      const growthRates = [];
      
      for (let i = 1; i < sortedMonths.length; i++) {
        const prevMonth = sortedMonths[i - 1];
        const currentMonth = sortedMonths[i];
        
        const prevAmount = monthlyPayrolls[prevMonth];
        const currentAmount = monthlyPayrolls[currentMonth];
        
        if (prevAmount > 0) {
          const growthRate = ((currentAmount - prevAmount) / prevAmount) * 100;
          growthRates.push(growthRate);
        }
      }
      
      const averageGrowthRate = 
        growthRates.length > 0 
          ? growthRates.reduce((a, b) => a + b, 0) / growthRates.length 
          : 0;
      
      const totalPayroll = Object.values(monthlyPayrolls).reduce((sum, amount) => sum + amount, 0);
      
      return {
        value: totalPayroll,
        growthRate: averageGrowthRate,
        monthlyData: monthlyPayrolls  
      };
    };

    const employeeGrowthRate = calculateMonthlyGrowth(user.company.employees);
    const contractorGrowthRate = calculateMonthlyGrowth(user.company.contractors);
    
   
    const employeePayrolls = calculatePayrollMonthlyGrowth(
      user.company.payrolls.filter(payroll => payroll.payrollType === PayrollType.EMPLOYEE)
    );
    
    const contractorPayrolls = calculatePayrollMonthlyGrowth(
      user.company.payrolls.filter(payroll => payroll.payrollType === PayrollType.CONTRACTOR)
    );

    return {
      views: {
        value: 3456,
        growthRate: 0.43,
      },
      profit: {
        value: 4220,
        growthRate: 4.35,
      },
      products: {
        value: 3456,
        growthRate: 2.59,
      },
      users: {
        employees: { value: user.company.employees.length, growthRate: employeeGrowthRate },
        contractors: { value: user.company.contractors.length, growthRate: contractorGrowthRate },
      },
      payrolls: {
        count:user.company.payrolls.length,
        employees: employeePayrolls,
      }
    };
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}


export async function getTopEmployees() {
  const session = await getServerSession(authOptions);

  try {
    if (!session?.user?.email) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include:{
        company:{
          include: {

            settings:{
              select:{
                defaultCurrency:true
              }
            },
            employees: {
              orderBy: {
                monthlyGross: "desc",
              },
              take: 5,
            },
          },
        }
      }
    });

    if (!user|| !user.company) {
      return { error: "Company not found" };
    }

    return {employees:user.company.employees, settings: user.company.settings};
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}





 

 

export async function getPayrollHistoryData(
  timeRange: PayrollTimeRange = PayrollTimeRange.THISMONTH
): Promise<PayrollHistoryData | ErrorResponse> {
  const session = await getServerSession(authOptions);

  try {
    if (!session?.user?.email) {
      return { error: "Unauthorized" };
    }

    const user= await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
     include:{
      company:{
        include: {
          payrolls: {
            select: {
              id: true,
              paymentDate: true,
              status: true,
              createdAt: true,
              totalGrossAmount: true,
            },
          },
          settings: {
            select: {
              defaultCurrency: true,
            },
          },
        },
      }
     }
    });

    if (!user||!user.company) {
      return { error: "Company not found" };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate = new Date();

    switch (timeRange) {
      case PayrollTimeRange.THISMONTH:
        startDate = new Date(today.getUTCFullYear(), today.getUTCMonth(), 1);
        break;
      case PayrollTimeRange.LASTMONTH:
        startDate = new Date(today.getUTCFullYear(), today.getUTCMonth() - 1, 1);
        today.setUTCDate(0);  
        break;
      case PayrollTimeRange.THISYEAR:
        startDate = new Date(today.getUTCFullYear(), 0, 1);
        break;
      case PayrollTimeRange.LASTYEAR:
        startDate = new Date(today.getUTCFullYear() - 1, 0, 1);
        today.setUTCFullYear(today.getUTCFullYear() - 1, 11, 31);
        break;
      case PayrollTimeRange.LAST3MONTHS:
        startDate.setUTCMonth(today.getUTCMonth() - 3);
        break;
      case PayrollTimeRange.LAST6MONTHS:
        startDate.setUTCMonth(today.getUTCMonth() - 6);
        break;
      case PayrollTimeRange.LAST12MONTHS:
        startDate.setUTCMonth(today.getUTCMonth() - 12);
        break;
    }
 
    const payrolls = user.company.payrolls;
    const filteredPayrolls = payrolls.filter(payroll => {
      const payrollDate = new Date(payroll.createdAt);
      payrollDate.setHours(0, 0, 0, 0); // Normalize to UTC
      return payrollDate >= startDate && payrollDate <= today;
    });
 
    const monthlyData: Record<string, { paid: number; due: number }> = {};

    let currentDate = new Date(startDate);
    while (currentDate <= today) {
      const monthKey = currentDate.toISOString().slice(0, 7);
      monthlyData[monthKey] = { paid: 0, due: 0 };
      currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
    }
 
    filteredPayrolls.forEach(payroll => {
      const monthKey = payroll.createdAt.toISOString().slice(0, 7);
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { paid: 0, due: 0 };
      }

      if (payroll.status === PaymentStatus.Paid && payroll.totalGrossAmount) {
        monthlyData[monthKey].paid += payroll.totalGrossAmount;
      }

      if (payroll.status === PaymentStatus.Pending && payroll.totalGrossAmount) {
        monthlyData[monthKey].due += payroll.totalGrossAmount;
      }
    });
 
    const months = Object.keys(monthlyData).sort();
    const formattedMonths = months.map(month => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      return date.toLocaleString('default', { month: 'short' });
    });

    const paidAmounts = months.map(month => monthlyData[month].paid);
    const dueAmounts = months.map(month => monthlyData[month].due);
    const totalPaid = paidAmounts.reduce((sum, amount) => sum + amount, 0);
    const totalDue = dueAmounts.reduce((sum, amount) => sum + amount, 0);
    const currency = user.company.settings?.defaultCurrency || "USD";
 

    return {
      months: formattedMonths,
      dueAmounts,
      paidAmounts,
      totalPaid,
      totalDue,
      currency,
    };
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}




export async function getDailyPaymentData(
  paymentStatusFilter?: PaymentStatus
): Promise<DailyPaymentChartData | ErrorResponse> {
  const session = await getServerSession(authOptions);

  try {
    if (!session?.user?.email) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
     include:{
      company:{
        include: {
          payrolls: {
            select: {
              id: true,
              paymentDate: true,
              status: true,
              totalGrossAmount: true,
            },
          },
          settings: {
            select: {
              defaultCurrency: true,
            },
          },
        },
      }
     }
    });

    if (!user||!user.company) {
      return { error: "Company not found" };
    }

    // Calculate current week's start and end dates
    const today = new Date();
    const day = today.getDay();
    const startOfWeek = new Date(today);
    // Set to previous Saturday
    const diff = day === 0 ? 1 : day; // if Sunday (0), go back 1 day, otherwise go back by current day
    startOfWeek.setDate(today.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Friday
    endOfWeek.setHours(23, 59, 59, 999);

    // Day names for the chart
    const dayNames = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
    
    // Initialize chart data structure with the ApexCharts format
    const chartData:  {
      data: {
        Payment: { x: string; y: number }[];
        Paid: { x: string; y: number }[];
        Pending: { x: string; y: number }[];
        Cancelled: { x: string; y: number }[];
        Failed: { x: string; y: number }[];
        Ready: { x: string; y: number }[];
      };
    } = {
      data:{
        Payment: dayNames.map(day => ({ x: day, y: 0 })),
        Paid: dayNames.map(day => ({ x: day, y: 0 })),
        Pending: dayNames.map(day => ({ x: day, y: 0 })),
        Cancelled: dayNames.map(day => ({ x: day, y: 0 })),
        Failed: dayNames.map(day => ({ x: day, y: 0 })),
        Ready: dayNames.map(day => ({ x: day, y: 0 })),
      }
    };

    // Filter payrolls for the week
    let payrolls = user.company.payrolls.filter(payroll => {
      if (!payroll.paymentDate) return;
      const payrollDate = payroll.paymentDate ? new Date(payroll.paymentDate) : null;
      return payrollDate !== null && payrollDate >= startOfWeek && payrollDate <= endOfWeek;
    });

    // Additional filter by payment status if provided
    if (paymentStatusFilter) {
      payrolls = payrolls.filter(payroll => payroll.status === paymentStatusFilter);
    }

    // Process payroll data
    payrolls.forEach(payroll => {
      if (!payroll.totalGrossAmount) return;
      
      const payrollDate = payroll.paymentDate ? new Date(payroll.paymentDate) : null;
      if (payrollDate) {
        const dayIndex = (payrollDate.getDay() + 6) % 7; // Adjust so Saturday is 0
        const dayKey = dayNames[dayIndex];
        
        // Always increment the total Payment series
        chartData.data.Payment[dayIndex].y += payroll.totalGrossAmount;
        
        // Increment the specific status series
        if (payroll.status === PaymentStatus.Paid) {
          chartData.data.Paid[dayIndex].y += payroll.totalGrossAmount;
        } else if (payroll.status === PaymentStatus.Pending) {
          chartData.data.Pending[dayIndex].y += payroll.totalGrossAmount;
        } else if (payroll.status === PaymentStatus.Cancelled) {
          chartData.data.Cancelled[dayIndex].y += payroll.totalGrossAmount;
        } else if (payroll.status === PaymentStatus.Failed) {
          chartData.data.Failed[dayIndex].y += payroll.totalGrossAmount;
        } else if (payroll.status === PaymentStatus.Ready) {
          chartData.data.Ready[dayIndex].y += payroll.totalGrossAmount;
        }
      }
    });

    // Calculate totals for summary
    const totals = {
      total: chartData.data.Payment.reduce((sum, item) => sum + item.y, 0),
      paid: chartData.data.Paid.reduce((sum, item) => sum + item.y, 0),
      pending: chartData.data.Pending.reduce((sum, item) => sum + item.y, 0),
      cancelled: chartData.data.Cancelled.reduce((sum, item) => sum + item.y, 0),
      failed: chartData.data.Failed.reduce((sum, item) => sum + item.y, 0),
      ready: chartData.data.Ready.reduce((sum, item) => sum + item.y, 0),
    };
    
    const currency = user.company.settings?.defaultCurrency || "USD";
   

    return {
      ...chartData,
      totals,
      currency,
      weekStart: startOfWeek.toISOString(),
      weekEnd: endOfWeek.toISOString(),
      filteredStatus: paymentStatusFilter
    };
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

 
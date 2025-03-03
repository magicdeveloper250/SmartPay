import { PaymentStatus } from "@prisma/client";
 

export default function PaymentStatusView ({ status }:{status:PaymentStatus})  {
  const getStatusStyles = (status: PaymentStatus): string => {
    switch (status) {
      case PaymentStatus.Pending:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case PaymentStatus.Paid:
        return 'bg-green-100 text-green-700 border-green-200';
      case PaymentStatus.Cancelled:
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case PaymentStatus.Failed:
        return 'bg-red-100 text-red-700 border-red-200';
      case PaymentStatus.Ready:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusDot = (status: PaymentStatus): string => {
    switch (status) {
      case PaymentStatus.Pending:
        return 'bg-yellow-500';
      case PaymentStatus.Paid:
        return 'bg-green-500';
      case PaymentStatus.Cancelled:
        return 'bg-gray-500';
      case PaymentStatus.Failed:
        return 'bg-red-500';
      case PaymentStatus.Ready:
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(status)}`}></span>
      {status}
    </span>
  );
};

 
import RevenueTrendChart from "@/src/components/dashboardComponents/RevenueTrendChart";
import PaymentStatusChart from "@/src/components/dashboardComponents/PaymentStatusChart";
import type { RevenuePoint } from "@/src/data/dashboardData/revenueTrendData";
import type { PaymentStatusSlice } from "@/src/data/dashboardData/paymentStatusData";

export default function ChartsRow({
  revenueTrend,
  paymentStatus,
}: {
  revenueTrend: RevenuePoint[];
  paymentStatus: PaymentStatusSlice[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="h-[386px]">
        <RevenueTrendChart data={revenueTrend} />
      </div>
      <div className="h-[386px]">
        <PaymentStatusChart data={paymentStatus} />
      </div>
    </div>
  );
}

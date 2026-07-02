import RevenueTrendChart from "@/src/components/dashboardComponents/RevenueTrendChart";
import PaymentStatusChart from "@/src/components/dashboardComponents/PaymentStatusChart";

export default function ChartsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="h-[386px]">
        <RevenueTrendChart />
      </div>
      <div className="h-[386px]">
        <PaymentStatusChart />
      </div>
    </div>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import ReportsPageHeader from "@/src/components/reportsComponents/ReportsPageHeader";
import ReportsToolbar from "@/src/components/reportsComponents/ReportsToolbar";
import ReportsTabList, {
  type ReportTabName,
} from "@/src/components/reportsComponents/ReportsTabList";
import SalesReportChart from "@/src/components/reportsComponents/SalesReportChart";
import ClientDistributionChart from "@/src/components/reportsComponents/ClientDistributionChart";
import TeamPerformanceChart from "@/src/components/reportsComponents/TeamPerformanceChart";
import LeadConversionReport from "@/src/components/reportsComponents/LeadConversionReport";
import TherapistUtilizationChart from "@/src/components/reportsComponents/TherapistUtilizationChart";
import RevenueByTherapistChart from "@/src/components/reportsComponents/RevenueByTherapistChart";
import RetentionByLocationChart from "@/src/components/reportsComponents/RetentionByLocationChart";

const TAB_CONTENT: Record<ReportTabName, ReactNode> = {
  Sales: <SalesReportChart />,
  Clients: <ClientDistributionChart />,
  Team: <TeamPerformanceChart />,
  Conversion: <LeadConversionReport />,
  Utilization: <TherapistUtilizationChart />,
  Revenue: <RevenueByTherapistChart />,
  Retention: <RetentionByLocationChart />,
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTabName>("Sales");

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <ReportsPageHeader />
      <ReportsToolbar />
      <ReportsTabList activeTab={activeTab} onChange={setActiveTab} />
      {TAB_CONTENT[activeTab]}
    </div>
  );
}

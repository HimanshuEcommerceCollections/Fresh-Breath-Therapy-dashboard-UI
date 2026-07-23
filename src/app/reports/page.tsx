"use client";

import { useMemo, useState } from "react";
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
import { useLocations } from "@/src/hooks/useLocations";
import type { ReportRange } from "@/src/services/reportsService";

const ALL_LOCATIONS = "All locations";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTabName>("Sales");
  const [dateRange, setDateRange] = useState<ReportRange>("last_6_months");
  const [locationName, setLocationName] = useState(ALL_LOCATIONS);
  const { locations } = useLocations();

  const locationId = useMemo(
    () => (locationName === ALL_LOCATIONS ? undefined : locations.find((l) => l.name === locationName)?.id),
    [locationName, locations]
  );
  const filters = useMemo(() => ({ range: dateRange, locationId }), [dateRange, locationId]);

  const TAB_CONTENT: Record<ReportTabName, React.ReactNode> = {
    Sales: <SalesReportChart filters={filters} />,
    Clients: <ClientDistributionChart filters={filters} />,
    Team: <TeamPerformanceChart filters={filters} />,
    Conversion: <LeadConversionReport filters={filters} />,
    Utilization: <TherapistUtilizationChart filters={filters} />,
    Revenue: <RevenueByTherapistChart filters={filters} />,
    Retention: <RetentionByLocationChart filters={filters} />,
  };

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <ReportsPageHeader />
      <ReportsToolbar
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        locationName={locationName}
        onLocationNameChange={setLocationName}
      />
      <ReportsTabList activeTab={activeTab} onChange={setActiveTab} />
      {TAB_CONTENT[activeTab]}
    </div>
  );
}

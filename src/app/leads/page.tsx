"use client";

import { useState } from "react";
import LeadsPageHeader from "@/src/components/leadsComponents/LeadsPageHeader";
import LeadsToolbar from "@/src/components/leadsComponents/LeadsToolbar";
import LeadsTable from "@/src/components/leadsComponents/LeadsTable";
import LeadsPipelineBoard from "@/src/components/leadsComponents/LeadsPipelineBoard";
import type { LeadsView } from "@/src/sections/leadsSections/ViewToggleTabs";

export default function LeadsPage() {
  const [activeView, setActiveView] = useState<LeadsView>("table");

  return (
    <div className="flex flex-col gap-6 px-8 pb-12 pt-24">
      <LeadsPageHeader />
      <LeadsToolbar activeView={activeView} onViewChange={setActiveView} />
      {activeView === "table" ? <LeadsTable /> : <LeadsPipelineBoard />}
    </div>
  );
}

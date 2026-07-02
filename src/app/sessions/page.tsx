"use client";

import { useState } from "react";
import SessionsPageHeader from "@/src/components/sessionsComponents/SessionsPageHeader";
import SessionsTable from "@/src/components/sessionsComponents/SessionsTable";
import SessionsDayView from "@/src/components/sessionsComponents/SessionsDayView";
import SessionsWeekView from "@/src/components/sessionsComponents/SessionsWeekView";
import SessionsMonthView from "@/src/components/sessionsComponents/SessionsMonthView";
import ScheduleSessionModal from "@/src/components/sessionsComponents/ScheduleSessionModal";
import MonthNavigator from "@/src/sections/sessionsSections/MonthNavigator";
import type { SessionsView } from "@/src/sections/sessionsSections/ViewToggle";

export default function SessionsPage() {
  const [activeView, setActiveView] = useState<SessionsView>("list");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <SessionsPageHeader
        activeView={activeView}
        onViewChange={setActiveView}
        onScheduleClick={() => setIsScheduleModalOpen(true)}
      />
      <MonthNavigator
        label="June 2026"
        onPrev={() => {
          // TODO: real calendar navigation once date state exists.
        }}
        onNext={() => {
          // TODO: real calendar navigation once date state exists.
        }}
      />
      {activeView === "list" && <SessionsTable />}
      {activeView === "day" && <SessionsDayView />}
      {activeView === "week" && <SessionsWeekView />}
      {activeView === "month" && <SessionsMonthView />}

      <ScheduleSessionModal
        open={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
}

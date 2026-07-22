"use client";

import { useSessionsPage } from "@/src/hooks/useSessionsPage";
import SessionsPageHeader from "@/src/components/sessionsComponents/SessionsPageHeader";
import SessionsTable from "@/src/components/sessionsComponents/SessionsTable";
import SessionsDayView from "@/src/components/sessionsComponents/SessionsDayView";
import SessionsWeekView from "@/src/components/sessionsComponents/SessionsWeekView";
import SessionsMonthView from "@/src/components/sessionsComponents/SessionsMonthView";
import ScheduleSessionModal from "@/src/components/sessionsComponents/ScheduleSessionModal";
import MonthNavigator from "@/src/sections/sessionsSections/MonthNavigator";

export default function SessionsPage() {
  const sessions = useSessionsPage();

  // Month→Day: when the user clicks a day cell, jump to Day view for that date.
  // Month view data is hardcoded to June 2026 (YYYY=2026, month index=5).
  function handleDayClick(dateNumber: number) {
    sessions.setSelectedDate(new Date(2026, 5, dateNumber));
    sessions.setActiveView("day");
  }

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <SessionsPageHeader
        activeView={sessions.activeView}
        onViewChange={sessions.setActiveView}
        onScheduleClick={sessions.openScheduleModal}
        // Therapist filter
        therapistFilterLabel={sessions.therapistFilterLabel}
        isAllTherapists={sessions.isAllTherapists}
        selectedTherapistIds={sessions.selectedTherapistIds}
        isDropdownOpen={sessions.isDropdownOpen}
        onDropdownOpen={sessions.openDropdown}
        onDropdownClose={sessions.closeDropdown}
        therapistSearch={sessions.therapistSearch}
        onSearchChange={sessions.setTherapistSearch}
        pendingIds={sessions.pendingIds}
        onTogglePending={sessions.togglePendingTherapist}
        onSelectAll={sessions.selectAllTherapists}
        onReset={sessions.resetFilter}
        onApply={sessions.applyFilter}
        filteredTherapists={sessions.filteredTherapists}
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

      {sessions.activeView === "list" && <SessionsTable />}
      {sessions.activeView === "day" && (
        <SessionsDayView selectedDate={sessions.selectedDate} />
      )}
      {sessions.activeView === "week" && <SessionsWeekView />}
      {sessions.activeView === "month" && (
        <SessionsMonthView onDayClick={handleDayClick} />
      )}

      <ScheduleSessionModal
        open={sessions.isScheduleModalOpen}
        onClose={sessions.closeScheduleModal}
      />
    </div>
  );
}

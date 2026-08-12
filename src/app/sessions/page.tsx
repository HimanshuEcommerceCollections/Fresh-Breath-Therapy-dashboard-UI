"use client";

import { useState } from "react";
import { useSessionsPage } from "@/src/hooks/useSessionsPage";
import SessionsPageHeader from "@/src/components/sessionsComponents/SessionsPageHeader";
import SessionsTable from "@/src/components/sessionsComponents/SessionsTable";
import SessionsDayView from "@/src/components/sessionsComponents/SessionsDayView";
import SessionsWeekView from "@/src/components/sessionsComponents/SessionsWeekView";
import SessionsMonthView from "@/src/components/sessionsComponents/SessionsMonthView";
import ScheduleSessionModal from "@/src/components/sessionsComponents/ScheduleSessionModal";
import MonthNavigator from "@/src/sections/sessionsSections/MonthNavigator";
import EditSessionModal from "@/src/components/sessionsComponents/EditSessionModal";
import SessionSearchPanel from "@/src/components/sessionsComponents/SessionSearchPanel";
import type { Session } from "@/src/services/sessionsService";

export default function SessionsPage() {
  const sessions = useSessionsPage();
  const [editing, setEditing] = useState<Session | null>(null);

  // Month→Day: when the user clicks a day cell, jump to Day view for that date.
  function handleDayClick(dateNumber: number) {
    const next = new Date(sessions.selectedDate);
    next.setDate(dateNumber);
    sessions.setSelectedDate(next);
    sessions.setActiveView("day");
  }

  // Week→Day. Takes the exact Date rather than a day number: a week can
  // straddle two months, where setDate(31) on an August date would land in the
  // wrong month entirely.
  function handleWeekDayClick(day: Date) {
    sessions.setSelectedDate(day);
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

      <SessionSearchPanel
        value={sessions.searchTerm}
        onChange={sessions.setSearchTerm}
        results={sessions.searchResults}
        isSearching={sessions.isSearching}
        isActive={sessions.isSearchActive}
        onEdit={setEditing}
      />

      {sessions.activeView !== "list" && (
        <MonthNavigator
          label={sessions.navigatorLabel}
          onPrev={sessions.goToPrevious}
          onNext={sessions.goToNext}
        />
      )}

      {sessions.activeView === "list" && (
        <SessionsTable
          sessions={sessions.sessions}
          isLoading={sessions.isLoadingSessions}
          onStatusChange={sessions.updateSessionStatus}
          hasNextPage={sessions.hasNextSessionsPage}
          isFetchingNextPage={sessions.isFetchingNextSessionsPage}
          onLoadMore={sessions.fetchNextSessionsPage}
        />
      )}
      {sessions.activeView === "day" && (
        <SessionsDayView
          selectedDate={sessions.selectedDate}
          sessions={sessions.sessions}
          isLoading={sessions.isLoadingSessions}
          onEdit={setEditing}
        />
      )}
      {sessions.activeView === "week" && (
        <SessionsWeekView
          selectedDate={sessions.selectedDate}
          sessions={sessions.sessions}
          isLoading={sessions.isLoadingSessions}
          onDayClick={handleWeekDayClick}
        />
      )}
      {sessions.activeView === "month" && (
        <SessionsMonthView
          selectedDate={sessions.selectedDate}
          sessions={sessions.sessions}
          isLoading={sessions.isLoadingSessions}
          onDayClick={handleDayClick}
        />
      )}

      {editing && (
        <EditSessionModal
          session={editing}
          isSaving={sessions.isUpdatingSession}
          onClose={() => setEditing(null)}
          onSave={(payload) => sessions.updateSession(editing.id, payload)}
        />
      )}

      <ScheduleSessionModal
        open={sessions.isScheduleModalOpen}
        onClose={sessions.closeScheduleModal}
        onSchedule={sessions.scheduleSession}
      />
    </div>
  );
}

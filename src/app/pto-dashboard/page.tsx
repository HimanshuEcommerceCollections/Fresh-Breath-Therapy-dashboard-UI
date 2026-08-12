"use client";

import { useState } from "react";
import PTODashboardPageHeader from "@/src/components/ptoDashboardComponents/PTODashboardPageHeader";
import PTOStatsRow from "@/src/components/ptoDashboardComponents/PTOStatsRow";
import PTOChartsRow from "@/src/components/ptoDashboardComponents/PTOChartsRow";
import TherapistLeaderboardTable from "@/src/components/ptoDashboardComponents/TherapistLeaderboardTable";
import RecordPTOUsageModal from "@/src/sections/ptoDashboardSections/RecordPTOUsageModal";
import { usePTODashboard } from "@/src/hooks/usePTODashboard";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { isAdmin } from "@/src/lib/permissions";

export default function PTODashboardPage() {
  const { isChecking } = useRequireRole(["Admin", "Coordinator"], "/leads");
  const { role } = useCurrentUser();
  const {
    stats,
    byLocation,
    leaderboard,
    filteredLeaderboard,
    isLoading,
    search,
    setSearch,
    isSearching,
    recordUsage,
    isRecordingUsage,
  } = usePTODashboard();
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);

  if (isChecking) return null;

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <PTODashboardPageHeader />
      {/* Stats and the location chart deliberately read the UNFILTERED data —
          they're org-wide figures, and a name search silently rewriting the
          headline totals would be misleading. Only the leaderboard filters. */}
      <PTOStatsRow stats={stats} isLoading={isLoading} />
      <PTOChartsRow byLocation={byLocation} isLoading={isLoading} />
      <TherapistLeaderboardTable
        leaderboard={filteredLeaderboard}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        isSearching={isSearching}
        totalCount={leaderboard.length}
        onRecordUsage={() => setIsUsageModalOpen(true)}
        canRecordUsage={isAdmin(role)}
      />
      {/* Mounted only while open, so closing it discards the form state. */}
      {isUsageModalOpen && (
        <RecordPTOUsageModal
          onClose={() => setIsUsageModalOpen(false)}
          onSubmit={recordUsage}
          isSubmitting={isRecordingUsage}
          leaderboard={leaderboard}
        />
      )}
    </div>
  );
}

"use client";

// src/hooks/useSessionsPage.ts
//
// Single source of truth for all state owned by the Sessions page:
// - Active view (day/week/month/list)
// - Selected date (shared across views so Month→Day click lands correctly)
// - Schedule modal open state
// - Therapist filter (search query, selected IDs, derived labels)

import { useMemo, useState } from "react";
import { therapistsData } from "@/src/data/therapistsData/therapistsData";
import type { SessionsView } from "@/src/sections/sessionsSections/ViewToggle";

export { therapistsData };

export function useSessionsPage() {
  // ── View & date ──────────────────────────────────────────────────────────
  const [activeView, setActiveView] = useState<SessionsView>("list");

  // June 26 2026 is marked isToday in monthViewData — use that as the
  // initial "today" until real date state is wired to the backend.
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(2026, 5, 26),
  );

  // ── Schedule modal ────────────────────────────────────────────────────────
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const openScheduleModal = () => setIsScheduleModalOpen(true);
  const closeScheduleModal = () => setIsScheduleModalOpen(false);

  // ── Therapist filter ──────────────────────────────────────────────────────
  const [therapistSearch, setTherapistSearch] = useState("");
  const [selectedTherapistIds, setSelectedTherapistIds] = useState<string[]>(
    [],
  );

  // Pending selection state while the dropdown is open — committed on "Done"
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const openDropdown = () => {
    setPendingIds(selectedTherapistIds);
    setIsDropdownOpen(true);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
    setTherapistSearch("");
  };

  const togglePendingTherapist = (id: string) => {
    setPendingIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectAllTherapists = () => setPendingIds([]);

  const resetFilter = () => {
    setPendingIds([]);
  };

  const applyFilter = () => {
    setSelectedTherapistIds(pendingIds);
    closeDropdown();
  };

  const isAllTherapists = selectedTherapistIds.length === 0;

  const therapistFilterLabel = useMemo(() => {
    if (isAllTherapists) return "All Therapists";
    if (selectedTherapistIds.length === 1) {
      const found = therapistsData.find((t) => t.id === selectedTherapistIds[0]);
      return found ? found.name : "All Therapists";
    }
    return `${selectedTherapistIds.length} Therapists`;
  }, [isAllTherapists, selectedTherapistIds]);

  // Filtered therapist list for the dropdown
  const filteredTherapists = useMemo(() => {
    const q = therapistSearch.toLowerCase().trim();
    if (!q) return therapistsData;
    return therapistsData.filter((t) =>
      t.name.toLowerCase().includes(q),
    );
  }, [therapistSearch]);

  return {
    // View & date
    activeView,
    setActiveView,
    selectedDate,
    setSelectedDate,

    // Schedule modal
    isScheduleModalOpen,
    openScheduleModal,
    closeScheduleModal,

    // Therapist filter — committed state
    isAllTherapists,
    selectedTherapistIds,
    therapistFilterLabel,

    // Therapist filter — dropdown interaction
    isDropdownOpen,
    openDropdown,
    closeDropdown,
    therapistSearch,
    setTherapistSearch,
    pendingIds,
    togglePendingTherapist,
    selectAllTherapists,
    resetFilter,
    applyFilter,
    filteredTherapists,
  };
}

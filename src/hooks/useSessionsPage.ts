"use client";

// src/hooks/useSessionsPage.ts
//
// Single source of truth for all state owned by the Sessions page:
// - Active view (day/week/month/list) + selected date
// - Schedule modal open state
// - Therapist filter (search query, selected IDs, derived labels)
// - Real session list, date-bounded per the active view
//
// The backend only exposes a flat searchable session list (POST
// /api/sessions/search with date_from/date_to) — there is no separate
// day/week/month endpoint. Bucketing into calendar grids is frontend work:
// each view just picks a different date_from/date_to range for the same
// search call, then the view components group the flat response client-side.

import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTherapists } from "@/src/hooks/useTherapists";
import type { SessionStatus } from "@/src/data/sessionsData/sessionsData";
import { sessionsService, type ScheduleSessionPayload } from "@/src/services/sessionsService";
import { useInfiniteList } from "@/src/hooks/useInfiniteList";
import { showSuccessToast } from "@/src/lib/toast";
import type { SessionsView } from "@/src/sections/sessionsSections/ViewToggle";
import {
  addDays,
  addMonths,
  formatDayLabel,
  formatMonthLabel,
  formatWeekLabel,
  getMonthRange,
  getWeekRange,
  toISODate,
} from "@/src/lib/dateRanges";

// Calendar views (Day/Week/Month) are already bounded by a date range and
// need every session in that range in one shot to render the grid — 100 is
// a generous ceiling for a single day/week/month at one practice. Only the
// unbounded List view actually paginates via scroll.
const CALENDAR_VIEW_LIMIT = 100;

export function useSessionsPage() {
  const queryClient = useQueryClient();

  // ── View & date ──────────────────────────────────────────────────────────
  const [activeView, setActiveView] = useState<SessionsView>("list");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // ── Schedule modal ────────────────────────────────────────────────────────
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const openScheduleModal = () => setIsScheduleModalOpen(true);
  const closeScheduleModal = () => setIsScheduleModalOpen(false);

  // ── Therapists (real) ────────────────────────────────────────────────────
  const { therapists } = useTherapists();

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
      const found = therapists.find((t) => t.id === selectedTherapistIds[0]);
      return found ? found.name : "All Therapists";
    }
    return `${selectedTherapistIds.length} Therapists`;
  }, [isAllTherapists, selectedTherapistIds, therapists]);

  // Filtered therapist list for the dropdown
  const filteredTherapists = useMemo(() => {
    const q = therapistSearch.toLowerCase().trim();
    if (!q) return therapists;
    return therapists.filter((t) =>
      t.name.toLowerCase().includes(q),
    );
  }, [therapistSearch, therapists]);

  // ── Date range + navigation per active view ─────────────────────────────
  const dateRange = useMemo(() => {
    if (activeView === "day") {
      const iso = toISODate(selectedDate);
      return { dateFrom: iso, dateTo: iso };
    }
    if (activeView === "week") {
      const { start, end } = getWeekRange(selectedDate);
      return { dateFrom: toISODate(start), dateTo: toISODate(end) };
    }
    if (activeView === "month") {
      const { start, end } = getMonthRange(selectedDate);
      return { dateFrom: toISODate(start), dateTo: toISODate(end) };
    }
    // List view is unbounded — shows all sessions matching the therapist filter.
    return { dateFrom: undefined, dateTo: undefined };
  }, [activeView, selectedDate]);

  const navigatorLabel = useMemo(() => {
    if (activeView === "day") return formatDayLabel(selectedDate);
    if (activeView === "week") {
      const { start, end } = getWeekRange(selectedDate);
      return formatWeekLabel(start, end);
    }
    if (activeView === "month") return formatMonthLabel(selectedDate);
    return "";
  }, [activeView, selectedDate]);

  const goToPrevious = useCallback(() => {
    setSelectedDate((prev) => {
      if (activeView === "day") return addDays(prev, -1);
      if (activeView === "week") return addDays(prev, -7);
      if (activeView === "month") return addMonths(prev, -1);
      return prev;
    });
  }, [activeView]);

  const goToNext = useCallback(() => {
    setSelectedDate((prev) => {
      if (activeView === "day") return addDays(prev, 1);
      if (activeView === "week") return addDays(prev, 7);
      if (activeView === "month") return addMonths(prev, 1);
      return prev;
    });
  }, [activeView]);

  // ── Sessions (real — date-bounded per the active view above) ────────────
  // List view is unbounded, so it paginates via scroll; the calendar views
  // are already bounded by dateRange and just fetch one generously-sized page.
  const isListView = activeView === "list";

  const sessionSearchFilters = useMemo(
    () => ({
      therapistIds: selectedTherapistIds.length ? selectedTherapistIds : undefined,
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo,
    }),
    [selectedTherapistIds, dateRange]
  );

  const {
    items: listSessions,
    isLoading: isLoadingListSessions,
    isFetchingNextPage: isFetchingNextSessionsPage,
    hasNextPage: hasNextSessionsPage,
    fetchNextPage: fetchNextSessionsPage,
  } = useInfiniteList({
    queryKey: ["sessions", sessionSearchFilters],
    queryFn: (cursor) => sessionsService.searchSessions(sessionSearchFilters, cursor),
    enabled: isListView,
  });

  const { data: calendarSessionsPage, isLoading: isLoadingCalendarSessions } = useQuery({
    queryKey: ["sessions", "calendar", sessionSearchFilters],
    queryFn: () => sessionsService.searchSessions(sessionSearchFilters, undefined, CALENDAR_VIEW_LIMIT),
    enabled: !isListView,
  });

  const sessions = isListView ? listSessions : calendarSessionsPage?.items ?? [];
  const isLoadingSessions = isListView ? isLoadingListSessions : isLoadingCalendarSessions;

  const invalidateSessions = () => queryClient.invalidateQueries({ queryKey: ["sessions"] });

  const scheduleSessionMutation = useMutation({
    mutationFn: (payload: ScheduleSessionPayload) => sessionsService.scheduleSession(payload),
    onSuccess: () => {
      showSuccessToast("Session scheduled");
      invalidateSessions();
    },
  });

  const updateSessionStatusMutation = useMutation({
    mutationFn: ({ sessionId, status }: { sessionId: string; status: SessionStatus }) =>
      sessionsService.updateSession(sessionId, { status }),
    onSuccess: () => {
      showSuccessToast("Session status updated");
      invalidateSessions();
    },
  });

  const scheduleSession = async (payload: ScheduleSessionPayload) => {
    await scheduleSessionMutation.mutateAsync(payload);
  };

  const updateSessionStatus = async (sessionId: string, status: SessionStatus) => {
    await updateSessionStatusMutation.mutateAsync({ sessionId, status });
  };

  return {
    // View & date
    activeView,
    setActiveView,
    selectedDate,
    setSelectedDate,
    navigatorLabel,
    goToPrevious,
    goToNext,

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

    // Sessions
    sessions,
    isLoadingSessions,
    isFetchingNextSessionsPage,
    hasNextSessionsPage,
    fetchNextSessionsPage,
    scheduleSession,
    updateSessionStatus,
  };
}

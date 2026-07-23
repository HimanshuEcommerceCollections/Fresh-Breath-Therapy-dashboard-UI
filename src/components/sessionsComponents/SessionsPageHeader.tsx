"use client";

import { Plus } from "lucide-react";
import ViewToggle, {
  type SessionsView,
} from "@/src/sections/sessionsSections/ViewToggle";
import TherapistFilterDropdown from "@/src/components/sessionsComponents/TherapistFilterDropdown";
import type { Therapist } from "@/src/services/therapistsService";

export default function SessionsPageHeader({
  activeView,
  onViewChange,
  onScheduleClick,
  // Therapist filter props
  therapistFilterLabel,
  isAllTherapists,
  selectedTherapistIds,
  isDropdownOpen,
  onDropdownOpen,
  onDropdownClose,
  therapistSearch,
  onSearchChange,
  pendingIds,
  onTogglePending,
  onSelectAll,
  onReset,
  onApply,
  filteredTherapists,
}: {
  activeView: SessionsView;
  onViewChange: (view: SessionsView) => void;
  onScheduleClick: () => void;
  // Therapist filter
  therapistFilterLabel: string;
  isAllTherapists: boolean;
  selectedTherapistIds: string[];
  isDropdownOpen: boolean;
  onDropdownOpen: () => void;
  onDropdownClose: () => void;
  therapistSearch: string;
  onSearchChange: (v: string) => void;
  pendingIds: string[];
  onTogglePending: (id: string) => void;
  onSelectAll: () => void;
  onReset: () => void;
  onApply: () => void;
  filteredTherapists: Therapist[];
}) {
  return (
    <div className="flex flex-row items-end justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-[#071123]">
          Sessions
        </h1>
        <p className="text-sm font-normal leading-5 tracking-[-0.154px] text-[#596475]">
          Calendar and roster of all therapy appointments
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Therapist filter pill — shared across all four views */}
        <TherapistFilterDropdown
          therapistFilterLabel={therapistFilterLabel}
          isAllTherapists={isAllTherapists}
          selectedTherapistIds={selectedTherapistIds}
          isDropdownOpen={isDropdownOpen}
          onOpen={onDropdownOpen}
          onClose={onDropdownClose}
          therapistSearch={therapistSearch}
          onSearchChange={onSearchChange}
          pendingIds={pendingIds}
          onTogglePending={onTogglePending}
          onSelectAll={onSelectAll}
          onReset={onReset}
          onApply={onApply}
          filteredTherapists={filteredTherapists}
        />

        <ViewToggle activeView={activeView} onChange={onViewChange} />

        <button
          type="button"
          onClick={onScheduleClick}
          className="flex h-9 cursor-pointer items-center gap-2 rounded-xl bg-[#376EF4] px-3 text-sm font-semibold leading-5 text-[#FCFCFC] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90"
        >
          <Plus size={16} stroke="#FCFCFC" />
          Schedule
        </button>
      </div>
    </div>
  );
}

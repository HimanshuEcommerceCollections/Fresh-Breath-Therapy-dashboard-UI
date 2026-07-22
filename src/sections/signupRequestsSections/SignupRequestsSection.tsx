"use client";

// src/sections/signupRequestsSections/SignupRequestsSection.tsx
//
// Composes the page header + table card with all rows.
// Uses useSignupRequests for data and action handlers.

import SignupRequestRow from "@/src/components/signupRequestsComponents/SignupRequestRow";
import { useSignupRequests } from "@/src/hooks/useSignupRequests";

const COL_HEADER_CLASS =
  "text-[10px] font-bold uppercase tracking-[1px] text-[#94A3B8]";

export default function SignupRequestsSection() {
  const {
    requests,
    confirmDeleteId,
    isDeleting,
    handleRoleChange,
    handleRejectClick,
    handleConfirmReject,
    handleCancelReject,
  } = useSignupRequests();

  return (
    <div className="flex flex-col gap-6 px-8 pb-12 pt-24">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-bold uppercase tracking-[1px] text-[#94A3B8]">
          ACCESS CONTROL
        </p>
        <h1 className="text-2xl font-bold text-[#1E293B]">Signup Requests</h1>
        <p className="text-sm text-[#64748B]">
          Review and approve new users requesting access to Fresh Breath Therapy
          clinics.
        </p>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-xl border border-[#F1F5F9] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        {/* Column headers */}
        <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_80px] gap-4 border-b border-[#F1F5F9] bg-[rgba(248,250,252,0.5)] px-6 py-3">
          <span className={COL_HEADER_CLASS}>Name</span>
          <span className={COL_HEADER_CLASS}>Email ID</span>
          <span className={COL_HEADER_CLASS}>Role</span>
          {/* Status column — unlabeled per reference */}
          <span className={COL_HEADER_CLASS}></span>
          <span className={COL_HEADER_CLASS}>Actions</span>
        </div>

        {/* Rows */}
        {requests.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-[#94A3B8]">
            No signup requests found.
          </div>
        ) : (
          requests.map((request, index) => (
            <SignupRequestRow
              key={request.id}
              request={request}
              index={index}
              isLast={index === requests.length - 1}
              isConfirmingDelete={confirmDeleteId === request.id}
              isDeleting={isDeleting}
              onRoleChange={handleRoleChange}
              onRejectClick={handleRejectClick}
              onConfirmReject={handleConfirmReject}
              onCancelReject={handleCancelReject}
            />
          ))
        )}
      </div>
    </div>
  );
}

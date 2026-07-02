"use client";

// Shared "label →" header link used by Upcoming Sessions ("View all"),
// Follow-Up Queue ("Manage"), and Therapist Utilization ("All therapists").
export default function CardHeaderLink({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick ??
        (() => {
          // TODO: route to the relevant page once it exists.
        })
      }
      className="flex cursor-pointer items-center gap-1 text-xs font-normal text-[#376EF4]"
    >
      {label}
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M2.5 6H9.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 3L9.5 6L6.5 9"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

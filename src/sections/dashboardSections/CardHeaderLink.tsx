"use client";

import Link from "next/link";

// Shared "label →" header link used by Upcoming Sessions ("View all"),
// Follow-Up Queue ("Manage"), and Therapist Utilization ("All therapists").
//
// Renders a real <Link> (an anchor) when given an href, rather than a button
// with an onClick router.push: middle-click, ctrl-click and "copy link
// address" all work, the destination shows in the status bar on hover, and
// Next prefetches the route. A button navigating imperatively looks identical
// and does none of that.
//
// The onClick form is kept for any header action that isn't navigation.
export default function CardHeaderLink({
  label,
  href,
  onClick,
}: {
  label: string;
  /** Destination. Omit only for a non-navigating action. */
  href?: string;
  onClick?: () => void;
}) {
  const className =
    "flex cursor-pointer items-center gap-1 text-xs font-normal text-[#376EF4] transition-opacity hover:opacity-70";

  const content = (
    <>
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
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

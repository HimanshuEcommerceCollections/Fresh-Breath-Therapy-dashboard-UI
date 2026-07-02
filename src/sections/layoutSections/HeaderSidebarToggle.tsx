"use client";

import { useState } from "react";

export default function HeaderSidebarToggle() {
  // TODO: lift this into shared context/store once the sidebar actually
  // collapses/expands in response — for now this just wires up the click.
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={isCollapsed}
      aria-label="Toggle sidebar"
      onClick={() => setIsCollapsed((prev) => !prev)}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-[#071123] transition-colors hover:bg-black/[0.04]"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 2V14"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

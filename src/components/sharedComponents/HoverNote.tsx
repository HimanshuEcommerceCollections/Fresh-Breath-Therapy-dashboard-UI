"use client";

// src/components/sharedComponents/HoverNote.tsx
//
// Wraps a person's name and reveals the admin's note about them on hover.
// Used by the leads table, the clients table and the pipeline cards.
//
// Why not the native `title` attribute: it waits about a second before
// appearing, cannot be styled, renders in the OS chrome rather than the page,
// and collapses whitespace. For something an admin is meant to scan while
// working down a list, that is too slow and too far from the rest of the UI.
//
// CSS-only (group-hover / group-focus-within), so hovering a row costs no
// render and no state. The trade-off is that the card cannot escape a
// clipping ancestor the way a portalled tooltip could — hence `placement`.

export default function HoverNote({
  note,
  children,
  placement = "bottom",
}: {
  /** The note text. Empty or whitespace-only renders `children` untouched,
   *  with no affordance and no hover target — most rows have no note. */
  note: string | null | undefined;
  children: React.ReactNode;
  /** Which side the card opens on. Defaults to "bottom" because the pipeline
   *  board scrolls horizontally, and a horizontal scroll container also clips
   *  vertically — a card opening upward is cut off on the top row. Pass "top"
   *  where the trigger sits near the bottom of an unclipped container. */
  placement?: "top" | "bottom";
}) {
  const text = note?.trim();
  if (!text) return <>{children}</>;

  const isTop = placement === "top";

  return (
    <span className="group/note relative inline-flex max-w-full items-center gap-1">
      {/* The name itself. The dotted underline is the only hint that a note
          exists, so it appears solely on rows that have one. */}
      <span className="min-w-0 truncate decoration-dotted decoration-from-font underline-offset-[3px] group-hover/note:underline">
        {children}
      </span>

      {/* Focusable so the note is reachable by keyboard, not hover only.
          aria-label carries the text for screen readers; the card itself is
          aria-hidden so it isn't announced twice. */}
      <button
        type="button"
        aria-label={`Note: ${text}`}
        className="flex h-3.5 w-3.5 shrink-0 cursor-help items-center justify-center rounded-full bg-[#E8EDF4] text-[9px] font-bold leading-none text-[#596475] outline-none transition-colors group-hover/note:bg-[#376EF4] group-hover/note:text-white focus-visible:ring-2 focus-visible:ring-[#376EF4]"
      >
        i
      </button>

      <span
        aria-hidden
        className={[
          "pointer-events-none absolute left-0 z-50 w-max max-w-[260px]",
          "rounded-xl border border-[#E0E5EB] bg-white p-3",
          "shadow-[0px_4px_20px_rgba(0,0,0,0.08)]",
          "opacity-0 transition-all duration-150 ease-out",
          "group-hover/note:opacity-100 group-focus-within/note:opacity-100",
          isTop
            ? "bottom-[calc(100%+8px)] translate-y-1 group-hover/note:translate-y-0 group-focus-within/note:translate-y-0"
            : "top-[calc(100%+8px)] -translate-y-1 group-hover/note:translate-y-0 group-focus-within/note:translate-y-0",
        ].join(" ")}
      >
        <span className="mb-1 block text-[10px] font-semibold tracking-[0.6px] text-[#434655]">
          NOTE
        </span>
        {/* break-words, not truncate: the whole point is to read it. Capped at
            100 characters by the API, so it can never run long here. */}
        <span className="block whitespace-pre-wrap break-words text-xs leading-4 text-[#071123]">
          {text}
        </span>

        {/* Arrow. A rotated square with two borders showing, so it reads as a
            notch in the card's own outline rather than a floating diamond. */}
        <span
          className={[
            "absolute left-4 h-2 w-2 rotate-45 bg-white",
            isTop
              ? "-bottom-1 border-b border-r border-[#E0E5EB]"
              : "-top-1 border-l border-t border-[#E0E5EB]",
          ].join(" ")}
        />
      </span>
    </span>
  );
}

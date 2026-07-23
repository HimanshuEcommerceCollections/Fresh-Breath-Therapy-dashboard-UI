import type {
  FollowUpItem,
  FollowUpStatus,
} from "@/src/data/dashboardData/followUpQueueData";

// Pill colors per status — only "Overdue" appears in current data, but the
// mapping keeps future statuses a one-line addition instead of a JSX change.
const STATUS_PILL_STYLES: Record<
  FollowUpStatus,
  { background: string; border: string; text: string }
> = {
  Overdue: {
    background: "rgba(251,44,54,0.15)",
    border: "rgba(251,44,54,0.3)",
    text: "#C10007",
  },
  Pending: {
    background: "rgba(43,127,255,0.15)",
    border: "rgba(43,127,255,0.3)",
    text: "#1447E6",
  },
  Completed: {
    background: "rgba(63,193,104,0.15)",
    border: "rgba(63,193,104,0.3)",
    text: "#1F7A3D",
  },
};

export default function FollowUpQueueItem({ item }: { item: FollowUpItem }) {
  const pill = STATUS_PILL_STYLES[item.status];

  return (
    <div className="flex flex-row items-center gap-3 rounded-[14px] border border-[rgba(224,229,235,0.6)] p-3">
      <span aria-hidden className="shrink-0 text-[#596475]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.99992 14.6654C11.6818 14.6654 14.6666 11.6806 14.6666 7.9987C14.6666 4.3168 11.6818 1.33203 7.99992 1.33203C4.31802 1.33203 1.33325 4.3168 1.33325 7.9987C1.33325 11.6806 4.31802 14.6654 7.99992 14.6654Z"
            stroke="currentColor"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 4V8L10.6667 9.33333"
            stroke="currentColor"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium tracking-[-0.154px] text-[#071123]">
          {item.clientName}
        </span>
        <span className="truncate text-xs font-normal text-[#596475]">
          {item.date} · {item.note}
        </span>
      </div>

      <span
        className="shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium"
        style={{
          backgroundColor: pill.background,
          borderColor: pill.border,
          color: pill.text,
        }}
      >
        {item.status}
      </span>
    </div>
  );
}

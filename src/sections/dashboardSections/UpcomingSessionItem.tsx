import type {
  SessionStatus,
  UpcomingSession,
} from "@/src/data/dashboardData/upcomingSessionsData";

// Pill colors per status — only "Scheduled" appears in current data, but the
// mapping keeps future statuses a one-line addition instead of a JSX change.
const STATUS_PILL_STYLES: Record<
  SessionStatus,
  { background: string; border: string; text: string }
> = {
  Scheduled: {
    background: "rgba(43,127,255,0.15)",
    border: "rgba(43,127,255,0.3)",
    text: "#1447E6",
  },
  Completed: {
    background: "rgba(63,193,104,0.15)",
    border: "rgba(63,193,104,0.3)",
    text: "#1F7A3D",
  },
  Cancelled: {
    background: "rgba(242,166,24,0.15)",
    border: "rgba(242,166,24,0.3)",
    text: "#B37505",
  },
  Missed: {
    background: "rgba(242,42,54,0.15)",
    border: "rgba(242,42,54,0.3)",
    text: "#C41220",
  },
};

export default function UpcomingSessionItem({
  session,
}: {
  session: UpcomingSession;
}) {
  const pill = STATUS_PILL_STYLES[session.status];

  return (
    <div className="flex flex-row items-start gap-3 rounded-[14px] border border-[rgba(224,229,235,0.6)] p-3">
      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-[rgba(55,110,244,0.1)]">
        <span className="text-[10px] font-medium uppercase tracking-[0.12px] text-[#376EF4]">
          {session.month}
        </span>
        <span className="text-sm font-bold tracking-[-0.154px] text-[#376EF4]">
          {session.day}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium tracking-[-0.154px] text-[#071123]">
          {session.clientName}
        </span>
        <span className="truncate text-xs font-normal text-[#596475]">
          {session.time} · {session.therapistName}
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
        {session.status}
      </span>
    </div>
  );
}

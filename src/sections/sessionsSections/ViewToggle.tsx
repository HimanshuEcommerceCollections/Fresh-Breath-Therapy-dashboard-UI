"use client";

export type SessionsView = "day" | "week" | "month" | "list";

const TABS: { view: SessionsView; label: string }[] = [
  { view: "day", label: "Day" },
  { view: "week", label: "Week" },
  { view: "month", label: "Month" },
  { view: "list", label: "List" },
];

export default function ViewToggle({
  activeView,
  onChange,
}: {
  activeView: SessionsView;
  onChange: (view: SessionsView) => void;
}) {
  return (
    <div className="flex h-9 shrink-0 items-center rounded-[14px] bg-[#EFF4FA] p-1">
      {TABS.map((tab) => (
        <button
          key={tab.view}
          type="button"
          onClick={() => onChange(tab.view)}
          className={`h-7 cursor-pointer rounded-xl px-4 text-sm font-semibold leading-5 transition-colors ${
            activeView === tab.view
              ? "bg-[#F7FBFD] text-[#071123] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
              : "text-[#596475]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

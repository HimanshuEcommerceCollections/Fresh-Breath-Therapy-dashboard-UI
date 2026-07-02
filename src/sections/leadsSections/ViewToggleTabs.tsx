"use client";

export type LeadsView = "table" | "pipeline";

export default function ViewToggleTabs({
  activeView,
  onChange,
}: {
  activeView: LeadsView;
  onChange: (view: LeadsView) => void;
}) {
  const tabs: { view: LeadsView; label: string }[] = [
    { view: "table", label: "Table" },
    { view: "pipeline", label: "Pipeline" },
  ];

  return (
    <div className="flex h-9 shrink-0 items-center rounded-[14px] bg-[#EFF4FA] p-1">
      {tabs.map((tab) => (
        <button
          key={tab.view}
          type="button"
          onClick={() => onChange(tab.view)}
          className={`h-7 cursor-pointer rounded-xl px-4 text-sm font-medium transition-colors ${
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

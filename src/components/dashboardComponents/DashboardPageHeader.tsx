import { dashboardHeaderContent } from "@/src/data/dashboardData/dashboardHeaderData";

export default function DashboardPageHeader() {
  return (
    <div className="flex flex-row items-end justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-[-0.75px] text-[#071123]">
          Welcome back, {dashboardHeaderContent.greetingName}
        </h1>
        <p className="text-sm font-normal tracking-[-0.154px] text-[#596475]">
          {dashboardHeaderContent.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="cursor-pointer rounded-xl border border-[#E0E5EB] bg-[#F7FBFD] px-4 py-2 text-sm font-medium text-[#071123] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-80"
        >
          View reports
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-xl bg-[#376EF4] px-4 py-2 text-sm font-medium text-[#FCFCFC] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90"
        >
          + Add lead
        </button>
      </div>
    </div>
  );
}

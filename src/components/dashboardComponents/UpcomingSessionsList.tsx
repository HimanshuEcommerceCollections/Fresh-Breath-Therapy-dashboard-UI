"use client";

import ChartCard from "@/src/sections/dashboardSections/ChartCard";
import UpcomingSessionItem from "@/src/sections/dashboardSections/UpcomingSessionItem";
import { upcomingSessionsData } from "@/src/data/dashboardData/upcomingSessionsData";

function ViewAllLink() {
  return (
    <button
      type="button"
      onClick={() => {
        // TODO: route to the full sessions page once it exists.
      }}
      className="flex cursor-pointer items-center gap-1 text-xs font-normal text-[#376EF4]"
    >
      View all
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

export default function UpcomingSessionsList() {
  return (
    <ChartCard title="Upcoming Sessions" action={<ViewAllLink />}>
      <div className="flex flex-col gap-3">
        {upcomingSessionsData.map((session) => (
          <UpcomingSessionItem key={session.id} session={session} />
        ))}
      </div>
    </ChartCard>
  );
}

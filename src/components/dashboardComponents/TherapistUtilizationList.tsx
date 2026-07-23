"use client";

import ChartCard from "@/src/sections/dashboardSections/ChartCard";
import TherapistUtilizationItem from "@/src/sections/dashboardSections/TherapistUtilizationItem";
import CardHeaderLink from "@/src/sections/dashboardSections/CardHeaderLink";
import type { TherapistUtilization } from "@/src/data/dashboardData/therapistUtilizationData";
import { useInView } from "@/src/hooks/useInView";

export default function TherapistUtilizationList({
  therapists,
}: {
  therapists: TherapistUtilization[];
}) {
  // Bar-growth animation only starts once the card scrolls into view,
  // consistent with the other animated cards on this page.
  const { ref, isInView } = useInView<HTMLDivElement>();

  const maxSessions = Math.max(1, ...therapists.map((t) => t.sessionsCount));

  return (
    <ChartCard
      title="Therapist Utilization"
      subtitle="Avg sessions/week vs target (8/wk)"
      action={<CardHeaderLink label="All therapists" />}
    >
      <div ref={ref} className="flex flex-col gap-3">
        {therapists.map((therapist, index) => (
          <TherapistUtilizationItem
            key={therapist.id}
            therapist={therapist}
            fillPercent={(therapist.sessionsCount / maxSessions) * 100}
            animate={isInView}
            index={index}
          />
        ))}
      </div>
    </ChartCard>
  );
}

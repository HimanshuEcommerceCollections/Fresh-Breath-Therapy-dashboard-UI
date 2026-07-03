"use client";

import { therapistsData } from "@/src/data/therapistsData/therapistsData";
import TherapistCard from "@/src/sections/therapistsSections/TherapistCard";
import { useInView } from "@/src/hooks/useInView";

export default function TherapistsGrid() {
  // Utilization-bar animation starts once the grid scrolls into view,
  // consistent with the Dashboard's animated bars.
  const { ref, isInView } = useInView<HTMLDivElement>(0.05);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {therapistsData.map((therapist, index) => (
        <TherapistCard
          key={therapist.id}
          therapist={therapist}
          animate={isInView}
          index={index}
        />
      ))}
    </div>
  );
}

import TherapistsPageHeader from "@/src/components/therapistsComponents/TherapistsPageHeader";
import TherapistsToolbar from "@/src/components/therapistsComponents/TherapistsToolbar";
import TherapistsGrid from "@/src/components/therapistsComponents/TherapistsGrid";

export default function TherapistsPage() {
  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <TherapistsPageHeader />
      <TherapistsToolbar />
      <TherapistsGrid />
    </div>
  );
}

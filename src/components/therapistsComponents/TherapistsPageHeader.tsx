import { therapistsData } from "@/src/data/therapistsData/therapistsData";

export default function TherapistsPageHeader() {
  const count = therapistsData.length;
  const clinicCount = new Set(therapistsData.map((t) => t.location)).size;

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-[#071123]">
        Therapists
      </h1>
      <p className="text-sm font-normal leading-5 tracking-[-0.154px] text-[#596475]">
        {count} licensed therapists across {clinicCount} clinics
      </p>
    </div>
  );
}

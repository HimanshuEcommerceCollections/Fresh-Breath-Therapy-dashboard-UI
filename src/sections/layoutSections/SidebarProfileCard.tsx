import Image from "next/image";
import type { Therapist } from "@/src/services/therapistsService";

export default function SidebarProfileCard({ therapist }: { therapist: Therapist }) {
  return (
    <div className="border-t border-[rgba(255,255,255,0.5)] p-3">
      <div className="flex items-center gap-[10px] rounded-[10px] bg-white px-[10px] py-2">
        {therapist.avatarUrl ? (
          <Image
            src={therapist.avatarUrl}
            alt={therapist.name}
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(55,110,244,0.1)] text-xs font-semibold text-[#376EF4]">
            {therapist.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </div>
        )}
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-xs font-medium text-[#071123]">
            {therapist.name}
          </span>
          <span className="truncate text-xs font-normal text-[#596475]">
            {therapist.credential ?? "Therapist"}
          </span>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import type { User } from "@/src/data/layoutData/userData";

export default function SidebarProfileCard({ user }: { user: User }) {
  return (
    <div className="border-t border-[rgba(255,255,255,0.5)] p-3">
      <div className="flex items-center gap-[10px] rounded-[10px] bg-white px-[10px] py-2">
        <Image
          src={user.avatarUrl}
          alt={user.name}
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-xs font-medium text-[#071123]">
            {user.name}
          </span>
          <span className="truncate text-xs font-normal text-[#596475]">
            {user.role}
          </span>
        </div>
      </div>
    </div>
  );
}

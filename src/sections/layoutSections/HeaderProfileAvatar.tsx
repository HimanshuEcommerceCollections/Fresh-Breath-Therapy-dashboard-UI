"use client";

import Image from "next/image";
import type { User } from "@/src/data/layoutData/userData";

export default function HeaderProfileAvatar({ user }: { user: User }) {
  return (
    <button
      type="button"
      aria-label={`${user.name} profile menu`}
      onClick={() => {
        // TODO: open profile dropdown menu once designed.
      }}
      className="h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-[#325A5E] bg-[#376EF4]"
    >
      <Image
        src={user.avatarUrl}
        alt={user.name}
        width={32}
        height={32}
        className="h-full w-full object-cover"
      />
    </button>
  );
}

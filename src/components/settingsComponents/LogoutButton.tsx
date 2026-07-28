"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useCurrentUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-2 self-start rounded-lg bg-[#DC2626] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut size={16} />
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}

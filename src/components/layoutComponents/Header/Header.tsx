import { currentUser } from "@/src/data/layoutData/userData";
import HeaderSidebarToggle from "@/src/sections/layoutSections/HeaderSidebarToggle";
import HeaderSearchBar from "@/src/sections/layoutSections/HeaderSearchBar";
import HeaderNotificationButton from "@/src/sections/layoutSections/HeaderNotificationButton";
import HeaderProfileAvatar from "@/src/sections/layoutSections/HeaderProfileAvatar";

export default function Header() {
  return (
    <header className="fixed left-63.75 right-0 top-0 z-40 flex h-16 items-center gap-3 border-b border-[#E0E5EB] bg-[rgba(247,251,253,0.8)] px-6 backdrop-blur-md">
      <HeaderSidebarToggle />
      <HeaderSearchBar />
      <div className="flex-1" />
      <HeaderNotificationButton />
      <HeaderProfileAvatar user={currentUser} />
    </header>
  );
}

// src/components/notificationsComponents/NotificationFilterTabs.tsx
import { NotificationTab } from "@/src/data/notificationsData/notificationsData";

interface NotificationFilterTabsProps {
  tabs: readonly NotificationTab[];
  activeTab: NotificationTab;
  onChange: (tab: NotificationTab) => void;
}

const NotificationFilterTabs = ({
  tabs,
  activeTab,
  onChange,
}: NotificationFilterTabsProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`whitespace-nowrap rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#111827] text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                : "border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

export default NotificationFilterTabs;
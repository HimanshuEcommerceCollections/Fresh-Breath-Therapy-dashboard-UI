// src/sections/notificationsSections/NotificationsSection.tsx
"use client";

import NotificationsHeader from "@/src/components/notificationsComponents/NotificationsHeader";
import NotificationSummaryCard from "@/src/components/notificationsComponents/NotificationSummaryCard";
import NotificationFilterTabs from "@/src/components/notificationsComponents/NotificationFilterTabs";
import NotificationListItem from "@/src/components/notificationsComponents/NotificationListItem";
import NotificationsEmptyState from "@/src/components/notificationsComponents/NotificationsEmptyState";
import { notificationsPageContent } from "@/src/data/notificationsData/notificationsData";
import { useNotifications } from "@/src/hooks/useNotifications";

const NotificationsSection = () => {
  const {
    notifications,
    counts,
    activeTab,
    setActiveTab,
    isMarking,
    handleMarkAllAsRead,
  } = useNotifications();

  const { summaryCards, tabs, emptyState } = notificationsPageContent;

  return (
    <div className="flex w-full flex-col gap-6 px-8 pb-12 pt-24">
      <NotificationsHeader
        heading={notificationsPageContent.heading}
        subheading={notificationsPageContent.subheading}
        markAllAsReadLabel={notificationsPageContent.markAllAsReadLabel}
        onMarkAllAsRead={handleMarkAllAsRead}
        isMarking={isMarking}
      />

      <div className="flex w-full gap-6">
        <NotificationSummaryCard
          label={summaryCards.unread.label}
          count={counts.unread}
          icon={summaryCards.unread.icon}
          iconBg={summaryCards.unread.iconBg}
        />
        <NotificationSummaryCard
          label={summaryCards.followUpReminders.label}
          count={counts.followUpReminders}
          icon={summaryCards.followUpReminders.icon}
          iconBg={summaryCards.followUpReminders.iconBg}
        />
        <NotificationSummaryCard
          label={summaryCards.alerts.label}
          count={counts.alerts}
          icon={summaryCards.alerts.icon}
          iconBg={summaryCards.alerts.iconBg}
        />
      </div>

      <NotificationFilterTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {notifications.length === 0 ? (
        <NotificationsEmptyState
          icon={emptyState.icon}
          heading={emptyState.heading}
          subtext={emptyState.subtext}
        />
      ) : (
        <div className="w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          {notifications.map((notification, index) => (
            <NotificationListItem
              key={notification.id}
              notification={notification}
              isLast={index === notifications.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsSection;
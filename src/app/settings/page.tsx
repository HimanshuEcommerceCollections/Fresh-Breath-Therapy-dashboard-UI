"use client";

import { useState, type ReactNode } from "react";
import SettingsPageHeader from "@/src/components/settingsComponents/SettingsPageHeader";
import SettingsTabList, {
  type SettingsTabName,
} from "@/src/components/settingsComponents/SettingsTabList";
import OrganizationSettings from "@/src/components/settingsComponents/OrganizationSettings";
import RolesSettings from "@/src/components/settingsComponents/RolesSettings";
import NotificationsSettings from "@/src/components/settingsComponents/NotificationsSettings";
import SaaSSettings from "@/src/components/settingsComponents/SaaSSettings";
import SecuritySettings from "@/src/components/settingsComponents/SecuritySettings";
import LogoutButton from "@/src/components/settingsComponents/LogoutButton";
import { useRequireRole } from "@/src/hooks/useRequireRole";

const TAB_CONTENT: Record<SettingsTabName, ReactNode> = {
  Organization: <OrganizationSettings />,
  Roles: <RolesSettings />,
  Notifications: <NotificationsSettings />,
  SaaS: <SaaSSettings />,
  Security: <SecuritySettings />,
};

export default function SettingsPage() {
  const { isChecking } = useRequireRole(["Admin", "Coordinator"], "/leads");
  const [activeTab, setActiveTab] = useState<SettingsTabName>("Organization");

  if (isChecking) return null;

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <div className="flex items-start justify-between gap-4">
        <SettingsPageHeader />
        <LogoutButton />
      </div>
      <SettingsTabList activeTab={activeTab} onChange={setActiveTab} />
      {TAB_CONTENT[activeTab]}
    </div>
  );
}


"use client";

import { useState, type ReactNode } from "react";
import SettingsPageHeader from "@/src/components/settingsComponents/SettingsPageHeader";
import SettingsTabList, {
  type SettingsTabName,
} from "@/src/components/settingsComponents/SettingsTabList";
import OrganizationSettings from "@/src/components/settingsComponents/OrganizationSettings";
import RolesSettings from "@/src/components/settingsComponents/RolesSettings";
import PackagesSettings from "@/src/components/settingsComponents/PackagesSettings";
import AutomationSettings from "@/src/components/settingsComponents/AutomationSettings";
import NotificationsSettings from "@/src/components/settingsComponents/NotificationsSettings";
import SaaSSettings from "@/src/components/settingsComponents/SaaSSettings";
import SecuritySettings from "@/src/components/settingsComponents/SecuritySettings";
import IntegrationsSettings from "@/src/components/settingsComponents/IntegrationsSettings";

const TAB_CONTENT: Record<SettingsTabName, ReactNode> = {
  Organization: <OrganizationSettings />,
  Roles: <RolesSettings />,
  Packages: <PackagesSettings />,
  Automation: <AutomationSettings />,
  Notifications: <NotificationsSettings />,
  SaaS: <SaaSSettings />,
  Security: <SecuritySettings />,
  Integrations: <IntegrationsSettings />,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabName>("Organization");

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <SettingsPageHeader />
      <SettingsTabList activeTab={activeTab} onChange={setActiveTab} />
      {TAB_CONTENT[activeTab]}
    </div>
  );
}


"use client";

import { useState } from "react";
import FollowUpsHeader from "@/src/components/followUpsComponents/FollowUpsHeader";
import FollowUpsStatCards from "@/src/components/followUpsComponents/FollowUpsStatCards";
import FollowUpsTable from "@/src/components/followUpsComponents/FollowUpsTable";
import AddFollowUpModal from "@/src/components/followUpsComponents/AddFollowUpModal";
import FilterTabs, {
  type FollowUpFilter,
} from "@/src/sections/followUpsSections/FilterTabs";

export default function FollowUpsPage() {
  const [activeTab, setActiveTab] = useState<FollowUpFilter>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <FollowUpsHeader onAddClick={() => setIsAddModalOpen(true)} />
      <FollowUpsStatCards />
      <FilterTabs activeTab={activeTab} onChange={setActiveTab} />
      <FollowUpsTable activeTab={activeTab} />

      <AddFollowUpModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { usePackagesSettings } from "@/src/hooks/usePackagesSettings";
import PackageCard from "@/src/sections/settingsSections/PackageCard";
import PackageFormModal from "@/src/sections/settingsSections/PackageFormModal";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { isAdmin } from "@/src/lib/permissions";
import type { PackagePayload, ServicePackage } from "@/src/services/packagesService";

export default function PackagesSettings() {
  const { role } = useCurrentUser();
  const canEdit = isAdmin(role);
  const { packages, isLoading, isSaving, createPackage, updatePackage, deletePackage } =
    usePackagesSettings();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);

  function openAddModal() {
    setEditingPackage(null);
    setIsModalOpen(true);
  }

  function openEditModal(pkg: ServicePackage) {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  }

  async function handleSubmit(payload: PackagePayload) {
    if (editingPackage) {
      await updatePackage(editingPackage.id, payload);
    } else {
      await createPackage(payload);
    }
  }

  return (
    <div className="flex max-w-[630px] flex-col gap-3 rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
          Service Packages
        </h3>
        {canEdit && (
          <button
            type="button"
            onClick={openAddModal}
            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-[#376EF4] px-3 text-xs font-medium text-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90"
          >
            <Plus size={14} />
            Add Package
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
        ) : packages.length === 0 ? (
          <p className="text-sm text-[#94A3B8]">No packages yet.</p>
        ) : (
          packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              canEdit={canEdit}
              onEdit={() => openEditModal(pkg)}
              onDelete={() => deletePackage(pkg.id)}
            />
          ))
        )}
      </div>

      <PackageFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        editingPackage={editingPackage}
        isSaving={isSaving}
      />
    </div>
  );
}

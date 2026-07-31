import { Pencil, Trash2 } from "lucide-react";
import type { ServicePackage } from "@/src/services/packagesService";

export default function PackageCard({
  pkg,
  canEdit = false,
  onEdit,
  onDelete,
}: {
  pkg: ServicePackage;
  canEdit?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[4px] border border-[rgba(224,229,235,0.6)] p-3 text-sm font-normal text-[#071123]">
      <div className="flex items-center gap-2">
        <span>
          {pkg.name} — ${pkg.price.toLocaleString()}
        </span>
        {!pkg.isActive && (
          <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-xs font-medium text-[#596475]">
            Inactive
          </span>
        )}
      </div>

      {canEdit && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={`Edit ${pkg.name}`}
            onClick={onEdit}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[#071123] transition-colors hover:bg-black/5"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${pkg.name}`}
            onClick={onDelete}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[#F22A36] transition-colors hover:bg-black/5"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Check, Loader2, Minus } from "lucide-react";
import {
  securitySettingsService,
  type SecurityControl,
} from "@/src/services/settingsService";

/**
 * Security & Compliance — READ ONLY.
 *
 * This panel used to be four hardcoded toggles, every one showing ON, that
 * nothing read and nothing enforced: MFA for Admins, HIPAA audit logging,
 * 30-minute idle logout, 7-year retention. Flipping one mutated local state
 * and was discarded on navigation.
 *
 * It now shows what the backend is actually configured with. Two deliberate
 * consequences: a control cannot be misreported, because the value comes from
 * the same settings the middleware enforces; and a control cannot be switched
 * off from here, because these are deployment decisions rather than
 * preferences. Anything unimplemented says so plainly instead of reading as
 * enabled.
 */
function StatusIcon({ enabled }: { enabled: boolean | null }) {
  if (enabled === null) {
    return (
      <span
        title="Enforced outside the application"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8EDF4] text-[#596475]"
      >
        <Minus size={12} />
      </span>
    );
  }
  if (enabled) {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D]">
        <Check size={12} strokeWidth={3} />
      </span>
    );
  }
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FEF3C7] text-[#B45309]">
      <AlertTriangle size={12} />
    </span>
  );
}

function ControlRow({ control }: { control: SecurityControl }) {
  return (
    <div className="flex items-start gap-3 py-3.5">
      <StatusIcon enabled={control.enabled} />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-[#071123]">{control.label}</span>
        <span className="text-xs leading-relaxed text-[#596475]">{control.detail}</span>
      </div>
    </div>
  );
}

export default function SecuritySettings() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["settings", "security"],
    queryFn: securitySettingsService.fetchControls,
  });

  return (
    <div className="flex max-w-[630px] flex-col rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
        Security &amp; Compliance
      </h3>
      <p className="mt-1 text-xs text-[#596475]">
        The controls currently in force. These are set at deployment and cannot be
        changed here.
      </p>

      {isLoading && (
        <div className="flex items-center gap-2 py-6 text-sm text-[#596475]">
          <Loader2 size={15} className="animate-spin" /> Loading current configuration…
        </div>
      )}

      {isError && (
        <p className="py-6 text-sm text-[#B91C1C]">
          Couldn&apos;t load the security configuration.
        </p>
      )}

      {data && (
        <div className="mt-2 flex flex-col divide-y divide-[#E0E5EB]">
          {data.map((control) => (
            <ControlRow key={control.key} control={control} />
          ))}
        </div>
      )}
    </div>
  );
}

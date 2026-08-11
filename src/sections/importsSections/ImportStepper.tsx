"use client";

import { Check } from "lucide-react";
import { IMPORT_STEPS, type ImportStep } from "@/src/data/importsData/importsData";

/**
 * The four stages, with the current one named.
 *
 * Steps are only clickable backwards. Jumping forward past an unfinished
 * mapping would show verdicts derived from it, which is exactly the kind of
 * confidently-wrong screen this whole flow exists to avoid.
 */
export default function ImportStepper({
  current,
  onStepChange,
}: {
  current: ImportStep;
  onStepChange: (step: ImportStep) => void;
}) {
  const currentIndex = IMPORT_STEPS.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center gap-2">
      {IMPORT_STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.key} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              disabled={!isDone}
              onClick={() => isDone && onStepChange(step.key)}
              className={`flex flex-1 items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-colors ${
                isCurrent
                  ? "border-[#376EF4] bg-[#F5F8FF]"
                  : isDone
                    ? "cursor-pointer border-[#E0E5EB] bg-white hover:bg-[#F7FBFD]"
                    : "border-[#E0E5EB] bg-white opacity-55"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isDone
                    ? "bg-[#16A34A] text-white"
                    : isCurrent
                      ? "bg-[#376EF4] text-white"
                      : "bg-[#E2E8F0] text-[#596475]"
                }`}
              >
                {isDone ? <Check size={13} strokeWidth={3} /> : index + 1}
              </span>
              <span className="min-w-0">
                <span
                  className={`block truncate text-sm font-medium ${
                    isCurrent ? "text-[#071123]" : "text-[#596475]"
                  }`}
                >
                  {step.label}
                </span>
                {isCurrent && (
                  <span className="block truncate text-xs text-[#596475]">
                    {step.hint}
                  </span>
                )}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

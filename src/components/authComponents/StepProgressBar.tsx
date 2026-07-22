// src/components/authComponents/StepProgressBar.tsx

interface StepProgressBarProps {
  stepLabel: string;
  badgeLabel: string;
  progressPercent: number; // 0-100
}

const StepProgressBar = ({
  stepLabel,
  badgeLabel,
  progressPercent,
}: StepProgressBarProps) => {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.6px] text-[#5C6B69]">
          {stepLabel}
        </span>
        <span className="text-xs font-bold text-[#143A3D]">{badgeLabel}</span>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-[#E6F0EC]">
        <div
          className="h-full rounded-full bg-[#143A3D] transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default StepProgressBar;
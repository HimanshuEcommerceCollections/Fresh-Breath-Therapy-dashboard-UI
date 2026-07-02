export type StatCardData = {
  label: string;
  value: string | number;
  subtext?: string;
  iconSrc: string;
  iconBgColor: string;
  iconColor: string;
};

type StatCardProps = StatCardData & {
  // Session Metrics row cards have no subtext line and read tighter in the
  // reference design — rows 1 & 3 use the default (looser) text gap.
  compact?: boolean;
};

export default function StatCard({
  label,
  value,
  subtext,
  iconSrc,
  iconBgColor,
  iconColor,
  compact = false,
}: StatCardProps) {
  return (
    <div className="flex flex-row items-start justify-between rounded-[18px] border border-[rgba(224,229,235,0.6)] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className={`flex flex-col ${compact ? "gap-2" : "gap-1"}`}>
        <span className="text-xs font-medium uppercase tracking-[0.3px] text-[#596475]">
          {label}
        </span>
        <span className="text-2xl font-semibold tracking-[0.072px] text-[#071123]">
          {value}
        </span>
        {subtext && (
          <span className="text-xs font-normal text-[#596475]">{subtext}</span>
        )}
      </div>

      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[18px]"
        style={{ backgroundColor: iconBgColor, color: iconColor }}
      >
        <span
          aria-hidden
          className="h-5 w-5 bg-current"
          style={{
            WebkitMaskImage: `url(${iconSrc})`,
            maskImage: `url(${iconSrc})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      </div>
    </div>
  );
}

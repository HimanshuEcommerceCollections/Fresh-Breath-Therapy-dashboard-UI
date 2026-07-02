import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  // Optional right-aligned header element (e.g. a "View all" link).
  action?: ReactNode;
  children: ReactNode;
};

export default function ChartCard({
  title,
  subtitle,
  action,
  children,
}: ChartCardProps) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-normal text-[#596475]">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

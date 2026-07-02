import Image from "next/image";

// The provided SVGs already ship with their final stroke colors baked in
// (#F2A618 / #F22A36 / #3FC168), so no tinting is applied — iconColor is
// accepted per the data contract but unused unless assets change.
export default function StatCard({
  label,
  value,
  iconSrc,
  iconBg,
}: {
  label: string;
  value: number;
  iconSrc: string;
  iconBg: string;
  iconColor?: string;
}) {
  return (
    <div className="flex flex-1 items-start justify-between rounded-[18px] border border-[rgba(224,229,235,0.6)] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase leading-4 tracking-[0.3px] text-[#596475]">
          {label}
        </span>
        <span className="text-2xl font-semibold leading-8 tracking-[0.072px] text-[#071123]">
          {value}
        </span>
      </div>
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[18px]"
        style={{ backgroundColor: iconBg }}
      >
        <Image src={iconSrc} alt="" width={20} height={20} aria-hidden />
      </div>
    </div>
  );
}

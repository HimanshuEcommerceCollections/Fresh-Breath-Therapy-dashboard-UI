import type { ServicePackage } from "@/src/services/packagesService";

export default function PackageCard({ pkg }: { pkg: ServicePackage }) {
  return (
    <div className="rounded-[4px] border border-[rgba(224,229,235,0.6)] p-3 text-sm font-normal text-[#071123]">
      {pkg.name} — ${pkg.price.toLocaleString()}
    </div>
  );
}

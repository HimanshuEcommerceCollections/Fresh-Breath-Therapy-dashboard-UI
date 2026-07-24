"use client";

import { useEffect, useState } from "react";
import { packagesService, type ServicePackage } from "@/src/services/packagesService";
import PackageCard from "@/src/sections/settingsSections/PackageCard";

export default function PackagesSettings() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);

  useEffect(() => {
    packagesService.fetchPackages().then(setPackages).catch(() => {});
  }, []);

  return (
    <div className="flex max-w-[630px] flex-col gap-3 rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
        Service Packages
      </h3>
      <div className="flex flex-col gap-2">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
}

// src/hooks/usePackages.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { packagesService } from "@/src/services/packagesService";

// Read-only, shared across every place packages need to be listed (Record
// Payment modal, Settings > Packages, anywhere else). Sharing the exact same
// ["packages"] query key means it's the same React Query cache entry
// everywhere — a package created/edited/deleted in Settings invalidates this
// key (see usePackagesSettings.ts) and any other mounted consumer picks up
// the change immediately, instead of each place doing its own one-off fetch
// that can silently drift out of sync with the others.
export const usePackages = () => {
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: () => packagesService.fetchPackages(),
  });

  return { packages, isLoading };
};

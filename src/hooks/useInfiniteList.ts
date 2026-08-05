// src/hooks/useInfiniteList.ts
"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Page } from "@/src/lib/pagination";

// Thin wrapper around React Query's useInfiniteQuery for the backend's
// keyset-paginated list endpoints. Pages are fetched by cursor, not offset,
// so PAGE_SIZE stays cheap no matter how deep the user has scrolled — see
// app/services/pagination.py on the backend for why.
export function useInfiniteList<TItem>({
  queryKey,
  queryFn,
  enabled = true,
}: {
  queryKey: unknown[];
  queryFn: (cursor: string | undefined) => Promise<Page<TItem>>;
  enabled?: boolean;
}) {
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => queryFn(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined),
    enabled,
  });

  const items = useMemo(() => query.data?.pages.flatMap((p) => p.items) ?? [], [query.data]);

  return {
    items,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}

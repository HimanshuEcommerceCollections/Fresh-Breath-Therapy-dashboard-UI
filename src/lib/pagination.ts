// src/lib/pagination.ts
//
// Shared shape for the backend's keyset-paginated list endpoints
// (app/services/pagination.py on the backend: Page[T] = {items, next_cursor,
// has_more}). Services map this 1:1 with snake_case -> camelCase.

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

// Loops a paginated endpoint to completion — for call sites that need the
// FULL result set (e.g. joining a client name onto a payment row, or a
// kanban board that groups by status), not the browsable page-at-a-time
// list the infinite-scroll tables show.
export async function fetchAllPages<T>(
  fetchPage: (cursor: string | undefined) => Promise<Page<T>>
): Promise<T[]> {
  const all: T[] = [];
  let cursor: string | undefined;
  for (;;) {
    const page = await fetchPage(cursor);
    all.push(...page.items);
    if (!page.hasMore || !page.nextCursor) break;
    cursor = page.nextCursor;
  }
  return all;
}

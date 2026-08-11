// src/services/importsService.ts
//
// Wired to app/routers/imports.py. Maps the backend's snake_case shapes to
// camelCase at the boundary, exactly like leadsService — so no component
// downstream ever sees a snake_case key.
//
// The flow is deliberately multi-step: nothing this service calls writes to
// a patient record until `commitChunk`. Upload and preview only populate the
// backend's import_rows staging table, which is what makes the review screen
// an actual dry run rather than a summary of something already done.

import { apiClient } from "@/src/lib/apiClient";

// ── entities ──────────────────────────────────────────────────────────────

export interface ImportField {
  name: string;
  label: string;
  kind: string;
  required: boolean;
  // "always" | "insert_only" | "never"
  writable: string;
  helpText: string | null;
  options: string[] | null;
}

export interface ImportEntity {
  key: string;
  label: string;
  fields: ImportField[];
  dependsOn: string[];
  notes: string[];
  existingCount: number;
  // False while a prerequisite entity is empty — importing clients before
  // any therapist exists would fail every row on a required foreign key.
  ready: boolean;
  blockedBy: string[];
}

// ── batch ─────────────────────────────────────────────────────────────────

export interface ColumnSuggestion {
  header: string;
  field: string | null;
  confidence: number;
  reason: string;
  samples: string[];
  distinctCount: number;
  // Fraction of sampled values that actually parse as the mapped field's
  // type. A low rate contradicts a confident-looking name match.
  parseRate: number | null;
  warning: string | null;
}

export interface ValueOption {
  sourceValue: string;
  count: number;
  mappedTo: string | null;
}

export interface ValueMapping {
  field: string;
  label: string;
  options: string[];
  values: ValueOption[];
}

export interface ImportBatch {
  id: string;
  entity: string;
  filename: string;
  status: string;
  totalRows: number;
  createCount: number;
  updateCount: number;
  skipCount: number;
  errorCount: number;
  migrationMode: boolean;
  dateOrder: string;
  createdAt: string;
  committedAt: string | null;
  error: string | null;
}

export interface ImportBatchDetail extends ImportBatch {
  columnMapping: Record<string, string | null>;
  columns: ColumnSuggestion[];
  valueMappings: ValueMapping[];
  unmappedRequired: string[];
  dateOrderConfident: boolean;
  headers: string[];
}

export interface FkCandidate {
  id: string;
  label: string;
}

export interface FkRowRef {
  rowNumber: number;
  label: string;
}

export interface FkGroup {
  // Stable id the answer is stored against. Includes the disambiguator, so
  // "Sarah Chen at Greensboro" and "Sarah Chen at Downtown" are two separately
  // answerable questions rather than one that would misfile half the rows.
  key: string;
  field: string;
  target: string;
  sourceValue: string;
  rowCount: number;
  status: string;
  // The context that split this group out of a larger one — the location
  // these particular rows belong to. Null when the name wasn't ambiguous.
  disambiguator: string | null;
  disambiguatorLabel: string | null;
  resolvedId: string | null;
  // "location" | "set per row" — set when something other than the name
  // itself resolved it, so the inference is visible and reversible.
  matchedBy: string | null;
  candidates: FkCandidate[];
  suggestion: FkCandidate | null;
  rows: FkRowRef[];
  message: string | null;
}

export interface PreviewRow {
  rowNumber: number;
  status: string;
  errors: {
    field: string | null;
    column: string | null;
    message: string;
    // The cell that failed. Never reaches `values` (that's what failing
    // means), so it's carried here to seed the inline correction box.
    value?: string | null;
  }[];
  diff: {
    changes?: Record<string, { from: unknown; to: unknown }>;
    refused?: Record<string, { current: unknown; sheet: unknown; reason: string }>;
    note?: string;
  } | null;
  values: Record<string, unknown>;
}

export interface ImportPreview {
  batch: ImportBatch;
  counts: Record<string, number>;
  fkGroups: FkGroup[];
  blockingFkCount: number;
  unmappedRequired: string[];
  valueMappings: ValueMapping[];
  rows: PreviewRow[];
  totalRows: number;
  canCommit: boolean;
  blockers: string[];
}

export interface CommitResult {
  processed: number;
  created: number;
  updated: number;
  failed: number;
  remaining: number;
  done: boolean;
  batch: ImportBatch;
}

export interface RollbackResult {
  deleted: number;
  reverted: number;
  enrollmentsRecomputed: number;
  batch: ImportBatch;
}

// ── API shapes ────────────────────────────────────────────────────────────

interface ApiField {
  name: string; label: string; kind: string; required: boolean;
  writable: string; help_text: string | null; options: string[] | null;
}
interface ApiEntity {
  key: string; label: string; fields: ApiField[]; depends_on: string[];
  notes: string[]; existing_count: number; ready: boolean; blocked_by: string[];
}
interface ApiColumn {
  header: string; field: string | null; confidence: number; reason: string;
  samples: string[]; distinct_count: number; parse_rate: number | null;
  warning: string | null;
}
interface ApiValueMapping {
  field: string; label: string; options: string[];
  values: { source_value: string; count: number; mapped_to: string | null }[];
}
interface ApiBatch {
  id: string; entity: string; filename: string; status: string;
  total_rows: number; create_count: number; update_count: number;
  skip_count: number; error_count: number; migration_mode: boolean;
  date_order: string; created_at: string; committed_at: string | null;
  error: string | null;
}
interface ApiBatchDetail extends ApiBatch {
  column_mapping: Record<string, string | null>;
  columns: ApiColumn[];
  value_mappings: ApiValueMapping[];
  unmapped_required: string[];
  date_order_confident: boolean;
  headers: string[];
}
interface ApiFkGroup {
  key: string; field: string; target: string; source_value: string;
  row_count: number; status: string;
  disambiguator: string | null; disambiguator_label: string | null;
  resolved_id: string | null; matched_by: string | null;
  candidates: { id: string; label: string }[];
  suggestion: { id: string; label: string } | null;
  rows: { row_number: number; label: string }[];
  message: string | null;
}
interface ApiPreviewRow {
  row_number: number; status: string;
  errors: { field: string | null; column: string | null; message: string }[];
  diff: PreviewRow["diff"]; values: Record<string, unknown>;
}
interface ApiPreview {
  batch: ApiBatch; counts: Record<string, number>; fk_groups: ApiFkGroup[];
  blocking_fk_count: number; unmapped_required: string[];
  value_mappings: ApiValueMapping[]; rows: ApiPreviewRow[];
  total_rows: number; can_commit: boolean; blockers: string[];
}

// ── mappers ───────────────────────────────────────────────────────────────

const toEntity = (e: ApiEntity): ImportEntity => ({
  key: e.key,
  label: e.label,
  dependsOn: e.depends_on,
  notes: e.notes,
  existingCount: e.existing_count,
  ready: e.ready,
  blockedBy: e.blocked_by,
  fields: e.fields.map((f) => ({
    name: f.name, label: f.label, kind: f.kind, required: f.required,
    writable: f.writable, helpText: f.help_text, options: f.options,
  })),
});

const toBatch = (b: ApiBatch): ImportBatch => ({
  id: b.id,
  entity: b.entity,
  filename: b.filename,
  status: b.status,
  totalRows: b.total_rows,
  createCount: b.create_count,
  updateCount: b.update_count,
  skipCount: b.skip_count,
  errorCount: b.error_count,
  migrationMode: b.migration_mode,
  dateOrder: b.date_order,
  createdAt: b.created_at,
  committedAt: b.committed_at,
  error: b.error,
});

const toValueMapping = (v: ApiValueMapping): ValueMapping => ({
  field: v.field,
  label: v.label,
  options: v.options,
  values: v.values.map((o) => ({
    sourceValue: o.source_value, count: o.count, mappedTo: o.mapped_to,
  })),
});

const toBatchDetail = (b: ApiBatchDetail): ImportBatchDetail => ({
  ...toBatch(b),
  columnMapping: b.column_mapping ?? {},
  columns: (b.columns ?? []).map((c) => ({
    header: c.header, field: c.field, confidence: c.confidence,
    reason: c.reason, samples: c.samples, distinctCount: c.distinct_count,
    parseRate: c.parse_rate, warning: c.warning,
  })),
  valueMappings: (b.value_mappings ?? []).map(toValueMapping),
  unmappedRequired: b.unmapped_required ?? [],
  dateOrderConfident: b.date_order_confident ?? true,
  headers: b.headers ?? [],
});

const toFkGroup = (g: ApiFkGroup): FkGroup => ({
  key: g.key,
  field: g.field,
  target: g.target,
  sourceValue: g.source_value,
  rowCount: g.row_count,
  status: g.status,
  disambiguator: g.disambiguator,
  disambiguatorLabel: g.disambiguator_label,
  resolvedId: g.resolved_id,
  matchedBy: g.matched_by,
  candidates: g.candidates,
  suggestion: g.suggestion,
  rows: (g.rows ?? []).map((r) => ({ rowNumber: r.row_number, label: r.label })),
  message: g.message,
});

// ── service ───────────────────────────────────────────────────────────────

export const importsService = {
  async fetchEntities(): Promise<ImportEntity[]> {
    const { data } = await apiClient.get<ApiEntity[]>("/api/imports/entities");
    return data.map(toEntity);
  },

  async fetchHistory(limit = 25): Promise<ImportBatch[]> {
    const { data } = await apiClient.get<ApiBatch[]>("/api/imports", {
      params: { limit },
    });
    return data.map(toBatch);
  },

  /**
   * Upload a sheet (or link one) and get the proposed mapping back.
   *
   * Sent as multipart because the file never becomes JSON — it is parsed in
   * memory on the server and only its rows are stored. Content-Type is left
   * unset so the browser adds the multipart boundary itself; the apiClient
   * default of application/json would break the upload.
   */
  async createImport(params: {
    entity: string;
    file?: File;
    sourceUrl?: string;
  }): Promise<ImportBatchDetail> {
    const form = new FormData();
    form.append("entity", params.entity);
    if (params.file) form.append("file", params.file);
    if (params.sourceUrl) form.append("source_url", params.sourceUrl);

    const { data } = await apiClient.post<ApiBatchDetail>("/api/imports", form, {
      headers: { "Content-Type": undefined as unknown as string },
    });
    return toBatchDetail(data);
  },

  async fetchBatch(batchId: string): Promise<ImportBatchDetail> {
    const { data } = await apiClient.get<ApiBatchDetail>(`/api/imports/${batchId}`);
    return toBatchDetail(data);
  },

  async updateMapping(
    batchId: string,
    payload: {
      columnMapping?: Record<string, string | null>;
      valueMapping?: Record<string, Record<string, string>>;
      dateOrder?: string;
      migrationMode?: boolean;
    }
  ): Promise<ImportBatchDetail> {
    const body: Record<string, unknown> = {};
    if (payload.columnMapping !== undefined) body.column_mapping = payload.columnMapping;
    if (payload.valueMapping !== undefined) body.value_mapping = payload.valueMapping;
    if (payload.dateOrder !== undefined) body.date_order = payload.dateOrder;
    if (payload.migrationMode !== undefined) body.migration_mode = payload.migrationMode;

    const { data } = await apiClient.patch<ApiBatchDetail>(
      `/api/imports/${batchId}/mapping`, body
    );
    return toBatchDetail(data);
  },

  /**
   * Two levels of answer.
   *
   * `groups` is keyed by group key — which already accounts for the
   * disambiguator, so the Greensboro rows and the Downtown rows are answered
   * separately. `rows` overrides individual rows and always wins, for when
   * even the location doesn't separate two same-named therapists.
   */
  async updateResolutions(
    batchId: string,
    payload: {
      groups?: Record<string, string>;
      rows?: Record<string, Record<string, string>>;
    }
  ): Promise<ImportBatch> {
    const { data } = await apiClient.patch<ApiBatch>(
      `/api/imports/${batchId}/resolutions`,
      { groups: payload.groups ?? {}, rows: payload.rows ?? {} }
    );
    return toBatch(data);
  },

  /**
   * Correct one row's values in place and get its new verdict back.
   *
   * A single mistyped email shouldn't mean re-exporting the spreadsheet and
   * re-uploading 150 rows. Corrections are stored per row on the server and
   * layered over the sheet's cell; the original stays readable.
   *
   * Sending a field as null clears the correction and falls back to the sheet.
   */
  async editRow(
    batchId: string,
    rowNumber: number,
    values: Record<string, unknown>
  ): Promise<PreviewRow> {
    const { data } = await apiClient.patch<ApiPreviewRow>(
      `/api/imports/${batchId}/rows/${rowNumber}`, { values }
    );
    return {
      rowNumber: data.row_number, status: data.status, errors: data.errors,
      diff: data.diff, values: data.values,
    };
  },

  /**
   * Create a record the sheet names but the database doesn't have, and
   * answer the question it was blocking, in one call.
   *
   * The alternative the UI used to offer for a not-found name was a dropdown
   * of every OTHER record — which is the wrong action entirely: picking an
   * unrelated client for "Isabella Grant" files her session against someone
   * else's chart.
   */
  async createMissingRecord(
    batchId: string,
    payload: {
      groupKey: string;
      target: string;
      values: Record<string, unknown>;
    }
  ): Promise<FkCandidate> {
    const { data } = await apiClient.post<{
      candidate: { id: string; label: string };
    }>(`/api/imports/${batchId}/records`, {
      group_key: payload.groupKey,
      target: payload.target,
      values: payload.values,
    });
    return data.candidate;
  },

  async fetchPreview(
    batchId: string,
    params: { offset?: number; limit?: number; only?: string } = {}
  ): Promise<ImportPreview> {
    const { data } = await apiClient.get<ApiPreview>(
      `/api/imports/${batchId}/preview`, { params }
    );
    return {
      batch: toBatch(data.batch),
      counts: data.counts,
      fkGroups: data.fk_groups.map(toFkGroup),
      blockingFkCount: data.blocking_fk_count,
      unmappedRequired: data.unmapped_required,
      valueMappings: (data.value_mappings ?? []).map(toValueMapping),
      rows: data.rows.map((r) => ({
        rowNumber: r.row_number, status: r.status, errors: r.errors,
        diff: r.diff, values: r.values,
      })),
      totalRows: data.total_rows,
      canCommit: data.can_commit,
      blockers: data.blockers,
    };
  },

  /**
   * Stored per-row verdicts, readable AFTER the commit.
   *
   * Distinct from fetchPreview, which re-validates and refuses to run on a
   * committed batch. This reports what actually happened, which is the only
   * way a finished import can explain why rows failed instead of just
   * counting them.
   */
  async fetchRows(
    batchId: string,
    params: { status?: string; limit?: number } = {}
  ): Promise<PreviewRow[]> {
    const { data } = await apiClient.get<ApiPreviewRow[]>(
      `/api/imports/${batchId}/rows`, { params }
    );
    return data.map((r) => ({
      rowNumber: r.row_number, status: r.status, errors: r.errors,
      diff: r.diff, values: r.values,
    }));
  },

  /**
   * Write one bounded slice. The caller loops until `done`.
   *
   * Chunked because the backend is serverless — a single call trying to write
   * thousands of rows would be killed at the function timeout partway
   * through. The server picks its slice by row status rather than an offset,
   * so a call that dies mid-way resumes where it stopped and never
   * double-writes.
   */
  async commitChunk(batchId: string, limit = 200): Promise<CommitResult> {
    const { data } = await apiClient.post<{
      processed: number; created: number; updated: number; failed: number;
      remaining: number; done: boolean; batch: ApiBatch;
    }>(`/api/imports/${batchId}/commit`, null, { params: { limit } });
    return { ...data, batch: toBatch(data.batch) };
  },

  async rollback(batchId: string): Promise<RollbackResult> {
    const { data } = await apiClient.post<{
      deleted: number; reverted: number; enrollments_recomputed: number;
      batch: ApiBatch;
    }>(`/api/imports/${batchId}/rollback`);
    return {
      deleted: data.deleted,
      reverted: data.reverted,
      enrollmentsRecomputed: data.enrollments_recomputed,
      batch: toBatch(data.batch),
    };
  },

  async discard(batchId: string): Promise<void> {
    await apiClient.delete(`/api/imports/${batchId}`);
  },
};

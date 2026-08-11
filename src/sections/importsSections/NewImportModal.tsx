"use client";

import { useRef, useState } from "react";
import { AlertCircle, FileSpreadsheet, Link2, Loader2, Upload, X } from "lucide-react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import {
  ACCEPTED_FILE_TYPES,
  isAcceptedFile,
} from "@/src/data/importsData/importsData";
import type { ImportEntity } from "@/src/services/importsService";

/**
 * Pick a file (or paste a Google Sheets link) for one already-chosen entity.
 *
 * The entity is chosen before this opens, which is what keeps the matching
 * job narrow: the server never has to infer *what* the sheet is, only where
 * its columns belong within a known schema.
 */
export default function NewImportModal({
  entity,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  entity: ImportEntity;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (params: {
    file?: File;
    sourceUrl?: string;
    migrationMode: boolean;
  }) => void;
}) {
  const [mode, setMode] = useState<"file" | "link">("file");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [migrationMode, setMigrationMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const canSubmit = mode === "file" ? Boolean(file) : sourceUrl.trim().length > 0;

  /**
   * Accept a file from either the picker or a drop.
   *
   * The extension is re-checked here because the input's `accept` attribute is
   * only a filter on the browse dialog — a drag-and-drop ignores it entirely,
   * so without this an .xls could be selected and only fail after upload.
   */
  const chooseFile = (picked: File | null | undefined) => {
    if (!picked) return;
    if (!isAcceptedFile(picked.name)) {
      setFile(null);
      setFileError(
        `"${picked.name}" isn't a supported file. Upload a .xlsx or .csv.`
      );
      return;
    }
    setFileError(null);
    setFile(picked);
  };

  const openFilePicker = () => inputRef.current?.click();

  const requiredFields = entity.fields.filter((f) => f.required);

  const handleSubmit = () => {
    if (!canSubmit || isSubmitting) return;
    onSubmit({
      file: mode === "file" ? (file ?? undefined) : undefined,
      sourceUrl: mode === "link" ? sourceUrl.trim() : undefined,
      migrationMode,
    });
  };

  const tabClass = (active: boolean) =>
    `flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "border-[#376EF4] bg-[#376EF4] text-white"
        : "border-[#E0E5EB] bg-white text-[#071123] hover:bg-[#F7FBFD]"
    }`;

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-140 rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_10px_30px_rgba(7,17,35,0.12)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#E0E5EB] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.3px] text-[#071123]">
              Import {entity.label}
            </h2>
            <p className="mt-0.5 text-sm text-[#596475]">
              Nothing is saved until you review it.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-[#596475] transition-colors hover:bg-[#F7FBFD]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex gap-2">
            <button
              type="button"
              // Opens the browse dialog as well as selecting the tab. Styled
              // as a primary action it reads as "give me a file dialog", and
              // only flipping an invisible mode is why it felt broken — the
              // dashed zone below was the sole way to actually pick a file.
              onClick={() => {
                setMode("file");
                openFilePicker();
              }}
              className={tabClass(mode === "file")}
            >
              <Upload size={15} /> Upload a file
            </button>
            <button type="button" onClick={() => setMode("link")} className={tabClass(mode === "link")}>
              <Link2 size={15} /> Paste a link
            </button>
          </div>

          {mode === "file" ? (
            <>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                chooseFile(e.dataTransfer.files?.[0]);
              }}
              onClick={openFilePicker}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
                isDragging
                  ? "border-[#376EF4] bg-[#F5F8FF]"
                  : "border-[#E0E5EB] bg-[#F7FBFD] hover:border-[#376EF4]"
              }`}
            >
              <FileSpreadsheet size={24} className="text-[#376EF4]" />
              {file ? (
                <>
                  <p className="text-sm font-medium text-[#071123]">{file.name}</p>
                  <p className="text-xs text-[#596475]">
                    {(file.size / 1024).toFixed(0)} KB · click to choose a different file
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-[#071123]">
                    Drop a spreadsheet here, or click to browse
                  </p>
                  <p className="text-xs text-[#596475]">Excel (.xlsx) or CSV</p>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_FILE_TYPES}
                className="hidden"
                // The programmatic .click() above dispatches a real click that
                // bubbles to this div's own onClick, which calls .click()
                // again — an infinite loop that can leave the dialog never
                // opening. Stop it at the input.
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  chooseFile(e.target.files?.[0]);
                  // Reset so re-picking the SAME file still fires onChange.
                  e.target.value = "";
                }}
              />
            </div>
            {fileError && (
              <p className="flex items-start gap-1.5 text-xs text-[#B91C1C]">
                <AlertCircle size={13} className="mt-0.5 shrink-0" />
                {fileError}
              </p>
            )}
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#071123]">
                Google Sheets link
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="w-full rounded-xl border border-[#E0E5EB] px-3.5 py-2.5 text-sm text-[#071123] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#376EF4]"
              />
              <p className="text-xs text-[#596475]">
                The sheet must be shared as <strong>Anyone with the link (Viewer)</strong>{" "}
                for us to read it.
              </p>
            </div>
          )}

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E0E5EB] bg-[#F7FBFD] px-3.5 py-3">
            <input
              type="checkbox"
              checked={migrationMode}
              onChange={(e) => setMigrationMode(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#376EF4]"
            />
            <span>
              <span className="block text-sm font-medium text-[#071123]">
                This is a one-off migration of old records
              </span>
              <span className="mt-0.5 block text-xs text-[#596475]">
                Lets the sheet set statuses on records that already exist. Leave
                this off for routine updates, or a stale sheet can undo status
                changes the team made in the dashboard.
              </span>
            </span>
          </label>

          <div className="rounded-xl bg-[#F7FBFD] px-3.5 py-3">
            <p className="text-xs font-medium text-[#071123]">
              Your sheet needs a column for each of these:
            </p>
            <p className="mt-1 text-xs text-[#596475]">
              {requiredFields.map((f) => f.label).join(" · ")}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-[#E0E5EB] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-[#E0E5EB] px-4 py-2 text-sm font-medium text-[#071123] transition-colors hover:bg-[#F7FBFD]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit || isSubmitting}
            onClick={handleSubmit}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#376EF4] px-4 py-2 text-sm font-medium text-[#FCFCFC] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && <Loader2 size={15} className="animate-spin" />}
            {isSubmitting ? "Reading sheet…" : "Continue"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// Small pastel pill, matching the lead-status badges used elsewhere.

export default function ImportStatusBadge({
  label,
  bg,
  text,
  title,
}: {
  label: string;
  bg: string;
  text: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className="inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  );
}

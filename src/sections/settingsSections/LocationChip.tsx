export default function LocationChip({ location }: { location: string }) {
  return (
    <div className="rounded-[4px] border border-[rgba(224,229,235,0.6)] px-3 py-2 text-sm font-normal tracking-[-0.154px] text-[#071123]">
      {location}
    </div>
  );
}

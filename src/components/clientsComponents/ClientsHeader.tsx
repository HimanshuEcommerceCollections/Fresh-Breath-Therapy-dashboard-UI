export default function ClientsHeader({
  count,
  onAddClient,
}: {
  count: number;
  onAddClient: () => void;
}) {
  return (
    <div className="flex flex-row items-end justify-between pb-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-[#071123]">
          Clients
        </h1>
        <p className="text-sm font-normal leading-5 tracking-[-0.154px] text-[#596475]">
          {count} active clients across the practice
        </p>
      </div>

      <button
        type="button"
        onClick={onAddClient}
        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#376EF4] px-4 py-2 text-sm font-medium text-[#FCFCFC] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M8 3.33203V12.6654"
            stroke="#FCFCFC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.33325 8H12.6666"
            stroke="#FCFCFC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Add Client
      </button>
    </div>
  );
}

export default function PTODashboardPageHeader() {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-[#071123]">
        PTO Dashboard
      </h1>
      <p className="text-sm font-normal leading-5 tracking-[-0.154px] text-[#596475]">
        Auto-accrual: 0.04 PTO hours per completed session
      </p>
    </div>
  );
}

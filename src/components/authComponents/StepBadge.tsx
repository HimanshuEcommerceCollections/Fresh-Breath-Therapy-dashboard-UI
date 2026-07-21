// src/components/authComponents/StepBadge.tsx

interface StepBadgeProps {
  label: string;
}

const StepBadge = ({ label }: StepBadgeProps) => {
  return (
    <span className="inline-flex items-center rounded-full bg-[#E6F0EC] px-3 py-1.5 text-[13px] font-semibold text-[#143A3D]">
      {label}
    </span>
  );
};

export default StepBadge;
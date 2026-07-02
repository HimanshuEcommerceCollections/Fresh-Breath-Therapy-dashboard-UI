"use client";

import { useEffect, type ReactNode } from "react";

// Shared modal scaffolding (Add Lead, Schedule Session): fixed centered
// overlay with backdrop blur, close on backdrop click or Escape. The card
// itself is passed as children and stops click propagation.
export default function ModalOverlay({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(15,23,42,0.5)] p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="contents">
        {children}
      </div>
    </div>
  );
}

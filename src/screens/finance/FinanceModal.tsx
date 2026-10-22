"use client";
import { dialogStyles, drawerStyles } from "@/components/ui/finance-styles";
import { cn } from "@/lib/utils";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
export default function FinanceModal({
  title,
  children,
  onClose,
  busy = false,
  variant = "modal",
  id,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  busy?: boolean;
  variant?: "modal" | "drawer";
  id?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const startedOnBackdrop = useRef(false);
  const [previousFocus] = useState(() =>
    typeof document === "undefined" ? null : document.activeElement,
  );
  const titleId = useId();
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => {
      element?.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus();
    };
  }, [previousFocus]);
  return (
    <dialog
      ref={dialog}
      id={id}
      className={cn(dialogStyles, variant === "drawer" && drawerStyles)}
      aria-labelledby={titleId}
      onPointerDown={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        startedOnBackdrop.current =
          event.button === 0 &&
          (event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom);
      }}
      onPointerCancel={() => {
        startedOnBackdrop.current = false;
      }}
      onClick={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const outside =
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom;
        if (
          !busy &&
          startedOnBackdrop.current &&
          outside &&
          event.target === event.currentTarget
        )
          onClose();
        startedOnBackdrop.current = false;
      }}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
    >
      <header>
        <div>
          <span
            className={cn(
              "eyebrow mb-2.5 block text-[length:11px] font-[650] tracking-[1.6px] text-[#727c91]",
            )}
          >
            {variant === "drawer" ? "REFINE SUA BUSCA" : "DO SEU JEITO"}
          </span>
          <h2 id={titleId}>{title}</h2>
        </div>
        <button
          className={cn(
            "icon-button [&:hover]:text-primary inline-grid h-7.5 w-7.5 shrink-0 place-items-center rounded-[7px] text-[#7a8396] [&:hover]:bg-[#e6eaf2]",
          )}
          type="button"
          aria-label="Fechar"
          disabled={busy}
          onClick={onClose}
        >
          <i aria-hidden="true" className="bi bi-x-lg" />
        </button>
      </header>
      {children}
    </dialog>
  );
}

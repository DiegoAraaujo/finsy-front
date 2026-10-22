"use client";
import { DotsRing } from "@/components/ui/dots-ring";
const Loading = ({
  label = "Carregando…",
  fullScreen = false,
}: {
  label?: string;
  fullScreen?: boolean;
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${fullScreen ? "min-h-dvh w-full" : "h-full min-h-64"}`}
      role="status"
      aria-label={label}
    >
      <DotsRing decorative />
      <p className="text-secundary text-sm">{label}</p>
    </div>
  );
};

export default Loading;

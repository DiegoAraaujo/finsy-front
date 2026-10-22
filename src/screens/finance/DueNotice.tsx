"use client";
import { cn } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { planning } from "../../services/planning";
import { useUser } from "../../hooks/user/useUser";
export default function DueNotice() {
  const { user } = useUser();
  const q = useQuery({
    queryKey: ["finance", user?.id, "reminders"],
    queryFn: planning.reminders,
    refetchInterval: 60000,
  });
  const entries = Array.isArray(q.data?.entries) ? q.data.entries : [];
  const overdue = entries.filter((e) => e.overdue && !e.isForecast).length;
  return (
    <Link
      className={cn(
        "text-button [&:hover]:text-primary planning-shortcut mb-5 inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
      )}
      href="/planning?tab=reminders"
    >
      <i aria-hidden="true" className="bi bi-bell" />
      {entries.length
        ? `${entries.length} pendências para acompanhar${overdue ? ` · ${overdue} vencidas` : ""}`
        : "Ver vencimentos e contas atrasadas"}
      <i aria-hidden="true" className="bi bi-arrow-right" />
    </Link>
  );
}

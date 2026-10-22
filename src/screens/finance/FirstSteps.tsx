"use client";
import {
  panelHeadingStyles,
  secondaryButtonStyles,
} from "@/components/ui/finance-styles";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import api from "../../services/api";
import { useUser } from "../../hooks/user/useUser";
import { userError } from "../../utils/userError";
import { DotsRing } from "@/components/ui/dots-ring";
export default function FirstSteps({ onAdd }: { onAdd: () => void }) {
  const { user } = useUser();
  const params = useSearchParams();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const q = useQuery({
    queryKey: ["account", user?.id, "onboarding"],
    queryFn: async () =>
      (
        await api.get<{
          onboardingAt: string | null;
        }>("/users/preferences")
      ).data,
  });
  const requested = params.get("welcome") === "1";
  if (dismissed || (!requested && q.data?.onboardingAt !== null)) return null;
  async function done() {
    if (busy) return;
    setBusy(true);
    try {
      await api.put("/users/preferences", { onboardingComplete: true });
      setDismissed(true);
      if (requested) {
        const next = new URLSearchParams(params);
        next.delete("welcome");
        router.replace("?" + next.toString(), { scroll: false });
      }
      await q.refetch();
    } catch (e) {
      setError(userError(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      className={cn(
        "finance-panel first-steps [&_li::before]:text-primary my-5 overflow-hidden rounded-xl border border-[#dfe2e9] bg-white p-6 max-[761px]:p-4.5 [&_.panel-heading]:mb-4.5 [&_.panel-heading]:flex-wrap [&_.panel-heading]:gap-3.5 [&_.panel-heading]:p-0 [&_h2]:text-[length:14px] [&_h2]:font-[650] [&_h2]:text-[#2f394e] max-[761px]:[&_h2]:text-[length:14px] [&_li]:text-[length:13px] [&_li]:leading-[1.8] [&_li_p]:my-2.5 [&_li_p]:text-[#718099] [&_li::before]:mb-3 [&_li::before]:grid [&_li::before]:h-7.5 [&_li::before]:w-7.5 [&_li::before]:place-items-center [&_li::before]:rounded-full [&_li::before]:bg-[#edf3ff] [&_li::before]:[content:counter(first-steps)] [&_li::before]:[counter-increment:first-steps] [&_ol]:mx-0 [&_ol]:my-5.5 [&_ol]:grid [&_ol]:grid-cols-3 [&_ol]:gap-5 [&_ol]:[counter-reset:first-steps] max-[761px]:[&_ol]:grid-cols-[1fr]",
      )}
    >
      <div className={cn(panelHeadingStyles)}>
        <div>
          <h2>Comece do seu jeito</h2>
          <p>
            Você pode acompanhar só os gastos. Não precisa informar salário.
          </p>
        </div>
      </div>
      <ol>
        <li>
          <strong>Registre uma despesa</strong>
          <p>
            Informe valor, descrição e data. Se ainda não pagou, escolha “A
            pagar”.
          </p>
          <button
            className={cn(
              "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
            )}
            onClick={onAdd}
          >
            Registrar despesa
          </button>
        </li>
        <li>
          <strong>Organize em categorias</strong>
          <p>
            Crie nomes que façam sentido para você, como Mercado ou Transporte.
          </p>
          <Link
            className={cn(
              "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
            )}
            href="/categories"
          >
            Organizar categorias
          </Link>
        </li>
        <li>
          <strong>Defina limites, se quiser</strong>
          <p>Escolha quanto pretende gastar por categoria e acompanhe o mês.</p>
          <Link
            className={cn(
              "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
            )}
            href="/categories"
          >
            Conhecer limites
          </Link>
        </li>
      </ol>
      {error && (
        <p
          role="alert"
          className={cn(
            "form-error rounded-[7px] bg-[#fff1eb] p-2.5 text-[length:13px] text-[#a54c36]",
          )}
        >
          {error}
        </p>
      )}
      <button
        className={cn(secondaryButtonStyles)}
        disabled={busy}
        onClick={() => void done()}
      >
        {busy && <DotsRing decorative size={18} />}Entendi, vamos começar
      </button>
    </section>
  );
}

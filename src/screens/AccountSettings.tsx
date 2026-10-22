"use client";
import {
  pageHeaderStyles,
  panelStyles,
  secondaryButtonStyles,
  formStyles,
} from "@/components/ui/finance-styles";

import { cn } from "@/lib/utils";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../services/api";
import { downloadJson } from "../services/planning";
import { userError } from "../utils/userError";
import { useUser } from "../hooks/user/useUser";
import { useLogout } from "../hooks/user/useLogout";
import { removeAccessToken, removeRefreshToken } from "../utils/auth";
import FinanceModal from "./finance/FinanceModal";
import { DotsRing } from "@/components/ui/dots-ring";
import { passwordError } from "../utils/validation";
import ProfileSettings from "./settings/components/ProfileSettings";
import LegalSettings from "./settings/components/LegalSettings";

type Session = {
  id: string;
  createdAt: string;
  expiresAt: string;
  current: boolean;
};
export default function AccountSettings() {
  const { user, setUser } = useUser();
  const client = useQueryClient();
  const router = useRouter();
  const logout = useLogout();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const preferences = useQuery({
    queryKey: ["account", user?.id, "preferences"],
    queryFn: async () =>
      (
        await api.get<{
          reminderDays: number;
        }>("/users/preferences")
      ).data,
  });
  const sessions = useQuery({
    queryKey: ["account", user?.id, "sessions"],
    queryFn: async () => (await api.get<Session[]>("/users/sessions")).data,
  });
  const support = useQuery({
    queryKey: ["account", user?.id, "support"],
    queryFn: async () =>
      (
        await api.get<{
          email: string | null;
        }>("/users/support")
      ).data,
  });
  async function action(fn: () => Promise<unknown>, message?: string) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await fn();
      if (message) toast.success(message);
    } catch (e) {
      setError(userError(e));
    } finally {
      setBusy(false);
    }
  }
  async function deleteAccount(e: FormEvent) {
    e.preventDefault();
    const invalid = passwordError(password);
    if (invalid) {
      setError(invalid);
      return;
    }
    if (confirm !== "EXCLUIR") return;
    await action(async () => {
      await api.post("/users/delete-account", {
        password,
        confirmation: confirm,
      });
      removeAccessToken();
      removeRefreshToken();
      client.clear();
      setUser(null);
      router.replace("/login");
    }, "Sua conta e seus dados foram excluídos.");
  }
  const date = (s: string) => new Date(s).toLocaleString("pt-BR");
  return (
    <div
      className={cn(
        "finance-page planning-page flex flex-col gap-5.5 max-[761px]:gap-4.5 [&_.finance-panel]:p-6 max-[761px]:[&_.finance-panel]:p-4.5 [&_.finance-panel_>_h2]:mb-2.5 [&_.finance-panel_h3]:mt-5.5 [&_.finance-panel_h3]:text-[length:14px] [&_.finance-panel_h3]:font-semibold [&_.form-note]:mt-2.5 [&_.form-note]:mr-0 [&_.form-note]:mb-4 [&_.form-note]:ml-0 [&_.panel-heading]:mb-4.5 [&_.panel-heading]:flex-wrap [&_.panel-heading]:gap-3.5 [&_.panel-heading]:p-0 [&_.primary-button]:mt-3 [&_h1]:text-[length:clamp(23px,_2.3vw,_32px)] [&_h1]:leading-[1.25] [&_h1]:font-semibold [&_h1]:tracking-[-1.2px] [&_h1]:text-[#2a3346] max-[761px]:[&_h1]:text-[length:27px] max-[421px]:[&_h1]:text-[length:25px]",
      )}
    >
      <header className={cn(pageHeaderStyles)}>
        <div>
          <p
            className={cn(
              "eyebrow mb-2.5 block text-[length:11px] font-[650] tracking-[1.6px] text-[#727c91]",
            )}
          >
            SUA CONTA
          </p>
          <h1>Configurações</h1>
          <p
            className={cn(
              "page-subtitle mt-2.5 text-[length:13px] leading-[1.7] text-[#666f82] max-[761px]:text-[length:12px]",
            )}
          >
            Segurança, preferências e seus dados.
          </p>
        </div>
      </header>
      {error && !deleting && (
        <p
          role="alert"
          className={cn(
            "form-error rounded-[7px] bg-[#fff1eb] p-2.5 text-[length:13px] text-[#a54c36]",
          )}
        >
          {error}
        </p>
      )}
      <section className={cn(panelStyles)}>
        <ProfileSettings
          key={user?.id}
          disabled={busy || logout.isPending}
          onBusyChange={setBusy}
        />
        <h3>Sessões ativas</h3>
        {sessions.isPending && (
          <DotsRing label="Carregando sessões" size={24} />
        )}
        {sessions.isError && (
          <button
            className={cn(
              "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
            )}
            onClick={() => void sessions.refetch()}
          >
            Tentar carregar sessões novamente
          </button>
        )}
        <div
          className={cn(
            "session-list [&_article]:flex [&_article]:items-center [&_article]:gap-4 [&_article]:border-b [&_article]:border-b-[#edf0f6] [&_article]:px-0 [&_article]:py-4.5 [&_article]:text-[length:13px] max-[761px]:[&_article]:flex-wrap [&_article_>_div]:min-w-0 [&_article_>_div]:flex-1 [&_small]:mt-1.5 [&_small]:block [&_small]:text-[length:11px] [&_small]:leading-[1.7] [&_small]:text-[#718099] [&_strong]:[overflow-wrap:anywhere]",
          )}
        >
          {Array.isArray(sessions.data) &&
            sessions.data.map((s) => (
              <article key={s.id}>
                <div>
                  <strong>{s.current ? "Esta sessão" : "Outra sessão"}</strong>
                  <small>
                    Iniciada em {date(s.createdAt)} · Expira em{" "}
                    {date(s.expiresAt)}
                  </small>
                </div>
                {!s.current && (
                  <button
                    className={cn(
                      "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
                    )}
                    disabled={busy}
                    onClick={() =>
                      void action(async () => {
                        await api.delete(`/users/sessions/${s.id}`);
                        await sessions.refetch();
                      }, "Sessão encerrada.")
                    }
                  >
                    Encerrar
                  </button>
                )}
              </article>
            ))}
        </div>
      </section>
      <section className={cn(panelStyles)}>
        <h2>Vencimentos</h2>
        <p
          className={cn(
            "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
          )}
        >
          Escolha com quantos dias de antecedência os avisos aparecem dentro do
          app.
        </p>
        {preferences.data && (
          <label
            className={cn(
              "planning-period flex flex-col gap-2.5 self-start text-[length:13px] [&_input]:min-h-11 [&_input]:rounded-[10px] [&_input]:border [&_input]:border-[#d4dced] [&_input]:bg-white [&_input]:p-3 [&_input]:text-[#303c57] [&_select]:min-h-11 [&_select]:rounded-[10px] [&_select]:border [&_select]:border-[#d4dced] [&_select]:bg-white [&_select]:p-3 [&_select]:text-[#303c57]",
            )}
          >
            Antecedência
            <select
              aria-label="Antecedência dos lembretes"
              disabled={busy}
              value={preferences.data.reminderDays}
              onChange={(e) =>
                void action(async () => {
                  await api.put("/users/preferences", {
                    reminderDays: Number(e.target.value),
                  });
                  await preferences.refetch();
                  await client.invalidateQueries({ queryKey: ["finance"] });
                }, "Preferência salva.")
              }
            >
              {Array.from({ length: 15 }, (_, i) => (
                <option key={i} value={i}>
                  {i === 0
                    ? "No dia do vencimento"
                    : `${i} ${i === 1 ? "dia antes" : "dias antes"}`}
                </option>
              ))}
            </select>
          </label>
        )}
        {preferences.isError && (
          <button
            className={cn(
              "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
            )}
            onClick={() => void preferences.refetch()}
          >
            Tentar carregar preferências novamente
          </button>
        )}
      </section>
      <section className={cn(panelStyles)}>
        <h2>Seus dados</h2>
        <p
          className={cn(
            "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
          )}
        >
          Baixe uma cópia com suas movimentações, categorias, limites, cartões e
          histórico anterior. O arquivo contém dados pessoais; guarde em um
          lugar seguro.
        </p>
        <div
          className={cn(
            "planning-actions flex flex-wrap items-center gap-3 max-[761px]:[&_.secondary-button]:w-full max-[761px]:[&_.secondary-button]:justify-center",
          )}
        >
          <button
            className={cn(secondaryButtonStyles)}
            disabled={busy}
            onClick={() =>
              void action(
                async () =>
                  downloadJson(
                    (await api.get("/users/export")).data,
                    "finsy-meus-dados.json",
                  ),
                "Cópia dos dados preparada.",
              )
            }
          >
            {busy && <DotsRing decorative size={18} />}Exportar todos os dados
          </button>
          <button
            className={cn(
              "text-button [&:hover]:text-primary danger-action inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774] text-[#b83b48]",
            )}
            disabled={busy}
            onClick={() => {
              setError("");
              setDeleting(true);
            }}
          >
            Excluir minha conta
          </button>
        </div>
      </section>
      <section className={cn(panelStyles)}>
        <LegalSettings />
        <h2>Ajuda</h2>
        <p
          className={cn(
            "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
          )}
        >
          Registre despesas sem informar salário. Categorias organizam seus
          gastos; limites são opcionais. Use “A pagar” para acompanhar
          vencimentos.
        </p>
        <div
          className={cn(
            "settings-links my-[15px] flex flex-wrap items-center gap-3",
          )}
        >
          <Link
            className={cn(
              "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
            )}
            href="/home?welcome=1"
          >
            Rever primeiros passos
          </Link>
          {support.data?.email ? (
            <a
              className={cn(
                "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
              )}
              href={`mailto:${support.data.email}`}
            >
              Falar com o suporte
            </a>
          ) : (
            <p
              className={cn(
                "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
              )}
            >
              O canal de suporte ainda não foi disponibilizado.
            </p>
          )}
        </div>
      </section>
      <button
        className={cn(secondaryButtonStyles)}
        disabled={busy || logout.isPending}
        onClick={() =>
          logout.mutate(undefined, { onSuccess: () => setUser(null) })
        }
      >
        {logout.isPending && <DotsRing decorative size={18} />}Sair da conta
      </button>
      {deleting && (
        <FinanceModal
          title="Excluir sua conta?"
          onClose={() => setDeleting(false)}
          busy={busy}
        >
          <form className={cn(formStyles)} onSubmit={deleteAccount}>
            <p>
              Suas movimentações, categorias, limites e cartões serão apagados
              permanentemente. Exporte seus dados antes de continuar.
            </p>
            <label>
              Sua senha
              <input
                type="password"
                required
                autoComplete="current-password"
                maxLength={72}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label>
              Digite EXCLUIR para confirmar
              <input
                required
                pattern="EXCLUIR"
                autoComplete="off"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </label>
            {error && (
              <p
                className={cn(
                  "form-error rounded-[7px] bg-[#fff1eb] p-2.5 text-[length:13px] text-[#a54c36]",
                )}
                role="alert"
              >
                {error}
              </p>
            )}
            <button
              className={cn(
                "primary-button bg-primary border-primary danger-button inline-flex items-center justify-center gap-2.5 rounded-lg border bg-[#b83b48] px-[19px] py-[13px] text-[length:13px] leading-[1.4] font-semibold whitespace-nowrap text-white shadow-[0_3px_6px_#2d374b10] [&:hover]:bg-[#1038b8]",
              )}
              disabled={busy || confirm !== "EXCLUIR"}
            >
              {busy && (
                <DotsRing decorative size={18} className="text-current" />
              )}
              Excluir conta e dados
            </button>
          </form>
        </FinanceModal>
      )}
    </div>
  );
}

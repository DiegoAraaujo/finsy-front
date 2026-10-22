"use client";
import {
  pageHeaderStyles,
  panelStyles,
  panelHeadingStyles,
  primaryButtonStyles,
  formStyles,
} from "@/components/ui/finance-styles";

import { cn } from "@/lib/utils";
import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { planning, type Card } from "../../services/planning";
import { localDate } from "../../services/finance";
import { useUser } from "../../hooks/user/useUser";
import { userError } from "../../utils/userError";
import FinanceModal from "../finance/FinanceModal";
import CurrencyInput from "../../components/CurrencyInput";
import { DotsRing } from "@/components/ui/dots-ring";
import RecurrencesPanel from "./RecurrencesPanel";
import ImportPanel from "./ImportPanel";
import FutureExpensesPanel from "./FutureExpensesPanel";
import { textError, moneyError, dayError } from "../../utils/validation";
const money = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const date = (s: string) => s.split("-").reverse().join("/");
export function QueryState({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error: boolean;
  retry: () => void;
}) {
  if (loading)
    return (
      <div
        className={cn(
          "planning-state flex items-center justify-center gap-3.5 px-2.5 py-7.5 text-center text-[length:13px] text-[#737f96]",
        )}
        role="status"
      >
        <DotsRing decorative />
        <p>Carregando…</p>
      </div>
    );
  if (error)
    return (
      <div
        className={cn(
          "planning-state flex items-center justify-center gap-3.5 px-2.5 py-7.5 text-center text-[length:13px] text-[#737f96]",
        )}
        role="alert"
      >
        <p>Não foi possível carregar agora.</p>
        <button
          className={cn(
            "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
          )}
          onClick={retry}
        >
          Tentar novamente
        </button>
      </div>
    );
  return null;
}
export default function Planning() {
  const params = useSearchParams();
  const router = useRouter();
  const active = params.get("tab") ?? "comparison";
  const [period, setPeriod] = useState(() => {
    const value = params.get("period") ?? "";
    return /^\d{4}-(0[1-9]|1[0-2])$/.test(value) &&
      value >= "1900-01" &&
      value <= "2100-12"
      ? value
      : localDate().slice(0, 7);
  });
  const tabs = [
    ["future", "Gastos planejados"],
    ["comparison", "Comparar meses"],
    ["cards", "Cartões e faturas"],
    ["recurrences", "Recorrências"],
    ["reminders", "Vencimentos"],
    ["import", "Importar extrato"],
  ];
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
            MAIS CLAREZA PARA DECIDIR
          </p>
          <h1>Planejamento</h1>
          <p
            className={cn(
              "page-subtitle mt-2.5 text-[length:13px] leading-[1.7] text-[#666f82] max-[761px]:text-[length:12px]",
            )}
          >
            Compare seus gastos, acompanhe vencimentos e organize seus cartões.
          </p>
        </div>
      </header>
      <div
        className={cn(
          "planning-tabs [&_button.selected]:text-primary flex flex-wrap items-center gap-3 border-b border-b-[#dce1ec] pb-3 max-[761px]:gap-2 [&_button]:cursor-pointer [&_button]:rounded-xl [&_button]:border [&_button]:border-[#dce1ec] [&_button]:bg-white [&_button]:px-4 [&_button]:py-3 [&_button]:text-[length:13px] max-[761px]:[&_button]:flex-[1_1_44%] max-[761px]:[&_button]:px-2 max-[761px]:[&_button]:py-3 max-[761px]:[&_button]:text-[length:12px] [&_button.selected]:border-[#91aaf5] [&_button.selected]:bg-[#eaf0ff]",
        )}
        role="group"
        aria-label="Ferramentas de planejamento"
      >
        {tabs.map(([key, label]) => (
          <button
            key={key}
            className={active === key ? "selected" : ""}
            aria-pressed={active === key}
            onClick={() => router.push("?tab=" + key, { scroll: false })}
          >
            {label}
          </button>
        ))}
      </div>
      {["comparison", "cards"].includes(active) && (
        <label
          className={cn(
            "planning-period flex flex-col gap-2.5 self-start text-[length:13px] [&_input]:min-h-11 [&_input]:rounded-[10px] [&_input]:border [&_input]:border-[#d4dced] [&_input]:bg-white [&_input]:p-3 [&_input]:text-[#303c57] [&_select]:min-h-11 [&_select]:rounded-[10px] [&_select]:border [&_select]:border-[#d4dced] [&_select]:bg-white [&_select]:p-3 [&_select]:text-[#303c57]",
          )}
        >
          {active === "cards"
            ? "Mês de vencimento da fatura"
            : "Mês de referência"}
          <input
            aria-label={
              active === "cards"
                ? "Mês de vencimento da fatura"
                : "Mês de referência"
            }
            type="month"
            min="1900-01"
            max="2100-12"
            value={period}
            onChange={(e) => {
              if (
                /^\d{4}-(0[1-9]|1[0-2])$/.test(e.target.value) &&
                e.target.value >= "1900-01" &&
                e.target.value <= "2100-12"
              )
                setPeriod(e.target.value);
            }}
          />
        </label>
      )}
      {active === "comparison" && <ComparisonPanel period={period} />}
      {active === "future" && <FutureExpensesPanel />}
      {active === "cards" && <CardsPanel period={period} />}
      {active === "recurrences" && <RecurrencesPanel />}
      {active === "reminders" && <ReminderPanel />}
      {active === "import" && <ImportPanel />}
    </div>
  );
}
function ComparisonPanel({ period }: { period: string }) {
  const { user } = useUser();
  const q = useQuery({
    queryKey: ["finance", user?.id, "comparison", period],
    queryFn: () => planning.comparison(period),
  });
  const d = q.data;
  const difference = d
    ? Math.round((d.current.expenses - d.previous.expenses) * 100) / 100
    : 0;
  return (
    <section className={cn(panelStyles)}>
      <h2>Seus gastos em perspectiva</h2>
      <p
        className={cn(
          "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
        )}
      >
        Despesas realizadas e parcelas do mês escolhido em comparação com o mês
        anterior. Cobranças ainda planejadas ficam fora desta comparação.
      </p>
      <QueryState
        loading={q.isPending}
        error={q.isError}
        retry={() => void q.refetch()}
      />
      {d && (
        <>
          <div
            className={cn(
              "comparison-totals [&_strong]:text-primary my-5 grid grid-cols-2 gap-4 max-[761px]:gap-2.5 [&_article]:flex [&_article]:flex-col [&_article]:gap-3 [&_article]:rounded-[14px] [&_article]:bg-[#f1f4fb] [&_article]:p-5 max-[761px]:[&_article]:p-3.5 [&_span]:text-[length:12px] [&_span]:text-[#718099] [&_strong]:text-[length:clamp(21px,_3vw,_32px)] [&_strong]:font-[550] [&_strong]:[overflow-wrap:anywhere]",
            )}
          >
            <article>
              <span>Mês anterior · {d.previousPeriod}</span>
              <strong>{money(d.previous.expenses)}</strong>
            </article>
            <article>
              <span>Mês escolhido · {d.period}</span>
              <strong>{money(d.current.expenses)}</strong>
            </article>
          </div>
          <p
            className={cn(
              "comparison-message rounded-xl bg-[#edf3ff] p-4 text-[length:14px] leading-[1.8] text-[#244b9a]",
            )}
          >
            {difference === 0
              ? "Os gastos ficaram no mesmo valor."
              : `${money(Math.abs(difference))} ${difference > 0 ? "a mais" : "a menos"} que no mês anterior.`}
            {d.previous.expenses > 0 && difference !== 0
              ? ` Variação de ${Math.abs(
                  (difference / d.previous.expenses) * 100,
                )
                  .toFixed(1)
                  .replace(
                    ".",
                    ",",
                  )}% ${difference > 0 ? "para cima" : "para baixo"}.`
              : ""}
          </p>
          {d.categories.length ? (
            <div
              className={cn(
                "comparison-list [&_article]:grid [&_article]:grid-cols-[1.2fr_1fr_1fr_1fr] [&_article]:items-center [&_article]:gap-3 [&_article]:border-b [&_article]:border-b-[#edf0f6] [&_article]:px-0 [&_article]:py-5 [&_article]:text-[length:12px] max-[761px]:[&_article]:grid-cols-[1fr_1fr] max-[761px]:[&_article_>_strong]:col-span-full",
              )}
            >
              {d.categories.map((c) => (
                <article key={c.id}>
                  <strong>{c.name}</strong>
                  <span>Anterior: {money(c.previous)}</span>
                  <span>Atual: {money(c.current)}</span>
                  <small>
                    {c.current === c.previous
                      ? "Mesmo valor"
                      : `${money(Math.abs(c.current - c.previous))} ${c.current > c.previous ? "a mais" : "a menos"}`}
                  </small>
                </article>
              ))}
            </div>
          ) : (
            <p
              className={cn(
                "planning-state flex items-center justify-center gap-3.5 px-2.5 py-7.5 text-center text-[length:13px] text-[#737f96]",
              )}
            >
              Registre despesas realizadas para começar a comparar.
            </p>
          )}
        </>
      )}
    </section>
  );
}
export function ReminderPanel({ compact = false }: { compact?: boolean }) {
  const { user } = useUser();
  const q = useQuery({
    queryKey: ["finance", user?.id, "reminders"],
    queryFn: planning.reminders,
    refetchInterval: 60000,
  });
  return (
    <section className={cn(panelStyles)}>
      <div className={cn(panelHeadingStyles)}>
        <div>
          <h2>Vencimentos</h2>
          <p>
            Contas vencidas e dos próximos {q.data?.reminderDays ?? 3} dias.
          </p>
        </div>
        {compact && (
          <Link
            className={cn(
              "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
            )}
            href="/planning?tab=reminders"
          >
            Ver todas
          </Link>
        )}
      </div>
      <QueryState
        loading={q.isPending}
        error={q.isError}
        retry={() => void q.refetch()}
      />
      {q.data &&
        (q.data.entries.length ? (
          <div
            className={cn(
              "reminder-list [&_.bi]:text-primary [&_.bi]:text-[length:22px] [&_article]:flex [&_article]:items-center [&_article]:gap-4 [&_article]:border-b [&_article]:border-b-[#edf0f6] [&_article]:px-0 [&_article]:py-4.5 [&_article]:text-[length:13px] max-[761px]:[&_article]:flex-wrap max-[761px]:[&_article]:gap-2.5 max-[761px]:[&_article_>_a]:ml-auto [&_article_>_div]:min-w-0 [&_article_>_div]:flex-1 max-[761px]:[&_article_>_div]:basis-[65%] [&_small]:mt-1.5 [&_small]:block [&_small]:text-[length:11px] [&_small]:leading-[1.7] [&_small]:text-[#718099] [&_strong]:[overflow-wrap:anywhere]",
            )}
          >
            {q.data.entries.slice(0, compact ? 3 : 100).map((e) => (
              <article key={e.id}>
                <i
                  aria-hidden="true"
                  className={`bi bi-${e.overdue ? "exclamation-circle" : "calendar2-check"}`}
                />
                <div>
                  <strong>{e.description}</strong>
                  <small>
                    {e.isForecast
                      ? "Conferir cobrança planejada"
                      : e.kind === "EXPENSE"
                        ? "A pagar"
                        : "A receber"}{" "}
                    · {date(e.date)} ·{" "}
                    {e.isForecast
                      ? "Confirme quando acontecer"
                      : e.overdue
                        ? "Vencida"
                        : e.date === q.data.today
                          ? "Hoje"
                          : "Próxima do vencimento"}
                  </small>
                </div>
                <strong>{money(e.amount)}</strong>
                <Link
                  className={cn(
                    "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
                  )}
                  href={`/transactions?entry=${e.id}&period=${e.period ?? e.date.slice(0, 7)}`}
                >
                  Revisar
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p
            className={cn(
              "planning-state flex items-center justify-center gap-3.5 px-2.5 py-7.5 text-center text-[length:13px] text-[#737f96]",
            )}
          >
            Nenhuma pendência próxima do vencimento.
          </p>
        ))}
      {!compact && (
        <p
          className={cn(
            "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
          )}
        >
          Estes avisos aparecem ao abrir o app. Ajuste a antecedência em
          Configurações.
        </p>
      )}
    </section>
  );
}
function CardsPanel({ period }: { period: string }) {
  const params = useSearchParams();
  const { user } = useUser();
  const client = useQueryClient();
  const q = useQuery({
    queryKey: ["finance", user?.id, "cards"],
    queryFn: planning.cards,
  });
  const [editing, setEditing] = useState<Card | "new" | null>(null);
  const [selected, setSelected] = useState<number | null>(() => {
    const id = Number(params.get("card"));
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  });
  const [busy, setBusy] = useState(false);
  const [confirmPay, setConfirmPay] = useState(false);
  const [paymentDate, setPaymentDate] = useState(localDate());
  const cards = Array.isArray(q.data) ? q.data : [];
  const card =
    cards.find((c) => c.id === selected) ??
    cards.find((c) => !c.archivedAt) ??
    cards[0];
  const invoice = useQuery({
    queryKey: ["finance", user?.id, "invoice", card?.id, period],
    queryFn: () => planning.invoice(card!.id, period),
    enabled: !!card,
  });
  async function act(action: () => Promise<unknown>) {
    if (busy) return;
    setBusy(true);
    try {
      await action();
      await client.invalidateQueries({ queryKey: ["finance"] });
      setConfirmPay(false);
      toast.success("Tudo salvo.");
    } catch (e) {
      toast.error(userError(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <section className={cn(panelStyles)}>
        <div className={cn(panelHeadingStyles)}>
          <div>
            <h2>Seus cartões</h2>
            <p>
              Cadastre apenas nome, limite e datas. Não pedimos número nem
              código de segurança.
            </p>
          </div>
          <button
            className={cn(primaryButtonStyles)}
            onClick={() => setEditing("new")}
          >
            Novo cartão
          </button>
        </div>
        <QueryState
          loading={q.isPending}
          error={q.isError}
          retry={() => void q.refetch()}
        />
        <div
          className={cn(
            "card-options [&_button.selected]:text-primary flex flex-wrap items-center gap-3 [&_button]:flex [&_button]:cursor-pointer [&_button]:items-center [&_button]:gap-2 [&_button]:rounded-xl [&_button]:border [&_button]:border-[#dce1ec] [&_button]:bg-white [&_button]:px-4 [&_button]:py-3 [&_button]:text-[length:13px] [&_button.selected]:border-[#91aaf5] [&_button.selected]:bg-[#eaf0ff]",
          )}
        >
          {cards.map((c) => (
            <button
              key={c.id}
              className={card?.id === c.id ? "selected" : ""}
              aria-pressed={card?.id === c.id}
              onClick={() => setSelected(c.id)}
            >
              <i aria-hidden="true" className="bi bi-credit-card" />
              {c.name}
              {c.archivedAt ? " · Arquivado" : ""}
            </button>
          ))}
        </div>
        {!q.isPending && !q.isError && !cards.length && (
          <p
            className={cn(
              "planning-state flex items-center justify-center gap-3.5 px-2.5 py-7.5 text-center text-[length:13px] text-[#737f96]",
            )}
          >
            Cadastre seu primeiro cartão para organizar as compras e faturas.
          </p>
        )}
        {card && (
          <div
            className={cn("card-details mt-5 text-[length:13px] leading-[1.8]")}
          >
            <p>
              Fecha dia <strong>{card.closingDay}</strong> · Vence dia{" "}
              <strong>{card.dueDay}</strong> · Limite {money(card.limit)}
            </p>
            <div
              className={cn(
                "planning-actions flex flex-wrap items-center gap-3 max-[761px]:[&_.secondary-button]:w-full max-[761px]:[&_.secondary-button]:justify-center",
              )}
            >
              {!card.archivedAt && (
                <button
                  className={cn(
                    "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
                  )}
                  onClick={() => setEditing(card)}
                >
                  Editar cartão
                </button>
              )}
              <button
                className={cn(
                  "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
                )}
                disabled={busy}
                onClick={() =>
                  void act(() =>
                    card.archivedAt
                      ? planning.restoreCard(card.id)
                      : planning.archiveCard(card.id),
                  )
                }
              >
                {card.archivedAt ? "Restaurar cartão" : "Arquivar cartão"}
              </button>
            </div>
            <p
              className={cn(
                "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
              )}
            >
              Compras no dia do fechamento entram na próxima fatura. Mudanças
              nas datas valem apenas para novas compras.
            </p>
          </div>
        )}
      </section>
      {card && (
        <section className={cn(panelStyles)}>
          <div className={cn(panelHeadingStyles)}>
            <div>
              <h2>Fatura de {card.name}</h2>
              <p>
                Vencimento da fatura · {period.split("-").reverse().join("/")}
              </p>
              <p>As compras abaixo mostram a data em que foram realizadas.</p>
            </div>
          </div>
          <QueryState
            loading={invoice.isPending}
            error={invoice.isError}
            retry={() => void invoice.refetch()}
          />
          {invoice.data && (
            <>
              <div
                className={cn(
                  "comparison-totals [&_strong]:text-primary my-5 grid grid-cols-2 gap-4 max-[761px]:gap-2.5 [&_article]:flex [&_article]:flex-col [&_article]:gap-3 [&_article]:rounded-[14px] [&_article]:bg-[#f1f4fb] [&_article]:p-5 max-[761px]:[&_article]:p-3.5 [&_span]:text-[length:12px] [&_span]:text-[#718099] [&_strong]:text-[length:clamp(21px,_3vw,_32px)] [&_strong]:font-[550] [&_strong]:[overflow-wrap:anywhere]",
                )}
              >
                <article>
                  <span>Total da fatura</span>
                  <strong>{money(invoice.data.total)}</strong>
                </article>
                <article>
                  <span>A pagar</span>
                  <strong>{money(invoice.data.pending)}</strong>
                </article>
              </div>
              {!!invoice.data.forecastTotal && (
                <p className="my-3 rounded-lg bg-[#f1f4fb] p-3 text-xs leading-relaxed text-[#485774]">
                  Cobranças planejadas: {money(invoice.data.forecastTotal)}.
                  Ainda não entram no total da fatura nem no limite
                  comprometido. Confirme cada compra em Movimentações quando ela
                  acontecer.
                </p>
              )}
              <p
                className={cn(
                  "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
                )}
              >
                Limite comprometido em todas as faturas:{" "}
                {money(invoice.data.committed)}.{" "}
                {card.limit > 0
                  ? invoice.data.committed > card.limit
                    ? `Limite excedido em ${money(invoice.data.committed - card.limit)}.`
                    : `Disponível: ${money(card.limit - invoice.data.committed)}.`
                  : ""}
              </p>
              <div
                className={cn(
                  "invoice-list [&_article]:flex [&_article]:items-center [&_article]:gap-4 [&_article]:border-b [&_article]:border-b-[#edf0f6] [&_article]:px-0 [&_article]:py-4.5 [&_article]:text-[length:13px] [&_article_>_div]:min-w-0 [&_article_>_div]:flex-1 [&_small]:mt-1.5 [&_small]:block [&_small]:text-[length:11px] [&_small]:leading-[1.7] [&_small]:text-[#718099] [&_strong]:[overflow-wrap:anywhere]",
                )}
              >
                {[...invoice.data.entries]
                  .sort(
                    (a, b) =>
                      (b.purchaseDate ?? "").localeCompare(
                        a.purchaseDate ?? "",
                      ) || b.id - a.id,
                  )
                  .map((e) => (
                    <article key={e.id}>
                      <div>
                        {e.purchaseDate && (
                          <time
                            dateTime={e.purchaseDate}
                            className="mb-1 block text-xs font-medium text-[#485774]"
                          >
                            {e.isForecast ? "Planejada para " : "Compra em "}
                            {date(e.purchaseDate)}
                          </time>
                        )}
                        <strong>
                          {e.description}
                          {e.installments
                            ? ` · ${e.installment}/${e.installments}`
                            : ""}
                        </strong>
                        <small>
                          {!e.purchaseDate && "Data da compra não informada · "}
                          {e.isForecast
                            ? "Cobrança planejada — ainda não realizada"
                            : e.status === "COMPLETED"
                              ? "Paga"
                              : "A pagar"}
                          {e.paidAt && <> · Paga em {date(e.paidAt)}</>}
                        </small>
                      </div>
                      <strong>{money(e.amount)}</strong>
                    </article>
                  ))}
              </div>
              {!invoice.data.entries.length && (
                <p
                  className={cn(
                    "planning-state flex items-center justify-center gap-3.5 px-2.5 py-7.5 text-center text-[length:13px] text-[#737f96]",
                  )}
                >
                  Nenhuma compra nesta fatura. Escolha Crédito e o cartão ao
                  registrar uma despesa.
                </p>
              )}
              {invoice.data.pending > 0 && (
                <button
                  className={cn(primaryButtonStyles)}
                  onClick={() => setConfirmPay(true)}
                >
                  Confirmar pagamento da fatura
                </button>
              )}
            </>
          )}
        </section>
      )}
      {editing && (
        <CardForm
          card={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void client.invalidateQueries({ queryKey: ["finance"] });
          }}
        />
      )}
      {confirmPay && card && (
        <FinanceModal
          title="Confirmar pagamento da fatura?"
          busy={busy}
          onClose={() => setConfirmPay(false)}
        >
          <form
            className={cn(formStyles)}
            onSubmit={(e) => {
              e.preventDefault();
              void act(() => planning.payInvoice(card.id, period, paymentDate));
            }}
          >
            <p>
              Confirme apenas se você já pagou os{" "}
              {money(invoice.data?.pending ?? 0)} pendentes. As compras serão
              marcadas como pagas, sem criar uma segunda despesa.
            </p>
            <label>
              Data do pagamento
              <input
                type="date"
                required
                min="1900-01-01"
                max={localDate()}
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </label>
            <p
              className={cn(
                "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
              )}
            >
              O pagamento quita somente compras confirmadas. As datas das
              compras, os gastos de cada mês e as movimentações planejadas
              futuras serão preservados.
            </p>
            <button className={cn(primaryButtonStyles)} disabled={busy}>
              {busy && (
                <DotsRing decorative size={18} className="text-current" />
              )}
              Confirmar pagamento
            </button>
          </form>
        </FinanceModal>
      )}
    </>
  );
}
function CardForm({
  card,
  onClose,
  onSaved,
}: {
  card?: Card;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(card?.name ?? "");
  const [closingDay, setClosing] = useState(card?.closingDay ?? 25);
  const [dueDay, setDue] = useState(card?.dueDay ?? 5);
  const [limit, setLimit] = useState(card?.limit ?? 0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const invalid = textError(name, "o nome do cartão", 60) || dayError(closingDay) || dayError(dueDay) || moneyError(limit, true);
      if (invalid) { setError(invalid); return; }
      await planning.saveCard({ name, closingDay, dueDay, limit }, card?.id);
      onSaved();
    } catch (e) {
      setError(userError(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <FinanceModal
      title={card ? "Editar cartão" : "Novo cartão"}
      onClose={onClose}
      busy={busy}
    >
      <form className={cn(formStyles)} onSubmit={submit}>
        <label>
          Nome do cartão
          <input
            autoFocus
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: cartão principal"
          />
        </label>
        <div
          className={cn(
            "form-columns grid grid-cols-[1fr_1fr] items-end gap-[13px] max-[421px]:grid-cols-[1fr] [&_input]:h-11 [&_select]:h-11",
          )}
        >
          <label>
            Dia do fechamento
            <input
              type="number"
              required
              min={1}
              max={31}
              value={closingDay}
              onChange={(e) => setClosing(Number(e.target.value))}
            />
          </label>
          <label>
            Dia do vencimento
            <input
              type="number"
              required
              min={1}
              max={31}
              value={dueDay}
              onChange={(e) => setDue(Number(e.target.value))}
            />
          </label>
        </div>
        <label>
          Limite (R$)
          <CurrencyInput value={limit} onValueChange={setLimit} />
        </label>
        <p
          className={cn(
            "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
          )}
        >
          Em meses mais curtos, usamos o último dia disponível. Limite zero
          significa que você não quer acompanhar o limite.
        </p>
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
        <button className={cn(primaryButtonStyles)} disabled={busy}>
          {busy && <DotsRing decorative size={18} className="text-current" />}
          Salvar cartão
        </button>
      </form>
    </FinanceModal>
  );
}

"use client";
import {
  pageHeaderStyles,
  primaryButtonStyles,
  emptyPageStyles,
  secondaryButtonStyles,
  panelStyles,
  panelHeadingStyles,
  emptyStateStyles,
  categoryPanelStyles,
  formStyles,
} from "@/components/ui/finance-styles";

import { cn } from "@/lib/utils";
import { isRealized, matchesStatus } from "../../utils/transactionState";
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import FirstSteps from "./FirstSteps";
import DueNotice from "./DueNotice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userError } from "../../utils/userError";
import { useUser } from "../../hooks/user/useUser";
import {
  exportTransactions,
  finance,
  localDate,
  type FinanceCategory,
  type Transaction,
} from "../../services/finance";
import TransactionForm from "./TransactionForm";
import RecurrenceForm from "./RecurrenceForm";
import { BudgetForm, CategoryForm } from "./PlanningForms";
import FinanceModal from "./FinanceModal";
import ArchivedCategories from "./ArchivedCategories";
import { DotsRing } from "@/components/ui/dots-ring";
import TransactionFilters from "./TransactionFilters";
import {
  defaultTransactionFilters,
  filterTransactions,
} from "../../utils/transactionFilters";
const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dateLabel = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
type Modal =
  | { type: "recurrence"; id: string }
  | {
      type: "transaction";
      entry?: Transaction;
      entryId?: number;
      initialStatus?: "PLANNED";
    }
  | {
      type: "stop-series";
      entry: Transaction;
    }
  | {
      type: "category";
      category?: FinanceCategory;
    }
  | {
      type: "budget";
      category: FinanceCategory;
    }
  | {
      type: "delete";
      entry: Transaction;
    }
  | {
      type: "archive";
      category: FinanceCategory;
    }
  | null;
export default function Finance() {
  const { user } = useUser();
  const path = usePathname();
  const initialParams = useSearchParams();
  const mode =
    path === "/transactions"
      ? "transactions"
      : path === "/categories"
        ? "categories"
        : "overview";
  const [period, setPeriod] = useState(() => {
    const value = initialParams.get("period") ?? "";
    return /^\d{4}-(0[1-9]|1[0-2])$/.test(value) &&
      value >= "1900-01" &&
      value <= "2100-12"
      ? value
      : localDate().slice(0, 7);
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [filters, setFilters] = useState(defaultTransactionFilters);
  const [categoryView, setCategoryView] = useState<"active" | "archived">(
    "active",
  );
  const [categoryKind, setCategoryKind] = useState<"INCOME" | "EXPENSE">(
    "EXPENSE",
  );
  function clearFilters() {
    setFilters(defaultTransactionFilters);
    setSearch("");
  }
  function selectPeriod(value: string) {
    setPeriod(value);
    setFilters((previous) => ({ ...previous, from: "", to: "" }));
  }
  const [modal, setModal] = useState<Modal>(() => {
    const entryId = Number(initialParams.get("entry"));
    return mode === "transactions" &&
      Number.isSafeInteger(entryId) &&
      entryId > 0
      ? { type: "transaction", entryId }
      : null;
  });
  const [busy, setBusy] = useState(false);
  const client = useQueryClient();
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["finance", user?.id, period],
    queryFn: () => finance.overview(period),
  });
  const periodLabel = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${period}-01T00:00:00Z`));
  const visibleCategories = (data?.categories ?? []).filter(
    (category) => (category.kind ?? "EXPENSE") === categoryKind,
  );
  const entries = useMemo(
    () =>
      mode === "transactions"
        ? filterTransactions(
            data?.transactions ?? [],
            search,
            filters,
          )
        : (data?.transactions ?? []).filter(
            (e) =>
              `${e.description} ${e.category?.name ?? ""}`
                .toLocaleLowerCase("pt-BR")
                .includes(search.toLocaleLowerCase("pt-BR")) &&
              (filter === "ALL" ||
                e.kind === filter ||
                matchesStatus(e, filter)),
          ),
    [data, search, filter, filters, mode],
  );
  const pending = (data?.transactions ?? [])
    .filter((e) => e.status === "PLANNED")
    .sort((a, b) => a.date.localeCompare(b.date));
  const spentCategories = useMemo(() => {
    const groups = new Map<
      number,
      {
        id: number;
        name: string;
        color: string;
        cents: number;
      }
    >();
    for (const entry of data?.transactions ?? []) {
      if (entry.kind !== "EXPENSE" || !isRealized(entry)) continue;
      const id = entry.category?.id ?? 0;
      const group = groups.get(id) ?? {
        id,
        name: entry.category?.name ?? "Sem categoria",
        color: entry.category?.color ?? "#9ba48d",
        cents: 0,
      };
      group.cents += Math.round(entry.amount * 100);
      groups.set(id, group);
    }
    return [...groups.values()]
      .map((group) => ({ ...group, spent: group.cents / 100 }))
      .sort((a, b) => b.spent - a.spent);
  }, [data]);
  function moveMonth(offset: number) {
    const [year, month] = period.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1 + offset, 1));
    if (date.getUTCFullYear() >= 1900 && date.getUTCFullYear() <= 2100)
      selectPeriod(date.toISOString().slice(0, 7));
  }
  function saved() {
    setModal(null);
    void client.invalidateQueries({ queryKey: ["finance"] });
    toast.success("Tudo salvo.");
  }
  async function act(action: () => Promise<unknown>) {
    if (busy) return;
    setBusy(true);
    try {
      await action();
      saved();
    } catch (error) {
      toast.error(userError(error));
    } finally {
      setBusy(false);
    }
  }
  const title = {
    overview: "Seu dinheiro, com clareza.",
    transactions: "Cada movimento conta.",
    categories: "Categorias e limites",
  }[mode];
  const subtitle = {
    overview: "Um olhar tranquilo para suas finanças.",
    transactions: "Receitas e despesas, todas no mesmo lugar.",
    categories:
      "Organize gastos e receitas. Defina limites apenas para despesas.",
  }[mode];
  function entryRow(entry: Transaction) {
    return (
      <div
        className={cn(
          "transaction-row flex items-center gap-3 border-b border-b-[#eaedf3] px-[23px] py-[15px] max-[761px]:grid max-[761px]:grid-cols-[32px_minmax(0,_1fr)_auto] max-[761px]:gap-2.5 max-[761px]:px-[17px] max-[761px]:py-3.5 [&:last-child]:border-b-0",
        )}
        key={entry.id}
      >
        <span
          className={cn(
            `transaction-icon grid h-8.5 w-8.5 shrink-0 place-items-center rounded-[10px] bg-[#f6f0e8] text-[length:16px] text-[#b08e66] [&.positive]:bg-[#e8ecf4] [&.positive]:text-[#059669] ${entry.kind === "INCOME" ? "positive text-[#059669]" : ""}`,
          )}
          style={
            entry.category
              ? {
                  backgroundColor: `${entry.category.color}18`,
                  color: entry.category.color,
                }
              : undefined
          }
        >
          <i
            aria-hidden="true"
            className={`bi bi-arrow-${entry.kind === "INCOME" ? "down-left" : "up-right"}`}
          />
        </span>
        <div
          className={cn(
            "transaction-info min-w-0 flex-1 [&_>_span]:mt-[5px] [&_>_span]:block [&_>_span]:text-[length:11px] [&_>_span]:text-[#666f81] max-[761px]:[&_>_span]:text-[length:10px] max-[421px]:[&_>_span]:leading-[1.8] [&_>_strong]:block [&_>_strong]:overflow-hidden [&_>_strong]:text-[length:13px] [&_>_strong]:font-[550] [&_>_strong]:text-ellipsis [&_>_strong]:whitespace-nowrap [&_>_strong]:text-[#3f4d69] max-[761px]:[&_>_strong]:text-[length:13px]",
          )}
        >
          <strong>
            {entry.description}
            {entry.installments
              ? ` · ${entry.installment}/${entry.installments}`
              : ""}
          </strong>
          <span>
            {entry.kind === "INCOME" ? "Receita" : "Despesa"} ·{" "}
            {entry.category?.name ?? "Sem categoria"}{" "}
            <span aria-hidden="true">·</span> {dateLabel(entry.date)}{" "}
            {entry.cardId && entry.status === "PLANNED" && entry.dueDate && (
              <> · Fatura vence em {dateLabel(entry.dueDate)} </>
            )}
            {entry.status === "PLANNED" && (
              <span
                className={cn(
                  "status-badge ml-1 rounded-sm bg-[#f6f1df] px-[5px] py-0.5 text-[length:10px] text-[#a28b51] max-[761px]:mt-[3px] max-[761px]:inline-block",
                )}
              >
                {entry.isForecast
                  ? "Cobrança planejada"
                  : entry.cardId
                    ? "Fatura a pagar"
                    : "Planejada"}
              </span>
            )}
          </span>
        </div>
        <strong
          className={cn(
            `transaction-amount text-[length:14px] font-[550] whitespace-nowrap max-[761px]:text-[length:13px] ${entry.kind === "INCOME" ? "positive text-[#059669]" : ""}`,
          )}
        >
          {currency(entry.amount)}
        </strong>
        <div
          className={cn(
            "row-actions flex gap-0.5 max-[761px]:col-[2/-1] max-[761px]:justify-end [&_.icon-button]:h-6.5 [&_.icon-button]:w-6.5 [&_.icon-button]:text-[length:13px]",
          )}
        >
          {entry.seriesId &&
            !entry.installments &&
            !entry.recurrence?.cancelledAt && (
              <button
                className={cn(
                  "icon-button [&:hover]:text-primary inline-grid h-7.5 w-7.5 shrink-0 place-items-center rounded-[7px] text-[#7a8396] [&:hover]:bg-[#e6eaf2]",
                )}
                aria-label={`${entry.recurrenceId ? "Cancelar recorrência" : "Cancelar próximas"}: ${entry.description}`}
                title={entry.recurrenceId ? "Cancelar recorrência" : "Cancelar próximas cobranças"}
                onClick={() => setModal({ type: "stop-series", entry })}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 9a8 8 0 1 0 0 6M20 4v5h-5" />
                  <path d="m9.5 9.5 5 5m0-5-5 5" />
                </svg>
              </button>
            )}
          {entry.recurrenceId && !entry.recurrence?.cancelledAt && (
            <button
              className="icon-button hover:text-primary inline-grid h-6.5 w-6.5 place-items-center rounded-md text-[#7a8396] hover:bg-[#e6eaf2]"
              aria-label={`Editar recorrência: ${entry.description}`}
              title="Editar próximas cobranças"
              onClick={() =>
                setModal({ type: "recurrence", id: entry.recurrenceId! })
              }
            >
              <i aria-hidden="true" className="bi bi-arrow-repeat" />
            </button>
          )}
          {entry.status === "PLANNED" &&
            (!entry.cardId || entry.isForecast) && (
              <button
                className={cn(
                  "icon-button [&:hover]:text-primary inline-grid h-7.5 w-7.5 shrink-0 place-items-center rounded-[7px] text-[#7a8396] [&:hover]:bg-[#e6eaf2]",
                )}
                title={
                  entry.cardId
                    ? "Confirmar compra"
                    : entry.kind === "INCOME"
                      ? "Confirmar recebimento"
                      : "Confirmar pagamento"
                }
                aria-label={`${entry.cardId ? "Confirmar compra" : entry.kind === "INCOME" ? "Confirmar recebimento" : "Confirmar pagamento"}: ${entry.description}`}
                disabled={busy}
                onClick={() =>
                  void act(() =>
                    finance.saveTransaction(
                      entry.cardId
                        ? { ...entry, isForecast: false }
                        : { ...entry, status: "COMPLETED" },
                      entry.id,
                    ),
                  )
                }
              >
                <i aria-hidden="true" className="bi bi-check2" />
              </button>
            )}
          {entry.cardId && !entry.isForecast && entry.status === "PLANNED" && (
            <Link
              className="icon-button hover:text-primary inline-grid h-6.5 w-6.5 place-items-center rounded-md text-[#7a8396] hover:bg-[#e6eaf2]"
              href={`/planning?tab=cards&card=${entry.cardId}&period=${entry.invoicePeriod ?? entry.dueDate?.slice(0, 7) ?? period}`}
              aria-label={`Ver fatura: ${entry.description}`}
              title="Pagar pela fatura"
            >
              <i aria-hidden="true" className="bi bi-credit-card" />
            </Link>
          )}
          <button
            className={cn(
              "icon-button [&:hover]:text-primary inline-grid h-7.5 w-7.5 shrink-0 place-items-center rounded-[7px] text-[#7a8396] [&:hover]:bg-[#e6eaf2]",
            )}
            aria-label={`Editar ${entry.description}`}
            title="Editar movimentação"
            onClick={() => setModal({ type: "transaction", entry })}
          >
            <i aria-hidden="true" className="bi bi-pencil" />
          </button>
          <button
            className={cn(
              "icon-button [&:hover]:text-primary danger-hover inline-grid h-7.5 w-7.5 shrink-0 place-items-center rounded-[7px] text-[#7a8396] [&:hover]:bg-[#e6eaf2] [&:hover]:bg-[#fbede7] [&:hover]:text-[#b25740]",
            )}
            aria-label={`Excluir ${entry.description}`}
            title="Excluir movimentação"
            onClick={() => setModal({ type: "delete", entry })}
          >
            <i aria-hidden="true" className="bi bi-trash3" />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "finance-page [&_h1]:text-[length:clamp(23px,_2.3vw,_32px)] [&_h1]:leading-[1.25] [&_h1]:font-semibold [&_h1]:tracking-[-1.2px] [&_h1]:text-[#2a3346] max-[761px]:[&_h1]:text-[length:27px] max-[421px]:[&_h1]:text-[length:25px]",
      )}
    >
      <header className={cn(pageHeaderStyles)}>
        <div>
          <p
            className={cn(
              "eyebrow mb-2.5 block text-[length:11px] font-[650] tracking-[1.6px] text-[#727c91]",
            )}
          >
            {mode === "overview"
              ? `OLÁ, ${user?.name.split(" ")[0] ?? ""}`
              : "SEU ESPAÇO FINANCEIRO"}
          </p>
          <h1>{title}</h1>
          <p
            className={cn(
              "page-subtitle mt-2.5 text-[length:13px] leading-[1.7] text-[#666f82] max-[761px]:text-[length:12px]",
            )}
          >
            {subtitle}
          </p>
        </div>
        <button
          className={cn(primaryButtonStyles)}
          onClick={() =>
            setModal(
              mode === "categories"
                ? { type: "category" }
                : { type: "transaction" },
            )
          }
        >
          <i aria-hidden="true" className="bi bi-plus-lg" />{" "}
          {mode === "categories" ? "Nova categoria" : "Nova movimentação"}
        </button>
      </header>
      {mode === "overview" && (
        <FirstSteps onAdd={() => setModal({ type: "transaction" })} />
      )}
      {mode === "overview" && <DueNotice />}
      <div
        className={cn(
          "period-toolbar mb-[25px] flex items-center justify-between max-[761px]:mb-4.5",
        )}
      >
        <div
          className={cn(
            "period-picker flex items-center gap-[5px] rounded-lg border border-[#dfe2e9] bg-white p-1 [&_input]:absolute [&_input]:[inset:0] [&_input]:h-full [&_input]:w-full [&_input]:cursor-pointer [&_input]:opacity-0 [&_input::-webkit-calendar-picker-indicator]:absolute [&_input::-webkit-calendar-picker-indicator]:[inset:0] [&_input::-webkit-calendar-picker-indicator]:h-full [&_input::-webkit-calendar-picker-indicator]:w-full [&_input::-webkit-calendar-picker-indicator]:cursor-pointer [&_label]:relative [&_label]:flex [&_label]:min-w-41.5 [&_label]:items-center [&_label]:justify-center [&_label]:gap-[9px] [&_label]:px-[9px] [&_label]:py-0 [&_label]:text-[length:13px] [&_label]:font-[550] [&_label]:capitalize [&_label_>_.bi]:text-[#788295] [&_label:focus-within]:rounded-sm [&_label:focus-within]:[outline:2px_solid_#9ca6bb]",
          )}
        >
          <button
            className={cn(
              "icon-button [&:hover]:text-primary inline-grid h-7.5 w-7.5 shrink-0 place-items-center rounded-[7px] text-[#7a8396] [&:hover]:bg-[#e6eaf2]",
            )}
            aria-label="Mês anterior"
            onClick={() => moveMonth(-1)}
          >
            <i aria-hidden="true" className="bi bi-chevron-left" />
          </button>
          <label>
            <i aria-hidden="true" className="bi bi-calendar3" />
            <span>{periodLabel}</span>
            <input
              aria-label="Escolher mês"
              type="month"
              min="1900-01"
              max="2100-12"
              value={period}
              onChange={(event) => {
                if (
                  /^\d{4}-(0[1-9]|1[0-2])$/.test(event.target.value) &&
                  event.target.value >= "1900-01" &&
                  event.target.value <= "2100-12"
                )
                  selectPeriod(event.target.value);
              }}
            />
          </label>
          <button
            className={cn(
              "icon-button [&:hover]:text-primary inline-grid h-7.5 w-7.5 shrink-0 place-items-center rounded-[7px] text-[#7a8396] [&:hover]:bg-[#e6eaf2]",
            )}
            aria-label="Próximo mês"
            onClick={() => moveMonth(1)}
          >
            <i aria-hidden="true" className="bi bi-chevron-right" />
          </button>
        </div>
        <span
          className={cn(
            "toolbar-note flex items-center gap-[7px] text-[length:11px] text-[#838c9e] max-[761px]:hidden",
          )}
        >
          <span
            className={cn("live-dot h-[5px] w-[5px] rounded-full bg-[#8495b7]")}
          />{" "}
          {period === localDate().slice(0, 7)
            ? "Acompanhando seu mês"
            : "Seu histórico e planejamento"}
        </span>
      </div>
      {isPending ? (
        <div className={cn(emptyPageStyles)} role="status">
          <DotsRing decorative />
          <h2>Organizando sua visão…</h2>
        </div>
      ) : isError || !data ? (
        <div className={cn(emptyPageStyles)} role="alert">
          <i aria-hidden="true" className="bi bi-wifi-off" />
          <h2>Não conseguimos carregar suas finanças.</h2>
          <p>Verifique sua conexão e tente novamente.</p>
          <button
            className={cn(secondaryButtonStyles)}
            onClick={() => void refetch()}
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <>
          {mode === "overview" && (
            <>
              <section
                className={cn(
                  "summary-grid mb-[23px] grid grid-cols-[1.3fr_1fr_1fr] gap-4.5 max-[1001px]:grid-cols-[1.2fr_1fr_1fr] max-[1001px]:gap-2.5 max-[761px]:grid-cols-[1fr_1fr] max-[761px]:gap-3 min-[1600px]:gap-6",
                )}
                aria-label="Resumo do mês"
              >
                <article
                  className={cn(
                    'result-card relative overflow-hidden rounded-[13px] bg-[#194bd1] pt-[23px] pr-[25px] pb-0 pl-[25px] text-white max-[1201px]:px-4.5 max-[761px]:col-span-full max-[761px]:pt-4.5 max-[761px]:pr-5 max-[761px]:pb-0 max-[761px]:pl-5 [&_>_p]:mt-[7px] [&_>_p]:text-[length:11px] [&_>_p]:text-[#b7becb] [&_>_strong]:mt-[15px] [&_>_strong]:block [&_>_strong]:text-[length:clamp(25px,_2.6vw,_36px)] [&_>_strong]:leading-[1.3] [&_>_strong]:font-[550] [&_>_strong]:tracking-[-1.2px] max-[1001px]:[&_>_strong]:text-[length:25px] max-[761px]:[&_>_strong]:mt-2.5 max-[761px]:[&_>_strong]:text-[length:32px] [&::before]:pointer-events-none [&::before]:absolute [&::before]:top-[-65px] [&::before]:right-[-65px] [&::before]:h-[175px] [&::before]:w-[175px] [&::before]:rounded-full [&::before]:border [&::before]:border-[#ffffff08] [&::before]:shadow-[0_0_0_22px_#ffffff03,_0_0_0_44px_#ffffff03] [&::before]:[content:""]',
                  )}
                >
                  <div
                    className={cn(
                      "card-topline flex items-center justify-between text-[length:13px] text-[#d2d7e2] [&_>_.bi]:text-[length:21px] [&_>_.bi]:opacity-70",
                    )}
                  >
                    <span>Gastos do mês</span>
                    <i
                      aria-hidden="true"
                      className="bi bi-arrow-up-right-circle"
                    />
                  </div>
                  <strong>{currency(data.summary.expenses)}</strong>
                  <p>Despesas realizadas e parcelas deste mês</p>
                  <div
                    className={cn(
                      "result-forecast mt-5.5 flex items-center justify-between gap-2.5 border-t border-t-[#ffffff1c] px-0 py-[17px] text-[length:11px] text-[#d2d7e2] max-[1201px]:text-[length:10px] max-[761px]:mt-[13px] max-[761px]:px-0 max-[761px]:py-[11px] max-[761px]:text-[length:11px] [&_b]:text-[length:14px] [&_b]:font-[550] [&_b]:text-white max-[1201px]:[&_b]:text-[length:12px] max-[761px]:[&_b]:text-[length:14px]",
                    )}
                  >
                    <span>
                      Ainda a pagar{" "}
                      <i
                        aria-hidden="true"
                        className="bi bi-info-circle"
                        title="Pagamentos pendentes e movimentações planejadas dos lançamentos deste mês. Compras confirmadas no cartão já estão incluídas nos gastos; quitá-las não gera outro gasto."
                      />
                    </span>
                    <b>{currency(data.summary.plannedExpenses)}</b>
                  </div>
                </article>
                <article
                  className={cn(
                    "metric-card flex flex-col rounded-[13px] border border-[#dfe2e9] bg-white p-[23px] max-[1201px]:px-[17px] max-[1201px]:py-5 max-[761px]:p-4.5 [&_>_p]:mt-[13px] [&_>_p]:text-[length:11px] [&_>_p]:text-[#687184] max-[761px]:[&_>_p]:text-[length:10px] [&_>_p_span]:font-semibold [&_>_p_span]:text-[#8d795c] [&_>_p_span.positive]:text-[#059669] [&_>_span:not(.metric-icon)]:text-[length:12px] [&_>_span:not(.metric-icon)]:text-[#747e92] [&_>_strong]:mt-[9px] [&_>_strong]:block [&_>_strong]:text-[length:clamp(22px,_2.2vw,_30px)] [&_>_strong]:font-[550] [&_>_strong]:tracking-[-1px] [&_>_strong]:[overflow-wrap:anywhere] max-[1001px]:[&_>_strong]:text-[length:21px] max-[761px]:[&_>_strong]:text-[length:clamp(21px,_5vw,_27px)]",
                  )}
                >
                  <span
                    className={cn(
                      "metric-icon positive mb-[15px] grid h-[33px] w-[33px] place-items-center rounded-[10px] bg-[#e8ecf4] text-[length:18px] text-[#059669] [&.outgoing]:bg-[#faf0e8] [&.outgoing]:text-[#bc805f]",
                    )}
                  >
                    <i aria-hidden="true" className="bi bi-arrow-down-left" />
                  </span>
                  <span>Receitas recebidas</span>
                  <strong>{currency(data.summary.income)}</strong>
                  <p>
                    <span className={cn("positive text-[#059669]")}>
                      {currency(data.summary.plannedIncome)}
                    </span>{" "}
                    a receber
                  </p>
                </article>
                <article
                  className={cn(
                    "metric-card flex flex-col rounded-[13px] border border-[#dfe2e9] bg-white p-[23px] max-[1201px]:px-[17px] max-[1201px]:py-5 max-[761px]:p-4.5 [&_>_p]:mt-[13px] [&_>_p]:text-[length:11px] [&_>_p]:text-[#687184] max-[761px]:[&_>_p]:text-[length:10px] [&_>_p_span]:font-semibold [&_>_p_span]:text-[#8d795c] [&_>_p_span.positive]:text-[#059669] [&_>_span:not(.metric-icon)]:text-[length:12px] [&_>_span:not(.metric-icon)]:text-[#747e92] [&_>_strong]:mt-[9px] [&_>_strong]:block [&_>_strong]:text-[length:clamp(22px,_2.2vw,_30px)] [&_>_strong]:font-[550] [&_>_strong]:tracking-[-1px] [&_>_strong]:[overflow-wrap:anywhere] max-[1001px]:[&_>_strong]:text-[length:21px] max-[761px]:[&_>_strong]:text-[length:clamp(21px,_5vw,_27px)]",
                  )}
                >
                  <span
                    className={cn(
                      "metric-icon mb-[15px] grid h-[33px] w-[33px] place-items-center rounded-[10px] bg-[#e8ecf4] text-[length:18px] [&.outgoing]:bg-[#faf0e8] [&.outgoing]:text-[#bc805f]",
                    )}
                  >
                    <i aria-hidden="true" className="bi bi-wallet2" />
                  </span>
                  <span>Resultado do período</span>
                  <strong
                    className={cn(
                      data.summary.income > 0 && data.summary.result < 0
                        ? "negative-balance text-[#b65c45]"
                        : undefined,
                    )}
                  >
                    {data.summary.income > 0
                      ? currency(data.summary.result)
                      : "—"}
                  </strong>
                  <p>
                    {data.summary.income > 0
                      ? "Recebido menos gasto no mês"
                      : "Opcional: registre receitas para calcular"}
                  </p>
                  {(data.summary.income > 0 ||
                    data.summary.plannedIncome > 0) && (
                    <p>
                      Resultado planejado:{" "}
                      {currency(data.summary.projectedResult)}
                    </p>
                  )}
                </article>
              </section>
              <div
                className={cn(
                  "overview-grid mb-[23px] grid grid-cols-[1.25fr_1fr] gap-5.5 max-[1001px]:grid-cols-[1fr] max-[761px]:mb-4.5 max-[761px]:gap-4.5 [&_.row-actions]:ml-auto max-[761px]:[&_.row-actions]:ml-0 [&_.transaction-amount]:text-[length:12px] [&_.transaction-row]:flex-wrap [&_.transaction-row]:gap-2",
                )}
              >
                <section className={cn(panelStyles)}>
                  <div className={cn(panelHeadingStyles)}>
                    <div>
                      <h2>A pagar e a receber</h2>
                      <p>Contas e recebimentos pendentes neste mês</p>
                    </div>
                    <span
                      className={cn(
                        "count-badge grid h-[23px] min-w-[23px] place-items-center rounded-[7px] bg-[#ebeef5] text-[length:12px] text-[#798499]",
                      )}
                    >
                      {pending.length}
                    </span>
                  </div>
                  {pending.length ? (
                    pending.slice(0, 4).map(entryRow)
                  ) : (
                    <div className={cn(emptyStateStyles)}>
                      <span
                        className={cn(
                          "empty-icon inline-grid h-[45px] w-[45px] shrink-0 place-items-center rounded-[13px] bg-[#edf0f6] text-[length:21px] text-[#78859f]",
                        )}
                      >
                        <i
                          aria-hidden="true"
                          className="bi bi-calendar2-check"
                        />
                      </span>
                      <h3>Nenhuma pendência neste mês</h3>
                      <p>
                        Movimentações marcadas como “A pagar” ou “A receber”
                        aparecem aqui até serem concluídas.
                      </p>
                      <button
                        className={cn(
                          "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
                        )}
                        onClick={() =>
                          setModal({
                            type: "transaction",
                            initialStatus: "PLANNED",
                          })
                        }
                      >
                        Adicionar movimentação{" "}
                        <i aria-hidden="true" className="bi bi-arrow-right" />
                      </button>
                    </div>
                  )}
                </section>
                <section className={cn(panelStyles)}>
                  <div className={cn(panelHeadingStyles)}>
                    <div>
                      <h2>Onde seu dinheiro foi</h2>
                      <p>Despesas realizadas por categoria</p>
                    </div>
                    <i aria-hidden="true" className="bi bi-pie-chart" />
                  </div>
                  {spentCategories.length ? (
                    <div
                      className={cn(
                        "spending-list grid gap-[21px] pt-4 pr-[23px] pb-[29px] pl-[23px]",
                      )}
                    >
                      {spentCategories.slice(0, 5).map((category) => (
                        <div key={category.id}>
                          <div
                            className={cn(
                              "spending-label mb-[9px] flex items-center justify-between gap-3 text-[length:12px] text-[#6a7386] [&_>_span]:flex [&_>_span]:items-center [&_>_span]:gap-[7px] [&_i]:h-[7px] [&_i]:w-[7px] [&_i]:rounded-xs [&_strong]:font-[550] [&_strong]:text-[#3f4d68]",
                            )}
                          >
                            <span>
                              <i
                                aria-hidden="true"
                                style={{ backgroundColor: category.color }}
                              />
                              {category.name}
                            </span>
                            <strong>{currency(category.spent)}</strong>
                          </div>
                          <div
                            className={cn(
                              "progress-track h-[5px] overflow-hidden rounded-lg bg-[#ebeef3] [&_>_span]:block [&_>_span]:h-full [&_>_span]:rounded-[inherit]",
                            )}
                          >
                            <span
                              style={{
                                width: `${Math.min(100, (category.spent / (data.summary.expenses || 1)) * 100)}%`,
                                backgroundColor: category.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={cn(emptyStateStyles)}>
                      <span
                        className={cn(
                          "empty-icon inline-grid h-[45px] w-[45px] shrink-0 place-items-center rounded-[13px] bg-[#edf0f6] text-[length:21px] text-[#78859f]",
                        )}
                      >
                        <i aria-hidden="true" className="bi bi-pie-chart" />
                      </span>
                      <h3>Seu panorama começa aqui</h3>
                      <p>
                        Ao registrar despesas com categoria, você descobre para
                        onde vai seu dinheiro.
                      </p>
                      <Link
                        className={cn(
                          "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
                        )}
                        href="/categories"
                      >
                        Organizar categorias{" "}
                        <i aria-hidden="true" className="bi bi-arrow-right" />
                      </Link>
                    </div>
                  )}
                </section>
              </div>
            </>
          )}
          {(mode === "overview" || mode === "transactions") && (
            <section
              className={cn(
                "finance-panel transactions-panel overflow-hidden rounded-xl border border-[#dfe2e9] bg-white [&_h2]:text-[length:14px] [&_h2]:font-[650] [&_h2]:text-[#2f394e] max-[761px]:[&_h2]:text-[length:14px]",
              )}
            >
              <div className={cn(panelHeadingStyles)}>
                <div>
                  <h2>
                    {mode === "overview"
                      ? "Últimas movimentações"
                      : "Movimentações do mês"}
                  </h2>
                  <p>
                    {data.transactions.length} registro
                    {data.transactions.length === 1 ? "" : "s"} em {periodLabel}
                  </p>
                </div>
                <button
                  className={cn(
                    "secondary-button export-button inline-flex items-center justify-center gap-2.5 rounded-lg border border-[#dde1e8] bg-white px-[11px] px-[19px] py-2 py-[13px] text-[length:11px] text-[length:13px] leading-[1.4] font-semibold whitespace-nowrap text-[#43526f] max-[421px]:gap-[5px] max-[421px]:p-2 max-[421px]:text-[length:10px] [&:hover]:bg-[#eff1f6]",
                  )}
                  disabled={!entries.length}
                  onClick={() => exportTransactions(entries, period)}
                >
                  <i aria-hidden="true" className="bi bi-download" /> Exportar
                  CSV
                </button>
              </div>
              {mode === "transactions" ? (
                <TransactionFilters
                  filters={filters}
                  onChange={setFilters}
                  onClear={clearFilters}
                  search={search}
                  setSearch={setSearch}
                  categories={data.categories}
                  entries={data.transactions}
                  period={period}
                  count={entries.length}
                />
              ) : (
                <div
                  className={cn(
                    "transaction-filters mt-0 mr-[23px] mb-3 ml-[23px] flex gap-3 pt-[5px] max-[761px]:mx-[17px] max-[761px]:flex-wrap max-[761px]:gap-[9px] [&_select]:max-w-47.5 [&_select]:rounded-[7px] [&_select]:border [&_select]:border-[#dee2ea] [&_select]:bg-white [&_select]:px-2.5 [&_select]:py-[7px] [&_select]:text-[length:12px] [&_select]:text-[#6a7487] max-[761px]:[&_select]:w-full max-[761px]:[&_select]:max-w-none",
                  )}
                >
                  <label
                    className={cn(
                      "search-input flex flex-1 items-center gap-[9px] rounded-[7px] border border-[#dee2ea] bg-[#f9fafd] px-3 py-2.5 text-[#666f81] max-[761px]:min-w-45 [&_input]:w-full [&_input]:min-w-0 [&_input]:border-0 [&_input]:bg-transparent [&_input]:text-[length:12px] [&_input]:text-[#37435c] [&_input]:outline-none [&_input::placeholder]:text-[#6c7689] [&:focus-within]:[outline:2px_solid_#9ca6bb]",
                    )}
                  >
                    <i aria-hidden="true" className="bi bi-search" />
                    <input
                      type="search"
                      placeholder="Buscar descrição ou categoria"
                      aria-label="Buscar movimentações"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </label>
                  <select
                    aria-label="Filtrar movimentações"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                  >
                    <option value="ALL">Todas as movimentações</option>
                    <option value="INCOME">Receitas</option>
                    <option value="EXPENSE">Despesas</option>
                    <option value="FORECAST">Planejadas</option>
                    <option value="REALIZED">Realizadas</option>
                    <option value="PLANNED">A pagar ou a receber</option>
                  </select>
                </div>
              )}
              {entries.length ? (
                <div>
                  {entries
                    .slice(0, mode === "overview" ? 6 : entries.length)
                    .map(entryRow)}
                </div>
              ) : (
                <div className={cn(emptyStateStyles)}>
                  <span
                    className={cn(
                      "empty-icon inline-grid h-[45px] w-[45px] shrink-0 place-items-center rounded-[13px] bg-[#edf0f6] text-[length:21px] text-[#78859f]",
                    )}
                  >
                    <i aria-hidden="true" className="bi bi-journal-text" />
                  </span>
                  <h3>
                    {data.transactions.length
                      ? "Nenhum resultado para estes filtros"
                      : "Vamos começar com uma movimentação?"}
                  </h3>
                  <p>
                    {data.transactions.length
                      ? "Experimente outra descrição ou ajuste os filtros."
                      : "Pode ser o café de hoje ou uma receita. Você não precisa configurar mais nada."}
                  </p>
                  {!data.transactions.length && (
                    <button
                      className={cn(secondaryButtonStyles)}
                      onClick={() => setModal({ type: "transaction" })}
                    >
                      <i aria-hidden="true" className="bi bi-plus-lg" />{" "}
                      Adicionar movimentação
                    </button>
                  )}
                </div>
              )}
              {mode === "overview" && entries.length > 6 && (
                <Link
                  className={cn(
                    "panel-footer-link flex items-center justify-center gap-2 border-t border-t-[#e5e9f0] p-4 text-[length:12px] text-[#5b6883]",
                  )}
                  href="/transactions"
                >
                  Ver todas as movimentações{" "}
                  <i aria-hidden="true" className="bi bi-arrow-right" />
                </Link>
              )}
            </section>
          )}
          {mode === "categories" && (
            <>
              <div
                className={cn(
                  "planning-intro mb-6 flex items-center gap-4 rounded-xl border border-[#dce1ea] bg-[#e5e9f2] p-[21px] max-[761px]:flex-wrap max-[761px]:gap-3 max-[761px]:p-4.5 [&_.empty-icon]:bg-[#d8deea] max-[761px]:[&_.empty-icon]:h-[35px] max-[761px]:[&_.empty-icon]:w-[35px] max-[761px]:[&_.secondary-button]:w-full [&_>_div]:flex-1 [&_h2]:text-[length:14px] [&_h2]:font-[650] [&_h2]:text-[#2f394e] [&_p]:mt-[5px] [&_p]:text-[length:12px] [&_p]:leading-[1.8] [&_p]:text-[#7c8598]",
                )}
              >
                <span
                  className={cn(
                    "empty-icon inline-grid h-[45px] w-[45px] shrink-0 place-items-center rounded-[13px] bg-[#edf0f6] text-[length:21px] text-[#78859f]",
                  )}
                >
                  <i aria-hidden="true" className="bi bi-collection" />
                </span>
                <div>
                  <h2>Suas categorias, com limites opcionais</h2>
                  <p>
                    Separe gastos e fontes de receita. Limites são opcionais e
                    ficam apenas nas despesas. Não é preciso cadastrar receitas.
                  </p>
                </div>
              </div>
              <div
                role="group"
                aria-label="Tipo de categoria"
                className="mb-4 flex gap-2"
              >
                {(
                  [
                    ["EXPENSE", "Despesas"],
                    ["INCOME", "Receitas"],
                  ] as const
                ).map(([kind, label]) => (
                  <button
                    key={kind}
                    aria-pressed={categoryKind === kind}
                    onClick={() => setCategoryKind(kind)}
                    className={cn(
                      "rounded-lg border px-4 py-2.5 text-sm",
                      categoryKind === kind
                        ? "border-[#91aaf5] bg-[#eaf0ff] text-[#1447e6]"
                        : "border-[#dfe2e9] bg-white text-[#718099]",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div
                className={cn(
                  "category-view-switch [&_button.active]:text-primary mb-5 inline-flex gap-1 rounded-[9px] border border-[#dfe6f5] bg-[#eaf0fc] p-1 [&_button]:inline-flex [&_button]:items-center [&_button]:gap-2 [&_button]:rounded-md [&_button]:px-[15px] [&_button]:py-2.5 [&_button]:text-[length:12px] [&_button]:font-[550] [&_button]:text-[#6c7890] [&_button.active]:bg-white [&_button.active]:shadow-[0_1px_4px_#142e6a0d]",
                )}
                role="group"
                aria-label="Exibir categorias"
              >
                <button
                  className={categoryView === "active" ? "active" : ""}
                  aria-pressed={categoryView === "active"}
                  onClick={() => setCategoryView("active")}
                >
                  Ativas ({visibleCategories.length})
                </button>
                <button
                  className={categoryView === "archived" ? "active" : ""}
                  aria-pressed={categoryView === "archived"}
                  onClick={() => setCategoryView("archived")}
                >
                  <i aria-hidden="true" className="bi bi-archive" /> Arquivadas
                </button>
              </div>
              {categoryView === "archived" ? (
                <ArchivedCategories kind={categoryKind} />
              ) : visibleCategories.length ? (
                <section
                  className={cn(
                    "category-grid grid grid-cols-3 gap-4.5 max-[1201px]:grid-cols-2 max-[761px]:gap-[13px] max-[421px]:grid-cols-[1fr]",
                  )}
                >
                  {visibleCategories.map((category) => (
                    <article
                      className={cn(
                        "finance-panel category-panel overflow-hidden rounded-xl border border-[#dfe2e9] bg-white p-[21px] max-[761px]:p-[17px] [&_h2]:text-[length:14px] [&_h2]:font-[650] [&_h2]:text-[#2f394e] max-[761px]:[&_h2]:text-[length:14px]",
                      )}
                      key={category.id}
                    >
                      <div
                        className={cn(
                          "category-heading flex items-center gap-[9px] max-[761px]:flex-wrap max-[761px]:gap-[7px] max-[761px]:[&_.icon-button]:h-6 max-[761px]:[&_.icon-button]:w-6 max-[761px]:[&_.icon-button]:text-[length:13px] [&_h2]:flex-1 [&_h2]:overflow-hidden [&_h2]:text-ellipsis [&_h2]:whitespace-nowrap max-[761px]:[&_h2]:min-w-17.5",
                        )}
                      >
                        <span
                          className={cn(
                            "category-symbol grid h-8 w-8 shrink-0 place-items-center rounded-[9px]",
                          )}
                          style={{
                            backgroundColor: `${category.color}18`,
                            color: category.color,
                          }}
                        >
                          <i aria-hidden="true" className="bi bi-tag" />
                        </span>
                        <h2>{category.name}</h2>
                        {mode === "categories" && (
                          <>
                            <button
                              className={cn(
                                "icon-button [&:hover]:text-primary inline-grid h-7.5 w-7.5 shrink-0 place-items-center rounded-[7px] text-[#7a8396] [&:hover]:bg-[#e6eaf2]",
                              )}
                              aria-label={`Editar ${category.name}`}
                              onClick={() =>
                                setModal({ type: "category", category })
                              }
                            >
                              <i aria-hidden="true" className="bi bi-pencil" />
                            </button>
                            <button
                              className={cn(
                                "icon-button [&:hover]:text-primary danger-hover inline-grid h-7.5 w-7.5 shrink-0 place-items-center rounded-[7px] text-[#7a8396] [&:hover]:bg-[#e6eaf2] [&:hover]:bg-[#fbede7] [&:hover]:text-[#b25740]",
                              )}
                              aria-label={`Arquivar ${category.name}`}
                              onClick={() =>
                                setModal({ type: "archive", category })
                              }
                            >
                              <i aria-hidden="true" className="bi bi-archive" />
                            </button>
                          </>
                        )}
                      </div>
                      <div
                        className={cn(
                          "category-total mx-0 my-5 flex flex-col gap-[5px] [&_span]:text-[length:11px] [&_span]:text-[#666f81] [&_strong]:text-[length:25px] [&_strong]:font-[550] [&_strong]:tracking-[-0.7px] max-[761px]:[&_strong]:text-[length:23px]",
                        )}
                      >
                        <strong>{currency(category.spent)}</strong>
                        <span>
                          {categoryKind === "INCOME"
                            ? "em receitas neste mês"
                            : "em gastos neste mês"}
                        </span>
                      </div>
                      {categoryKind === "INCOME" ? (
                        <p className="my-3 text-xs leading-relaxed text-[#666f81]">
                          Fonte de receita · sem limite de gastos
                        </p>
                      ) : category.budget ? (
                        <>
                          <div
                            className={cn(
                              `budget-meta mb-2 flex justify-between text-[length:11px] text-[#7b8598] ${category.spent > category.budget.amount ? "over-budget text-[#b65c45]" : ""}`,
                            )}
                          >
                            <span>
                              Limite: {currency(category.budget.amount)}
                            </span>
                            <span>
                              {category.budget.amount > 0
                                ? Math.round(
                                    (category.spent / category.budget.amount) *
                                      100,
                                  )
                                : category.spent
                                  ? "∞"
                                  : 0}
                              %
                            </span>
                          </div>
                          <div
                            className={cn(
                              "progress-track h-[5px] overflow-hidden rounded-lg bg-[#ebeef3] [&_>_span]:block [&_>_span]:h-full [&_>_span]:rounded-[inherit]",
                            )}
                          >
                            <span
                              style={{
                                width: `${category.budget.amount > 0 ? Math.min(100, (category.spent / category.budget.amount) * 100) : category.spent ? 100 : 0}%`,
                                backgroundColor:
                                  category.spent > category.budget.amount
                                    ? "#b65c45"
                                    : category.color,
                              }}
                            />
                          </div>
                          <p
                            className={cn(
                              "budget-caption mx-0 my-3 text-[length:11px] leading-[1.7] text-[#666f81]",
                            )}
                          >
                            {category.spent > category.budget.amount
                              ? `Excedido em ${currency(category.spent - category.budget.amount)}`
                              : `Restam ${currency(category.budget.amount - category.spent)}`}{" "}
                            ·{" "}
                            {category.budget.period === "*"
                              ? "Limite padrão mensal"
                              : "Limite específico deste mês"}
                            {category.spent > category.budget.amount &&
                              " · Acima do planejado"}
                          </p>
                        </>
                      ) : (
                        <p
                          className={cn(
                            "budget-caption mx-0 my-3 text-[length:11px] leading-[1.7] text-[#666f81]",
                          )}
                        >
                          Sem limite definido. Tudo bem também.
                        </p>
                      )}
                      {categoryKind === "EXPENSE" && (
                        <div
                          className={cn(
                            "category-footer mt-4 flex items-center justify-between border-t border-t-[#e5e9f0] pt-3 max-[761px]:[&_.text-button]:text-[length:11px]",
                          )}
                        >
                          <button
                            className={cn(
                              "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
                            )}
                            onClick={() =>
                              setModal({ type: "budget", category })
                            }
                          >
                            {category.budget
                              ? "Ajustar limite"
                              : "Definir limite"}{" "}
                            <i
                              aria-hidden="true"
                              className="bi bi-arrow-right"
                            />
                          </button>
                          {category.budget && (
                            <button
                              className={cn(
                                "icon-button [&:hover]:text-primary inline-grid h-7.5 w-7.5 shrink-0 place-items-center rounded-[7px] text-[#7a8396] [&:hover]:bg-[#e6eaf2]",
                              )}
                              disabled={busy}
                              aria-label={`Remover limite de ${category.name}`}
                              onClick={() =>
                                void act(() =>
                                  finance.deleteBudget(
                                    category.id,
                                    category.budget!.period,
                                  ),
                                )
                              }
                            >
                              <i aria-hidden="true" className="bi bi-x-lg" />
                            </button>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </section>
              ) : (
                <div className={cn(categoryPanelStyles)}>
                  <span
                    className={cn(
                      "empty-icon inline-grid h-[45px] w-[45px] shrink-0 place-items-center rounded-[13px] bg-[#edf0f6] text-[length:21px] text-[#78859f]",
                    )}
                  >
                    <i aria-hidden="true" className="bi bi-tags" />
                  </span>
                  <h3>Suas primeiras categorias</h3>
                  <p>
                    {categoryKind === "INCOME"
                      ? "Salário, trabalhos extras, aluguel recebido… Organize de onde vem o dinheiro."
                      : "Alimentação, transporte, casa… Escolha nomes que façam sentido para você."}
                  </p>
                  <button
                    className={cn(primaryButtonStyles)}
                    onClick={() => setModal({ type: "category" })}
                  >
                    Criar categoria{" "}
                    <i aria-hidden="true" className="bi bi-plus-lg" />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
      {modal?.type === "transaction" &&
        (!modal.entryId ||
          data?.transactions.some((e) => e.id === modal.entryId)) && (
          <TransactionForm
            entry={
              modal.entry ??
              data?.transactions.find((e) => e.id === modal.entryId)
            }
            initialStatus={modal.initialStatus}
            categories={data?.categories ?? []}
            period={period}
            onClose={() => setModal(null)}
            onSaved={(savedPeriod, status, isForecast) => {
              setPeriod(savedPeriod);
              clearFilters();
              setFilter("ALL");
              setModal(null);
              void client.invalidateQueries({ queryKey: ["finance"] });
              const month = new Intl.DateTimeFormat("pt-BR", {
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              }).format(new Date(`${savedPeriod}-01T00:00:00Z`));
              toast.success(
                isForecast
                  ? `Movimentação planejada salva em ${month}.`
                  : status === "PLANNED"
                    ? `Movimentação salva como pendente em ${month}.`
                    : `Movimentação salva em ${month}.`,
              );
            }}
          />
        )}
      {modal?.type === "stop-series" && (
        <FinanceModal
          title={
            modal.entry.recurrenceId
              ? "Cancelar recorrência?"
              : "Cancelar próximos lançamentos?"
          }
          onClose={() => setModal(null)}
          busy={busy}
        >
          <p>
            {modal.entry.recurrenceId
              ? "A recorrência será encerrada e não terá novas movimentações planejadas. Movimentações planejadas a partir de hoje serão removidas; compras confirmadas, pagamentos e pendências anteriores a hoje serão preservados. Isso não cancela a contratação com o fornecedor."
              : "Serão canceladas as próximas movimentações planejadas desta repetição, a partir do lançamento selecionado. Compras confirmadas e pagamentos realizados serão preservados."}
          </p>
          <button
            className={cn(primaryButtonStyles)}
            disabled={busy}
            onClick={() => void act(() => finance.cancelFuture(modal.entry.id))}
          >
            {busy && <DotsRing decorative size={18} className="text-current" />}
            {modal.entry.recurrenceId
              ? "Confirmar cancelamento"
              : "Cancelar próximos lançamentos"}
          </button>
        </FinanceModal>
      )}
      {modal?.type === "recurrence" && (
        <RecurrenceForm
          id={modal.id}
          onClose={() => setModal(null)}
          onSaved={saved}
        />
      )}
      {modal?.type === "category" && (
        <CategoryForm
          category={modal.category}
          initialKind={categoryKind}
          onClose={() => setModal(null)}
          onSaved={(kind) => {
            setCategoryKind(kind);
            saved();
          }}
        />
      )}
      {modal?.type === "budget" && (
        <BudgetForm
          category={modal.category}
          period={period}
          onClose={() => setModal(null)}
          onSaved={saved}
        />
      )}
      {(modal?.type === "delete" || modal?.type === "archive") && (
        <FinanceModal
          title={
            modal.type === "delete"
              ? "Excluir movimentação?"
              : "Arquivar categoria?"
          }
          busy={busy}
          onClose={() => setModal(null)}
        >
          <div className={cn(formStyles)}>
            <p>
              {modal.type === "delete"
                ? `“${modal.entry.description}” será removida dos resultados e das listas.`
                : `“${modal.category.name}” deixará de aparecer nas opções. As movimentações e os limites serão mantidos. Você poderá restaurá-la na aba Arquivadas.`}
            </p>
            <button
              className={cn(
                "primary-button bg-primary border-primary destructive-button inline-flex items-center justify-center gap-2.5 rounded-lg border border-[#a75440] bg-[#a75440] px-[19px] py-[13px] text-[length:13px] leading-[1.4] font-semibold whitespace-nowrap text-white shadow-[0_3px_6px_#2d374b10] [&:hover]:bg-[#1038b8] [&:hover]:bg-[#914531]",
              )}
              disabled={busy}
              aria-busy={busy}
              onClick={() =>
                void act(() =>
                  modal.type === "delete"
                    ? finance.deleteTransaction(modal.entry.id)
                    : finance.archiveCategory(modal.category.id),
                )
              }
            >
              {busy && (
                <DotsRing decorative size={18} className="text-current" />
              )}
              {busy
                ? "Aguarde…"
                : modal.type === "delete"
                  ? "Excluir movimentação"
                  : "Arquivar categoria"}
            </button>
            <button
              className={cn(secondaryButtonStyles)}
              disabled={busy}
              onClick={() => setModal(null)}
            >
              Cancelar
            </button>
          </div>
        </FinanceModal>
      )}
    </div>
  );
}

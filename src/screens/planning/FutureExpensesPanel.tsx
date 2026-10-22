"use client";
import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../hooks/user/useUser";
import { finance, localDate } from "../../services/finance";
import { planning, type PlannedExpense } from "../../services/planning";
import { userError } from "../../utils/userError";
import {
  panelStyles,
  primaryButtonStyles,
  secondaryButtonStyles,
  formStyles,
} from "../../components/ui/finance-styles";
import { DotsRing } from "../../components/ui/dots-ring";
import CurrencyInput from "../../components/CurrencyInput";
import TransactionForm from "../finance/TransactionForm";
import FinanceModal from "../finance/FinanceModal";
import { textError, moneyError, dateError } from "../../utils/validation";

function ReminderForm({
  entry,
  period,
  onClose,
  onSaved,
}: {
  entry?: PlannedExpense;
  period: string;
  onClose: () => void;
  onSaved: (period: string) => void;
}) {
  const [description, setDescription] = useState(entry?.description ?? "");
  const [date, setDate] = useState(
    entry?.date ??
      (period === localDate().slice(0, 7) ? localDate() : `${period}-01`),
  );
  const [amount, setAmount] = useState(entry?.amount ?? 0);
  const [notes, setNotes] = useState(entry?.notes ?? "");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function save(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    const invalid = textError(description, "a descrição", 160) || dateError(date) || (amount ? moneyError(amount) : undefined) ||
      (notes.trim().length > 2000 ? "Use até 2.000 caracteres nas observações." : undefined);
    if (invalid) { setError(invalid); return; }
    setBusy(true);
    setError("");
    try {
      await planning.savePlannedExpense(
        { description, date, amount: amount || null, notes },
        entry?.id,
      );
      onSaved(date.slice(0, 7));
    } catch (err) {
      setError(userError(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <FinanceModal
      title={entry ? "Editar gasto planejado" : "Planejar gasto"}
      busy={busy}
      onClose={onClose}
    >
      <form className={formStyles} onSubmit={save}>
        <p className="text-sm leading-relaxed text-[#718099]">
          Este é um lembrete. Nenhuma movimentação será criada ao salvar.
        </p>
        <label>
          O que pretende gastar?
          <input
            required
            maxLength={160}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Data do lembrete
          <input
            required
            type="date"
            min="1900-01-01"
            max="2100-12-31"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label>
          Valor estimado (opcional)
          <CurrencyInput
            value={amount}
            onValueChange={setAmount}
            aria-label="Valor estimado (opcional)"
          />
        </label>
        <label>
          Observações (opcional)
          <textarea
            maxLength={2000}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-[#a54c36]">
            {error}
          </p>
        )}
        <button className={primaryButtonStyles} disabled={busy}>
          {busy && <DotsRing decorative size={18} />}Salvar lembrete
        </button>
      </form>
    </FinanceModal>
  );
}

export default function FutureExpensesPanel() {
  const { user } = useUser(),
    client = useQueryClient(),
    today = localDate();
  const [period, setPeriod] = useState(today.slice(0, 7));
  const [editing, setEditing] = useState<PlannedExpense | "new" | null>(null);
  const [registering, setRegistering] = useState<PlannedExpense | null>(null);
  const [removing, setRemoving] = useState<PlannedExpense | null>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const query = useQuery({
    queryKey: ["finance", user?.id, "planned-expenses", period],
    queryFn: () => planning.plannedExpenses(period),
  });
  const overview = useQuery({
    queryKey: ["finance", user?.id, period],
    queryFn: () => finance.overview(period),
    enabled: !!registering,
  });
  function refresh(nextPeriod = period) {
    setEditing(null);
    setRegistering(null);
    setRemoving(null);
    setPeriod(nextPeriod);
    void client.invalidateQueries({ queryKey: ["finance"] });
  }
  async function remove() {
    if (!removing || busy) return;
    setBusy(true);
    setError("");
    try {
      await planning.deletePlannedExpense(removing.id);
      refresh();
    } catch (err) {
      setError(userError(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className={panelStyles}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2>Gastos planejados</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#718099]">
            Lembretes do que você pretende gastar. Eles não entram nos totais
            nem nas faturas. Quando o gasto acontecer, use “Registrar gasto”
            para criar a movimentação. A data do lembrete não registra nada
            automaticamente.
          </p>
        </div>
        <button
          className={primaryButtonStyles}
          onClick={() => setEditing("new")}
        >
          Planejar gasto
        </button>
      </div>
      <label className="my-5 flex max-w-56 flex-col gap-2 text-sm">
        Mês do planejamento
        <input
          className="rounded-lg border border-[#d4dced] bg-white p-3"
          aria-label="Mês do planejamento"
          type="month"
          min="1900-01"
          max="2100-12"
          value={period}
          onChange={(e) => {
            if (/^\d{4}-(0[1-9]|1[0-2])$/.test(e.target.value))
              setPeriod(e.target.value);
          }}
        />
      </label>
      {query.isPending && <DotsRing label="Carregando gastos planejados" />}
      {query.isError && (
        <div role="alert">
          <p>Não foi possível carregar os lembretes.</p>
          <button
            className={secondaryButtonStyles}
            onClick={() => void query.refetch()}
          >
            Tentar novamente
          </button>
        </div>
      )}
      {query.isSuccess && !query.data.length && (
        <p className="py-8 text-center text-sm text-[#718099]">
          Nenhum gasto planejado para este mês.
        </p>
      )}
      <div className="divide-y divide-[#edf0f6]">
        {query.data?.map((entry) => (
          <article
            key={entry.id}
            className="flex flex-wrap items-center gap-3 py-5"
          >
            <div className="min-w-0 flex-1 basis-48">
              <h3 className="m-0! text-sm font-semibold wrap-anywhere">
                {entry.description}
              </h3>
              <p className="mt-2 text-xs text-[#718099]">
                {entry.date.split("-").reverse().join("/")}
                {entry.date < today ? " · Data já passou" : ""}
              </p>
              {entry.notes && (
                <p className="mt-2 text-sm wrap-anywhere whitespace-pre-wrap">
                  {entry.notes}
                </p>
              )}
            </div>
            <strong className="text-[#1447e6]">
              {entry.amount === null
                ? "Valor a definir"
                : entry.amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
            </strong>
            <div className="flex flex-wrap gap-2">
              <button
                className={secondaryButtonStyles}
                onClick={() => setEditing(entry)}
                aria-label={`Editar gasto planejado: ${entry.description}`}
              >
                Editar
              </button>
              <button
                className={secondaryButtonStyles}
                onClick={() => setRegistering(entry)}
                aria-label={`Registrar gasto: ${entry.description}`}
              >
                Registrar gasto
              </button>
              <button
                className={secondaryButtonStyles}
                onClick={() => {
                  setError("");
                  setRemoving(entry);
                }}
                aria-label={`Excluir gasto planejado: ${entry.description}`}
              >
                Excluir
              </button>
            </div>
          </article>
        ))}
      </div>
      {editing && (
        <ReminderForm
          entry={editing === "new" ? undefined : editing}
          period={period}
          onClose={() => setEditing(null)}
          onSaved={refresh}
        />
      )}
      {registering && (
        <TransactionForm
          plannedExpenseId={registering.id}
          initialValues={{
            kind: "EXPENSE",
            status: "COMPLETED",
            amount: registering.amount ?? 0,
            description: registering.description,
            date: today,
            categoryId: null,
            paymentMethod: "PIX",
          }}
          period={today.slice(0, 7)}
          categories={overview.data?.categories ?? []}
          onClose={() => setRegistering(null)}
          onSaved={() => refresh()}
        />
      )}
      {removing && (
        <FinanceModal
          title="Excluir lembrete?"
          busy={busy}
          onClose={() => setRemoving(null)}
        >
          <p className="text-sm leading-relaxed">
            Somente este lembrete será removido. Suas movimentações continuam
            iguais.
          </p>
          {error && <p role="alert">{error}</p>}
          <button
            className={primaryButtonStyles}
            disabled={busy}
            onClick={() => void remove()}
          >
            Confirmar exclusão
          </button>
        </FinanceModal>
      )}
    </section>
  );
}

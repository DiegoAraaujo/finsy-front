"use client";
import {
  formStyles,
  primaryButtonStyles,
} from "@/components/ui/finance-styles";

import { cn } from "@/lib/utils";
import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { planning } from "../../services/planning";
import { useUser } from "../../hooks/user/useUser";
import {
  finance,
  localDate,
  type FinanceCategory,
  type Transaction,
  type TransactionInput,
} from "../../services/finance";
import FinanceModal from "./FinanceModal";
import { userError } from "../../utils/userError";
import CurrencyInput from "../../components/CurrencyInput";
import { DotsRing } from "@/components/ui/dots-ring";
import { textError, moneyError, dateError } from "../../utils/validation";
export default function TransactionForm({
  entry,
  categories,
  period,
  onClose,
  onSaved,
  initialStatus,
  initialValues,
  plannedExpenseId,
}: {
  entry?: Transaction;
  categories: FinanceCategory[];
  period: string;
  onClose: () => void;
  onSaved: (
    period: string,
    status: TransactionInput["status"],
    isForecast?: boolean,
  ) => void;
  initialStatus?: "PLANNED";
  initialValues?: TransactionInput;
  plannedExpenseId?: number;
}) {
  const { user } = useUser();
  const cardsQuery = useQuery({
    queryKey: ["finance", user?.id, "cards"],
    queryFn: planning.cards,
  });
  const cards = Array.isArray(cardsQuery.data) ? cardsQuery.data : [];
  const today = localDate();
  const [form, setForm] = useState<TransactionInput>(
    entry ??
      initialValues ?? {
        kind: "EXPENSE",
        status: initialStatus ?? "COMPLETED",
        amount: 0,
        description: "",
        date: period >= today.slice(0, 7) ? today : `${period}-01`,
        categoryId: null,
        paymentMethod: "PIX",
        isForecast: false,
      },
  );
  const [amount, setAmount] = useState(
    entry?.amount ?? initialValues?.amount ?? 0,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [repeatDay, setRepeatDay] = useState(Number(form.date.slice(8, 10)));
  const [installments, setInstallments] = useState(1);
  const isCredit =
    form.kind === "EXPENSE" && form.paymentMethod === "CREDIT_CARD";
  // Editing an existing forecast must not confirm it as a side effect. New
  // purchases are realized unless their purchase date is still in the future.
  const isForecast =
    isCredit && (entry ? !!form.isForecast : form.date > today);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    const knownInstallment = !!entry?.cardId && !!entry.installments && form.date === entry.date && (entry.purchaseDate ?? entry.date) <= today;
    const invalid = moneyError(amount) || textError(form.description, "a descrição", 160) || dateError(form.date, "1900-01-01", knownInstallment ? "2100-12-31" : today) ||
      (recurring && hasEndDate ? dateError(endDate, form.date) : undefined) ||
      (isCredit && !form.cardId ? "Selecione o cartão da compra." : undefined);
    if (invalid) { setError(invalid); return; }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Informe um valor maior que zero.");
      return;
    }
    if (installments > 1 && Math.round(amount * 100) < installments) {
      setError("O valor total deve permitir pelo menos R$ 0,01 por parcela.");
      return;
    }
    if (!form.description.trim()) {
      setError("Preencha a descrição da movimentação.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { data: saved } = await finance.saveTransaction(
        {
          ...form,
          plannedExpenseId,
          status:
            form.paymentMethod === "CREDIT_CARD" ? "PLANNED" : form.status,
          ...(entry?.cardId ? { status: entry.status } : {}),
          isForecast,
          amount,
          ...(!entry
            ? {
                recurring,
                recurrenceEndDate: recurring && hasEndDate ? endDate : null,
                installments,
                ...(recurring ? { repeatDay } : {}),
              }
            : {}),
        },
        entry?.id,
      );
      onSaved(
        saved.period ?? saved.date?.slice(0, 7) ?? form.date.slice(0, 7),
        form.cardId && !entry ? "PLANNED" : form.status,
        isForecast,
      );
    } catch (err) {
      setError(
        userError(
          err,
          "Não foi possível salvar a movimentação. Tente novamente em instantes.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <FinanceModal
      title={entry ? "Editar movimentação" : "Nova movimentação"}
      onClose={onClose}
      busy={busy}
    >
      <form onSubmit={submit} className={cn(formStyles)}>
        <fieldset
          className={cn(
            "segmented flex gap-[5px] rounded-[9px] bg-[#eceff5] p-1 [&_button]:flex-1 [&_button]:rounded-md [&_button]:p-2.5 [&_button]:text-[length:13px] [&_button]:text-[#7d8699] [&_button.selected]:bg-white [&_button.selected]:text-[#3c4964] [&_button.selected]:shadow-[0_1px_3px_#29324510]",
          )}
          disabled={busy || !!plannedExpenseId}
        >
          <legend className="sr-only">Tipo</legend>
          {(
            [
              ["EXPENSE", "Despesa", "arrow-up-right"],
              ["INCOME", "Receita", "arrow-down-left"],
            ] as const
          ).map(([kind, label, icon]) => (
            <button
              type="button"
              key={kind}
              className={form.kind === kind ? "selected" : ""}
              aria-pressed={form.kind === kind}
              disabled={!!entry?.cardId}
              onClick={() => {
                setForm({
                  ...form,
                  kind,
                  categoryId: kind === form.kind ? form.categoryId : null,
                  cardId: kind === "INCOME" ? null : form.cardId,
                  paymentMethod:
                    kind === "INCOME" && form.paymentMethod === "CREDIT_CARD"
                      ? "PIX"
                      : form.paymentMethod,
                  isForecast: kind === "INCOME" ? false : form.isForecast,
                });
                if (kind === "INCOME") setInstallments(1);
              }}
            >
              <i aria-hidden="true" className={`bi bi-${icon}`} /> {label}
            </button>
          ))}
        </fieldset>
        <label
          className={cn(
            "amount-field [&_>_span]:flex [&_>_span]:items-center [&_>_span]:gap-[9px] [&_>_span]:text-[length:23px] [&_>_span]:text-[#8e98ac] [&_input]:w-full [&_input]:border-0 [&_input]:bg-none [&_input]:text-[length:31px] [&_input]:font-[550] [&_input]:text-[#303a4f] [&_input]:[outline-offset:3px] [&_input:focus-visible]:outline-none",
          )}
        >
          {installments > 1 ? "Valor total da compra" : "Valor"}{" "}
          <span>
            R${" "}
            <CurrencyInput
              autoFocus
              required
              placeholder="0,00"
              value={amount}
              onValueChange={setAmount}
            />
          </span>
        </label>
        <label>
          Descrição
          <input
            required
            maxLength={160}
            placeholder={
              form.kind === "INCOME"
                ? "Ex.: salário, trabalho extra"
                : "Ex.: compras do mercado"
            }
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
          />
        </label>
        <div
          className={cn(
            "form-columns grid grid-cols-[1fr_1fr] items-end gap-[13px] max-[421px]:grid-cols-[1fr] [&_input]:h-11 [&_select]:h-11",
          )}
        >
          <label className={isCredit ? "col-span-full" : undefined}>
            {form.cardId ? "Data da compra / parcela" : "Data"}
            <input
              type="date"
              disabled={
                !!entry?.cardId && (!entry.isForecast || !!entry.installments)
              }
              required
              min="1900-01-01"
              max={today}
              onInvalid={(event) => {
                event.preventDefault();
                setError(
                  "Informe uma data até hoje. Gastos futuros ficam em Planejamento → Gastos planejados.",
                );
              }}
              value={form.date}
              onChange={(event) => {
                setForm({
                  ...form,
                  date: event.target.value,
                  ...(event.target.value > today
                    ? {
                        status: "PLANNED",
                        isForecast: form.paymentMethod === "CREDIT_CARD",
                      }
                    : {}),
                });
                if (event.target.value)
                  setRepeatDay(Number(event.target.value.slice(8, 10)));
              }}
            />
          </label>
          {!isCredit && (
            <label>
              Situação
              <select
                value={form.status}
                disabled={!!form.cardId && !entry}
                onChange={(event) => {
                  setForm({
                    ...form,
                    status: event.target.value as TransactionInput["status"],
                  });
                }}
              >
                <option value="COMPLETED">
                  {form.kind === "INCOME" ? "Recebida" : "Paga"}
                </option>
                <option value="PLANNED">
                  {form.kind === "INCOME" ? "A receber" : "A pagar"}
                </option>
              </select>
            </label>
          )}
        </div>
        <div
          className={cn(
            "form-columns grid grid-cols-[1fr_1fr] items-end gap-[13px] max-[421px]:grid-cols-[1fr] [&_input]:h-11 [&_select]:h-11",
          )}
        >
          <label>
            <span>
              Categoria <small>opcional</small>
            </span>
            <select
              value={form.categoryId ?? ""}
              onChange={(event) =>
                setForm({
                  ...form,
                  categoryId: event.target.value
                    ? Number(event.target.value)
                    : null,
                })
              }
            >
              <option value="">Sem categoria</option>
              {entry?.category &&
                form.kind === entry.kind &&
                !categories.some((c) => c.id === entry.categoryId) && (
                  <option value={entry.category.id}>
                    {entry.category.name} (arquivada)
                  </option>
                )}
              {categories
                .filter((c) => (c.kind ?? "EXPENSE") === form.kind)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Forma de pagamento
            <select
              value={form.paymentMethod}
              disabled={!!entry?.cardId}
              onChange={(event) => {
                setForm({
                  ...form,
                  paymentMethod: event.target
                    .value as TransactionInput["paymentMethod"],
                  cardId:
                    event.target.value === "CREDIT_CARD" ? form.cardId : null,
                  isForecast:
                    event.target.value === "CREDIT_CARD"
                      ? form.date > today
                      : false,
                });
                if (event.target.value !== "CREDIT_CARD") setInstallments(1);
              }}
            >
              <option value="PIX">Pix</option>
              <option value="CASH">Dinheiro</option>
              <option value="DEBIT_CARD">Débito</option>
              {form.kind === "EXPENSE" && (
                <option value="CREDIT_CARD" disabled={!!entry && !entry.cardId}>Crédito</option>
              )}
              <option value="OTHER">Outro</option>
            </select>
          </label>
        </div>
        {!entry && (
          <>
            {form.kind === "EXPENSE" && form.paymentMethod === "CREDIT_CARD" ? (
              <label>
                Como lançar no crédito
                <select
                  aria-label="Como lançar no crédito"
                  value={
                    recurring
                      ? "recurring"
                      : installments > 1
                        ? "installments"
                        : "single"
                  }
                  onChange={(event) => {
                    const mode = event.target.value;
                    setInstallments(mode === "installments" ? 2 : 1);
                    setRecurring(mode === "recurring");
                    if (mode === "recurring")
                      setRepeatDay(Number(form.date.slice(8, 10)));
                  }}
                >
                  <option value="single">Compra única</option>
                  <option value="installments">Compra parcelada</option>
                  <option value="recurring">
                    Cobrança recorrente no cartão
                  </option>
                </select>
                {recurring && (
                  <span className="form-note text-xs leading-relaxed text-[#666f81]">
                    O valor inteiro será cobrado a cada mês, como uma
                    assinatura. Ele não será dividido em parcelas.
                  </span>
                )}
              </label>
            ) : (
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={recurring}
                  disabled={installments > 1}
                  onChange={(event) => {
                    setRecurring(event.target.checked);
                    if (event.target.checked)
                      setRepeatDay(Number(form.date.slice(8, 10)));
                  }}
                />{" "}
                Repetir mensalmente
              </label>
            )}
            {recurring && (
              <>
                <label>
                  Dia do mês
                  <select
                    aria-label="Dia do mês"
                    value={repeatDay}
                    onChange={(event) => {
                      const day = Number(event.target.value);
                      setRepeatDay(day);
                      const [year, month] = form.date.split("-").map(Number);
                      const lastDay = new Date(
                        Date.UTC(year, month, 0),
                      ).getUTCDate();
                      const date = `${form.date.slice(0, 7)}-${String(Math.min(day, lastDay)).padStart(2, "0")}`;
                      setForm({
                        ...form,
                        date,
                        ...(date > today
                          ? {
                              status: "PLANNED",
                              isForecast: form.paymentMethod === "CREDIT_CARD",
                            }
                          : {}),
                      });
                    }}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option
                        key={day}
                        value={day}
                        disabled={(() => {
                          const [y, m] = form.date.split("-").map(Number);
                          const date = `${form.date.slice(0, 7)}-${String(Math.min(day, new Date(Date.UTC(y, m, 0)).getUTCDate())).padStart(2, "0")}`;
                          return date > today;
                        })()}
                      >
                        Dia {day}
                      </option>
                    ))}
                  </select>
                  <span className="form-note text-xs leading-relaxed text-[#666f81]">
                    Nos meses que não tiverem esse dia, será usado o último dia
                    do mês.
                  </span>
                </label>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={hasEndDate}
                    onChange={(event) => setHasEndDate(event.target.checked)}
                  />
                  Definir término (opcional)
                </label>
                {hasEndDate && (
                  <label>
                    Repetir até
                    <input
                      type="date"
                      required
                      min={form.date}
                      max="2100-12-31"
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                    />
                  </label>
                )}
                <span
                  className={cn(
                    "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
                  )}
                >
                  Repete mensalmente até você cancelar, sem quantidade de meses
                  obrigatória. As próximas cobranças são movimentações
                  planejadas do valor inteiro. No cartão, confirme cada cobrança
                  quando acontecer e quite o pagamento pela fatura.
                </span>
              </>
            )}
          </>
        )}
        {form.kind === "EXPENSE" && form.paymentMethod === "CREDIT_CARD" && (
          <label>
            Cartão
            <select
              value={form.cardId ?? ""}
              aria-label="Cartão"
              required
              disabled={!!entry}
              onChange={(e) =>
                setForm({
                  ...form,
                  cardId: e.target.value ? Number(e.target.value) : null,
                  status: e.target.value ? "PLANNED" : form.status,
                })
              }
            >
              <option value="">Selecione um cartão</option>
              {cards
                .filter((c) => !c.archivedAt || c.id === form.cardId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
            <span
              className={cn(
                "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
              )}
            >
              {entry
                ? "O gasto permanece no mês da compra ou parcela. O pagamento da fatura quita a pendência sem lançar outra despesa."
                : "O gasto entra no mês da compra. O vencimento fica separado na fatura; pagar a fatura não gera outro gasto."}
            </span>
            {cardsQuery.isError && (
              <button
                className={cn(
                  "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
                )}
                type="button"
                onClick={() => void cardsQuery.refetch()}
              >
                Tentar carregar cartões novamente
              </button>
            )}
          </label>
        )}
        {!entry &&
          form.kind === "EXPENSE" &&
          form.paymentMethod === "CREDIT_CARD" &&
          installments > 1 &&
          !recurring && (
            <label>
              Parcelamento
              <select
                value={installments}
                aria-label="Parcelamento"
                disabled={recurring}
                onChange={(e) => setInstallments(Number(e.target.value))}
              >
                {Array.from({ length: 47 }, (_, i) => i + 2).map((n) => (
                  <option key={n} value={n}>
                    {n} parcelas
                  </option>
                ))}
              </select>
              {installments > 1 && (
                <span
                  className={cn(
                    "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
                  )}
                >
                  Informe o valor total da compra. Ele será dividido em{" "}
                  {installments} parcelas, preservando os centavos. As próximas
                  parcelas ficam a pagar.
                </span>
              )}
            </label>
          )}
        {entry?.seriesId && (
          <p
            className={cn(
              "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
            )}
          >
            {entry.installments
              ? `Parcela ${entry.installment} de ${entry.installments}.`
              : "Esta movimentação faz parte de uma repetição mensal."}{" "}
            As alterações afetam apenas este lançamento.
          </p>
        )}
        <p
          className={cn(
            "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
          )}
        >
          {form.cardId && isForecast
            ? entry?.installments
              ? "Ao confirmar que a compra aconteceu, todas as suas parcelas passam a compor as faturas e o limite comprometido. Nenhuma parcela será marcada como paga."
              : "Esta é uma movimentação planejada. Ela não entra nos gastos realizados, no total a pagar da fatura ou no limite comprometido até você confirmar a compra."
            : form.cardId
              ? "A compra já conta nos gastos do mês, mesmo enquanto a fatura estiver a pagar. Em compras parceladas, cada parcela conta no seu respectivo mês."
              : form.status === "PLANNED"
                ? "Esta despesa ou receita está pendente. Ela aparece em Vencimentos e entra no resultado quando for paga ou recebida."
                : "Esta movimentação entra no resultado do mês da data escolhida."}
        </p>
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
          className={cn(primaryButtonStyles)}
          disabled={busy}
          aria-busy={busy}
        >
          {busy && <DotsRing decorative size={18} className="text-current" />}
          {busy ? "Salvando…" : "Salvar movimentação"}{" "}
          <i aria-hidden="true" className="bi bi-arrow-right" />
        </button>
      </form>
    </FinanceModal>
  );
}

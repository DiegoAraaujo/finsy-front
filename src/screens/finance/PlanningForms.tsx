"use client";
import {
  formStyles,
  primaryButtonStyles,
} from "@/components/ui/finance-styles";

import { cn } from "@/lib/utils";
import { useState, type FormEvent } from "react";
import { userError } from "../../utils/userError";
import { finance, type FinanceCategory } from "../../services/finance";
import FinanceModal from "./FinanceModal";
import CurrencyInput from "../../components/CurrencyInput";
import { DotsRing } from "@/components/ui/dots-ring";
import { textError, moneyError } from "../../utils/validation";
const message = (error: unknown) =>
  userError(error, "Não foi possível salvar. Tente novamente em instantes.");
export function CategoryForm({
  category,
  initialKind = "EXPENSE",
  onClose,
  onSaved,
}: {
  category?: FinanceCategory;
  initialKind?: "INCOME" | "EXPENSE";
  onClose: () => void;
  onSaved: (kind: "INCOME" | "EXPENSE") => void;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [kind, setKind] = useState<"INCOME" | "EXPENSE">(
    category?.kind ?? initialKind,
  );
  const [color, setColor] = useState(category?.color ?? "#2563eb");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    const invalid = textError(name, "o nome da categoria", 50);
    if (invalid) { setError(invalid); return; }
    setBusy(true);
    try {
      await finance.saveCategory({ name, color, kind }, category?.id);
      onSaved(kind);
    } catch (err) {
      setError(message(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <FinanceModal
      title={category ? "Editar categoria" : "Nova categoria"}
      busy={busy}
      onClose={onClose}
    >
      <form onSubmit={submit} className={cn(formStyles)}>
        <label>
          Tipo de categoria
          <select
            aria-label="Tipo de categoria"
            value={kind}
            disabled={!!category}
            onChange={(event) =>
              setKind(event.target.value as "INCOME" | "EXPENSE")
            }
          >
            <option value="EXPENSE">Despesa</option>
            <option value="INCOME">Receita</option>
          </select>
        </label>
        {category && (
          <p className="text-xs text-[#666f81]">
            O tipo é fixo para preservar o histórico.
          </p>
        )}
        <label>
          Nome
          <input
            autoFocus
            required
            maxLength={50}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={
              kind === "INCOME" ? "Ex.: trabalhos extras" : "Ex.: alimentação"
            }
          />
        </label>
        <label>
          Cor
          <input
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </label>
        <p
          className={cn(
            "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
          )}
        >
          {kind === "INCOME"
            ? "Organize a origem dos recebimentos. Categorias de receita não possuem limites de gastos."
            : "Categorias continuam disponíveis nos próximos meses. Você decide depois se quer definir um limite."}
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
        <button
          className={cn(primaryButtonStyles)}
          disabled={busy}
          aria-busy={busy}
        >
          {busy && <DotsRing decorative size={18} className="text-current" />}
          {busy ? "Salvando…" : "Salvar categoria"}
        </button>
      </form>
    </FinanceModal>
  );
}
export function BudgetForm({
  category,
  period,
  onClose,
  onSaved,
}: {
  category: FinanceCategory;
  period: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [amount, setAmount] = useState(category.budget?.amount ?? 0);
  const [repeat, setRepeat] = useState(category.budget?.period === "*");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    const invalid = moneyError(amount, true);
    if (invalid) { setError(invalid); return; }
    setBusy(true);
    try {
      await finance.saveBudget(category.id, repeat ? "*" : period, amount);
      onSaved();
    } catch (err) {
      setError(message(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <FinanceModal
      title={`Limite · ${category.name}`}
      busy={busy}
      onClose={onClose}
    >
      <form onSubmit={submit} className={cn(formStyles)}>
        <label>
          Limite mensal (R$)
          <CurrencyInput
            autoFocus
            required
            value={amount}
            onValueChange={setAmount}
            placeholder="600,00"
          />
        </label>
        <label className="check-label">
          <input
            type="checkbox"
            checked={repeat}
            onChange={(event) => setRepeat(event.target.checked)}
          />{" "}
          Repetir como limite padrão de todos os meses
        </label>
        <p
          className={cn(
            "form-note text-[length:12px] leading-[1.8] text-[#666f81]",
          )}
        >
          Um limite específico para {period.split("-").reverse().join("/")} tem
          prioridade sobre o padrão. Limites são opcionais e não dependem da sua
          renda.
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
        <button
          className={cn(primaryButtonStyles)}
          disabled={busy}
          aria-busy={busy}
        >
          {busy && <DotsRing decorative size={18} className="text-current" />}
          {busy ? "Salvando…" : "Salvar limite"}
        </button>
      </form>
    </FinanceModal>
  );
}

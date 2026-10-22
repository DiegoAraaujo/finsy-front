"use client";
import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../hooks/user/useUser";
import { recurrences, type Recurrence } from "../../services/recurrences";
import { userError } from "../../utils/userError";
import CurrencyInput from "../../components/CurrencyInput";
import { DotsRing } from "../../components/ui/dots-ring";
import {
  formStyles,
  primaryButtonStyles,
} from "../../components/ui/finance-styles";
import FinanceModal from "./FinanceModal";
import { textError, moneyError, dateError, dayError } from "../../utils/validation";

export default function RecurrenceForm({
  id,
  onClose,
  onSaved,
}: {
  id: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { user } = useUser();
  const [busy, setBusy] = useState(false);
  const query = useQuery({
    queryKey: ["finance", user?.id, "recurrence", id],
    queryFn: () => recurrences.get(id),
    // Reopening the editor must initialize its fields from the saved rule.
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
  return (
    <FinanceModal title="Editar recorrência" busy={busy} onClose={onClose}>
      {query.isPending ? (
        <DotsRing label="Carregando recorrência" />
      ) : query.isError ? (
        <div role="alert">
          <p>Não foi possível carregar a recorrência.</p>
          <button onClick={() => void query.refetch()}>Tentar novamente</button>
        </div>
      ) : (
        <Fields
          key={query.data.id}
          rule={query.data}
          onBusy={setBusy}
          onSaved={onSaved}
        />
      )}
    </FinanceModal>
  );
}
function Fields({
  rule,
  onBusy,
  onSaved,
}: {
  rule: Recurrence;
  onBusy: (busy: boolean) => void;
  onSaved: () => void;
}) {
  const [amount, setAmount] = useState(rule.amount);
  const [description, setDescription] = useState(rule.description);
  const [day, setDay] = useState(rule.day);
  const [hasEnd, setHasEnd] = useState(!!rule.endDate);
  const [endDate, setEndDate] = useState(rule.endDate ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    const invalid = textError(description, "a descrição", 160) || moneyError(amount) || dayError(day) || (hasEnd ? dateError(endDate, rule.startDate) : undefined);
    if (invalid) { setError(invalid); return; }
    setBusy(true);
    onBusy(true);
    setError("");
    try {
      await recurrences.update(rule.id, {
        amount,
        description,
        day,
        endDate: hasEnd ? endDate : null,
      });
      onSaved();
    } catch (error) {
      setError(userError(error, "Não foi possível atualizar a recorrência."));
    } finally {
      setBusy(false);
      onBusy(false);
    }
  }
  return (
    <form className={formStyles} onSubmit={submit}>
      <p className="text-sm leading-relaxed text-[#666f81]">
        As alterações valem para as próximas movimentações planejadas, a partir
        de hoje. Compras confirmadas, pagamentos e cobranças anteriores serão
        preservados.
      </p>
      <label>
        Descrição
        <input
          required
          maxLength={160}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label>
        Valor mensal
        <CurrencyInput value={amount} onValueChange={setAmount} required />
      </label>
      <label>
        Dia do mês
        <select value={day} onChange={(e) => setDay(Number(e.target.value))}>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>
              Dia {d}
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs leading-relaxed text-[#666f81]">
        Em meses menores, será usado o último dia. Sem término, a recorrência
        continua até você cancelar.
      </p>
      <label className="check-label">
        <input
          type="checkbox"
          checked={hasEnd}
          onChange={(e) => setHasEnd(e.target.checked)}
        />
        Definir término (opcional)
      </label>
      {hasEnd && (
        <label>
          Repetir até
          <input
            type="date"
            required
            min={rule.startDate}
            max="2100-12-31"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-[#fff1eb] p-3 text-sm text-[#a54c36]"
        >
          {error}
        </p>
      )}
      <button
        className={primaryButtonStyles}
        disabled={busy || !!rule.cancelledAt}
      >
        {busy && <DotsRing decorative size={18} />}
        {busy ? "Salvando…" : "Atualizar próximas cobranças"}
      </button>
    </form>
  );
}

"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../hooks/user/useUser";
import { recurrences, type Recurrence } from "../../services/recurrences";
import { localDate } from "../../services/finance";
import { userError } from "../../utils/userError";
import {
  panelStyles,
  primaryButtonStyles,
  secondaryButtonStyles,
} from "../../components/ui/finance-styles";
import { DotsRing } from "../../components/ui/dots-ring";
import FinanceModal from "../finance/FinanceModal";
import RecurrenceForm from "../finance/RecurrenceForm";

const methods: Record<string, string> = {
  PIX: "Pix",
  CASH: "Dinheiro",
  DEBIT_CARD: "Débito",
  CREDIT_CARD: "Crédito",
  OTHER: "Outro",
};
export default function RecurrencesPanel() {
  const { user } = useUser();
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ["finance", user?.id, "recurrences"],
    queryFn: recurrences.list,
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<Recurrence | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const rules = Array.isArray(query.data) ? query.data : [];
  function refresh() {
    setEditing(null);
    setCancelling(null);
    void client.invalidateQueries({ queryKey: ["finance"] });
  }
  async function cancel() {
    if (!cancelling || busy) return;
    setBusy(true);
    setError("");
    try {
      await recurrences.cancel(cancelling.id);
      refresh();
    } catch (error) {
      setError(userError(error, "Não foi possível cancelar a recorrência."));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className={panelStyles}>
      <h2>Assinaturas e recorrências</h2>
      <p className="my-3 text-sm leading-relaxed text-[#718099]">
        Assinaturas, contas fixas e recebimentos mensais. Continuam até você
        cancelar, com término opcional. As próximas cobranças ficam como
        movimentações planejadas.
      </p>
      {query.isPending && <DotsRing label="Carregando recorrências" />}
      {query.isError && (
        <div role="alert">
          <p>Não foi possível carregar suas recorrências.</p>
          <button
            className={secondaryButtonStyles}
            onClick={() => void query.refetch()}
          >
            Tentar novamente
          </button>
        </div>
      )}
      {query.isSuccess && !rules.length && (
        <p className="py-8 text-center text-sm text-[#718099]">
          Nenhuma recorrência cadastrada. Ao criar uma movimentação, escolha
          repetir mensalmente ou cobrança recorrente no cartão.
        </p>
      )}
      <div className="divide-y divide-[#edf0f6]">
        {rules.map((rule) => (
          <article
            key={rule.id}
            className="flex flex-wrap items-center gap-3 py-5"
          >
            <div className="min-w-0 flex-1 basis-48">
              <h3 className="m-0! text-sm font-semibold wrap-anywhere">
                {rule.description}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#718099]">
                Todo dia {rule.day} ·{" "}
                {rule.card?.name ?? methods[rule.paymentMethod] ?? "Outro"}
                <br />
                {rule.cancelledAt
                  ? "Cancelada"
                  : rule.endDate
                    ? `${rule.endDate < localDate() ? "Prazo encerrado" : "Término"}: ${rule.endDate.split("-").reverse().join("/")}`
                    : "Ativa até cancelar"}
              </p>
            </div>
            <strong className="text-primary text-base whitespace-nowrap">
              {rule.amount.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
              <small className="ml-1 text-xs font-normal text-[#718099]">
                /mês
              </small>
            </strong>
            {!rule.cancelledAt && (
              <div className="flex flex-wrap gap-2">
                <button
                  className={secondaryButtonStyles}
                  onClick={() => setEditing(rule.id)}
                  aria-label={`Editar recorrência: ${rule.description}`}
                >
                  Editar
                </button>
                {(!rule.endDate || rule.endDate >= localDate()) && (
                  <button
                    className={secondaryButtonStyles}
                    onClick={() => {
                      setError("");
                      setCancelling(rule);
                    }}
                    aria-label={`Cancelar recorrência: ${rule.description}`}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
      {editing && (
        <RecurrenceForm
          id={editing}
          onClose={() => setEditing(null)}
          onSaved={refresh}
        />
      )}
      {cancelling && (
        <FinanceModal
          title="Cancelar recorrência?"
          busy={busy}
          onClose={() => setCancelling(null)}
        >
          <p className="text-sm leading-relaxed">
            “{cancelling.description}” não terá novas movimentações planejadas.
            Movimentações planejadas futuras serão removidas; compras
            confirmadas, pagamentos e pendências anteriores a hoje serão
            preservados. Isso não cancela a contratação com o fornecedor.
          </p>
          {error && (
            <p role="alert" className="my-3 text-sm text-[#a54c36]">
              {error}
            </p>
          )}
          <button
            className={primaryButtonStyles}
            disabled={busy}
            onClick={() => void cancel()}
          >
            {busy && <DotsRing decorative size={18} />}Confirmar cancelamento
          </button>
        </FinanceModal>
      )}
    </section>
  );
}

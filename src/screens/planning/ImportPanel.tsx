"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../hooks/user/useUser";
import {
  planning,
  type ImportRow,
  type ImportOptions,
  type ImportInspection,
} from "../../services/planning";
import { userError } from "../../utils/userError";
import { DotsRing } from "../../components/ui/dots-ring";
import {
  formStyles,
  panelStyles,
  primaryButtonStyles,
  secondaryButtonStyles,
} from "../../components/ui/finance-styles";
import FinanceModal from "../finance/FinanceModal";

const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const emptyMapping = { date: -1, description: -1, amount: -1, kind: -1 };
export default function ImportPanel() {
  const client = useQueryClient();
  const { user } = useUser();
  const cards = useQuery({
    queryKey: ["finance", user?.id, "cards"],
    queryFn: planning.cards,
  });
  const [text, setText] = useState("");
  const [filename, setFilename] = useState("");
  const [inspection, setInspection] = useState<ImportInspection | null>(null);
  const [options, setOptions] = useState<ImportOptions>({
    source: "account",
    signs: "negative_expenses",
  });
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [ignored, setIgnored] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [confirm, setConfirm] = useState(false);
  function change(next: ImportOptions) {
    setOptions(next);
    setReviewed(false);
    setRows([]);
    setSelected(new Set());
    setError("");
    setResult("");
  }
  async function read(file?: File) {
    if (!file || busy) return;
    setError("");
    setResult("");
    setReviewed(false);
    setRows([]);
    setSelected(new Set());
    setInspection(null);
    setText("");
    setFilename("");
    if (file.size > 800000) {
      setError("Escolha um arquivo de até 800 KB.");
      return;
    }
    if (!/\.(csv|ofx)$/i.test(file.name)) {
      setError(
        "Escolha um arquivo CSV ou OFX. PDF e planilhas Excel ainda não são aceitos.",
      );
      return;
    }
    setBusy(true);
    try {
      const buffer = await file.arrayBuffer();
      let content: string;
      try {
        content = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
      } catch {
        content = new TextDecoder("windows-1252").decode(buffer);
      }
      if (new TextEncoder().encode(content).length > 800000) {
        setError("O conteúdo do extrato deve ter até 800 KB em UTF-8. Exporte um período menor.");
        return;
      }
      const info = await planning.inspect(content);
      setText(content);
      setFilename(file.name);
      setInspection(info);
      setOptions((previous) => ({
        source: info.source as "account" | "card",
        signs: info.signs,
        separator: info.separator,
        mapping:
          info.format === "csv" ? (info.mapping ?? emptyMapping) : undefined,
        cardId: previous.cardId,
      }));
    } catch (error) {
      setError(
        userError(
          error,
          "Não foi possível ler esse arquivo. Confira se ele é um CSV ou OFX exportado pelo banco.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  async function preview() {
    if (busy) return;
    setBusy(true);
    setError("");
    setResult("");
    try {
      const data = await planning.previewDetailed(text, options);
      setRows(data.rows);
      setIgnored(data.ignoredPayments);
      setReviewed(true);
      setSelected(
        new Set(
          data.rows.flatMap((r, i) =>
            r.duplicate || r.possibleDuplicate || r.futureIncome ? [] : [i],
          ),
        ),
      );
    } catch (error) {
      setError(
        userError(
          error,
          "Não foi possível preparar a revisão. Confira as colunas e os valores do arquivo.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    if (busy || !selected.size) return;
    setBusy(true);
    setError("");
    try {
      const data = await planning.import(
        rows.filter((_, i) => selected.has(i)),
        options,
      );
      setResult(
        `${data.imported} movimentações importadas. ${data.skipped} já estavam registradas e foram ignoradas.`,
      );
      setRows([]);
      setSelected(new Set());
      setReviewed(false);
      setInspection(null);
      setText("");
      setFilename("");
      setConfirm(false);
      await client.invalidateQueries({ queryKey: ["finance"] });
    } catch (error) {
      setError(userError(error));
      setConfirm(false);
    } finally {
      setBusy(false);
    }
  }
  const picked = rows.filter((_, i) => selected.has(i));
  const sum = (kind: string) =>
    picked
      .filter((r) => r.kind === kind)
      .reduce((total, r) => total + Math.round(r.amount * 100), 0) / 100;
  const mapping = options.mapping ?? emptyMapping;
  const validMapping =
    inspection?.format === "ofx" ||
    ([mapping.date, mapping.description, mapping.amount].every((i) => i >= 0) &&
      new Set([mapping.date, mapping.description, mapping.amount]).size === 3);
  return (
    <section className={panelStyles}>
      <h2>Importar extrato</h2>
      <p className="my-3 text-sm leading-relaxed text-[#718099]">
        Importe extratos de conta ou faturas em CSV e OFX. Escolha como ler o
        arquivo, revise e confirme. Até 800 KB e 1.000 lançamentos; PDF fica
        para uma próxima etapa.
      </p>
      <label className="my-5 flex flex-col gap-3 rounded-xl border border-dashed border-[#a1b5ee] bg-[#f7f9ff] p-5 text-sm">
        Escolher arquivo
        <input
          type="file"
          accept=".csv,.ofx,text/csv"
          disabled={busy}
          className="max-w-full file:mr-3 file:rounded-lg file:border-0 file:bg-[#e6edff] file:p-3 file:text-[#1447e6]"
          onChange={(e) => {
            void read(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      {inspection && (
        <div className={formStyles}>
          <p className="text-sm wrap-anywhere">
            <strong>{filename}</strong> · {inspection.profile ?? "OFX"}
          </p>
          <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">
            <label>
              Origem dos lançamentos
              <select
                aria-label="Origem dos lançamentos"
                value={options.source}
                onChange={(e) =>
                  change({
                    ...options,
                    source: e.target.value as "account" | "card",
                  })
                }
              >
                <option value="account">Extrato de conta</option>
                <option value="card">Fatura de cartão</option>
              </select>
            </label>
            {options.source === "card" && (
              <label>
                Cartão da fatura
                <select
                  aria-label="Cartão da fatura"
                  value={options.cardId ?? ""}
                  onChange={(e) =>
                    change({
                      ...options,
                      cardId: Number(e.target.value) || undefined,
                    })
                  }
                >
                  <option value="">Selecione um cartão</option>
                  {cards.data
                    ?.filter((card) => !card.archivedAt)
                    .map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.name}
                      </option>
                    ))}
                </select>
              </label>
            )}
            <label>
              Como interpretar os valores
              <select
                aria-label="Como interpretar os valores"
                value={options.signs}
                onChange={(e) =>
                  change({
                    ...options,
                    signs: e.target.value as ImportOptions["signs"],
                  })
                }
              >
                <option value="negative_expenses">
                  Negativo é despesa; positivo é receita
                </option>
                <option value="positive_expenses">
                  Positivo é despesa; negativo é crédito/estorno
                </option>
              </select>
            </label>
            {inspection.format === "csv" && (
              <>
                {(
                  [
                    ["date", "Coluna da data"],
                    ["description", "Coluna da descrição"],
                    ["amount", "Coluna do valor"],
                    ["kind", "Coluna do tipo (opcional)"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key}>
                    {label}
                    <select
                      aria-label={label}
                      value={mapping[key] ?? -1}
                      onChange={(e) =>
                        change({
                          ...options,
                          mapping: {
                            ...mapping,
                            [key]: Number(e.target.value),
                          },
                        })
                      }
                    >
                      <option value={-1}>
                        {key === "kind"
                          ? "Usar sinais dos valores"
                          : "Selecione a coluna"}
                      </option>
                      {inspection.headers.map((header, index) => (
                        <option key={index} value={index}>
                          {index + 1}. {header || "Sem título"}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </>
            )}
          </fieldset>
          {options.source === "card" ? (
            <p className="text-xs leading-relaxed text-[#718099]">
              Compras entram no cartão como realizadas a pagar; datas futuras
              ficam planejadas. Importar não quita a fatura. Estornos continuam
              como receitas compensatórias, sem vínculo com o cartão. Cada
              parcela é importada só uma vez, sem gerar as próximas.
            </p>
          ) : (
            <p className="text-xs leading-relaxed text-[#718099]">
              Datas até hoje entram como pagas ou recebidas; datas futuras ficam
              planejadas. Desmarque transferências e pagamentos de faturas já
              representados no Finsy.
            </p>
          )}
          {cards.isError && options.source === "card" && (
            <p role="alert">
              Não foi possível carregar os cartões.{" "}
              <button
                className={secondaryButtonStyles}
                onClick={() => void cards.refetch()}
              >
                Tentar novamente
              </button>
            </p>
          )}
          {inspection.format === "csv" && inspection.sample.length > 0 && (
            <details className="text-xs text-[#718099]">
              <summary className="cursor-pointer">
                Ver primeiras linhas do arquivo
              </summary>
              <div className="mt-3 max-w-full overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr>
                      {inspection.headers.map((header, i) => (
                        <th key={i} className="border-b p-2">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inspection.sample.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="max-w-60 border-b p-2 wrap-anywhere"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
          <button
            className={secondaryButtonStyles}
            disabled={
              busy ||
              !validMapping ||
              (options.source === "card" && !options.cardId)
            }
            onClick={() => void preview()}
          >
            {reviewed ? "Atualizar revisão" : "Revisar lançamentos"}
          </button>
        </div>
      )}
      {busy && (
        <div
          className="flex items-center justify-center gap-3 py-7"
          role="status"
        >
          <DotsRing decorative />
          <p>Processando extrato…</p>
        </div>
      )}
      {error && (
        <p
          role="alert"
          className="my-4 rounded-lg bg-[#fff1eb] p-3 text-sm text-[#a54c36]"
        >
          {error}
        </p>
      )}
      {result && (
        <p
          role="status"
          className="my-4 rounded-xl bg-[#edf3ff] p-4 text-sm text-[#244b9a]"
        >
          {result}
        </p>
      )}
      {reviewed && (
        <div className="mt-6">
          <h3 className="font-semibold">Confira antes de importar</h3>
          <div className="my-4 grid grid-cols-2 gap-3 rounded-xl bg-[#f3f6fc] p-4 text-sm">
            <p>
              Despesas selecionadas
              <strong className="mt-1 block text-[#1447e6]">
                {money(sum("EXPENSE"))}
              </strong>
            </p>
            <p>
              Receitas e estornos
              <strong className="mt-1 block text-[#1447e6]">
                {money(sum("INCOME"))}
              </strong>
            </p>
          </div>
          <p className="text-xs leading-relaxed text-[#718099]">
            {rows.filter((r) => r.duplicate).length} já importados ·{" "}
            {rows.filter((r) => r.possibleDuplicate && !r.duplicate).length}{" "}
            parecidos com lançamentos já cadastrados · {ignored} pagamentos de
            fatura ignorados. Possíveis duplicados começam desmarcados; confira
            antes de selecioná-los.
          </p>
          <div className="my-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p>
              {selected.size} de {rows.length} lançamentos selecionados
            </p>
            <button
              className={secondaryButtonStyles}
              disabled={busy}
              onClick={() =>
                setSelected(
                  selected.size
                    ? new Set()
                    : new Set(
                        rows.flatMap((r, i) =>
                          r.duplicate || r.possibleDuplicate || r.futureIncome
                            ? []
                            : [i],
                        ),
                      ),
                )
              }
            >
              {selected.size ? "Desmarcar todos" : "Selecionar disponíveis"}
            </button>
          </div>
          {!rows.length && (
            <p className="py-4 text-sm">
              Não há lançamentos para importar. Os pagamentos de fatura
              encontrados foram ignorados.
            </p>
          )}
          <div className="import-preview my-5 max-h-110 [scrollbar-width:thin] [scrollbar-color:#bac8ea_transparent] overflow-y-auto">
            {rows.map((row, i) => (
              <label
                key={i}
                className="flex items-center gap-3 border-b border-[#edf0f6] py-4 text-sm"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 shrink-0 accent-[#1447e6]"
                  checked={selected.has(i)}
                  disabled={busy || row.duplicate || row.futureIncome}
                  onChange={(e) =>
                    setSelected((previous) => {
                      const next = new Set(previous);
                      if (e.target.checked) next.add(i);
                      else next.delete(i);
                      return next;
                    })
                  }
                />
                <span className="min-w-0 flex-1 wrap-anywhere">
                  <strong>{row.description}</strong>
                  <small className="mt-1 block text-xs text-[#718099]">
                    {row.date.split("-").reverse().join("/")} ·{" "}
                    {row.kind === "EXPENSE" ? "Despesa" : "Receita"}
                    {row.duplicate
                      ? " · Já importada"
                      : row.futureIncome
                        ? " · Receita com data futura: não será importada"
                        : row.possibleDuplicate
                          ? " · Possível duplicado: confira"
                          : ""}
                  </small>
                </span>
                <strong className="shrink-0">{money(row.amount)}</strong>
              </label>
            ))}
          </div>
          <button
            className={primaryButtonStyles}
            disabled={busy || !selected.size}
            onClick={() => setConfirm(true)}
          >
            Importar {selected.size} lançamentos
          </button>
        </div>
      )}
      {confirm && (
        <FinanceModal
          title="Confirmar importação?"
          busy={busy}
          onClose={() => setConfirm(false)}
        >
          <p className="text-sm leading-relaxed">
            Serão criadas {selected.size} movimentações nas datas do arquivo,
            sem categoria.{" "}
            {options.source === "card"
              ? "As despesas serão vinculadas ao cartão e ficarão a pagar. Nenhuma fatura será marcada como paga. Estornos entram como receitas compensatórias."
              : "Datas até hoje entram como pagas ou recebidas; datas futuras ficam planejadas."}{" "}
            Confira os lançamentos parecidos com os já cadastrados.
          </p>
          <button
            className={primaryButtonStyles}
            disabled={busy}
            onClick={() => void save()}
          >
            {busy && <DotsRing decorative size={18} />}Confirmar importação
          </button>
        </FinanceModal>
      )}
    </section>
  );
}

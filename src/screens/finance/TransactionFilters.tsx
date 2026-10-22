"use client";
import {
  secondaryButtonStyles,
  primaryButtonStyles,
} from "@/components/ui/finance-styles";

import { cn } from "@/lib/utils";
import { useId, useMemo, useState } from "react";
import CurrencyInput from "../../components/CurrencyInput";
import FinanceModal from "./FinanceModal";
import type { FinanceCategory, Transaction } from "../../services/finance";
import {
  defaultTransactionFilters,
  type TransactionFilters as FilterValues,
} from "../../utils/transactionFilters";
export default function TransactionFilters({
  filters,
  onChange,
  onClear,
  search,
  setSearch,
  categories,
  entries,
  period,
  count,
}: {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  onClear: () => void;
  search: string;
  setSearch: (value: string) => void;
  categories: FinanceCategory[];
  entries: Transaction[];
  period: string;
  count: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const active = Object.entries(filters).filter(
    ([key, value]) =>
      key !== "order" &&
      value !== defaultTransactionFilters[key as keyof FilterValues],
  ).length;
  const options = useMemo(() => {
    const items = new Map(
      categories.map((category) => [
        category.id,
        {
          name:
            category.kind === "INCOME"
              ? `${category.name} (receita)`
              : category.name,
          archived: false,
        },
      ]),
    );
    for (const entry of entries)
      if (entry.category && !items.has(entry.category.id))
        items.set(entry.category.id, {
          name:
            entry.kind === "INCOME"
              ? `${entry.category.name} (receita)`
              : entry.category.name,
          archived: true,
        });
    return [...items.entries()].sort((a, b) =>
      a[1].name.localeCompare(b[1].name, "pt-BR"),
    );
  }, [categories, entries]);
  const set = <K extends keyof FilterValues>(key: K, value: FilterValues[K]) =>
    onChange({ ...filters, [key]: value });
  const [year, month] = period.split("-").map(Number);
  const lastDate = new Date(Date.UTC(year, month, 0))
    .toISOString()
    .slice(0, 10);
  return (
    <div className="movement-filter-panel">
      <div
        className={cn(
          "transaction-filters movement-quick-filters mt-0 mr-[23px] mb-3 ml-[23px] flex flex-wrap items-center gap-3 pt-[5px] max-[761px]:mx-[17px] max-[761px]:flex-wrap max-[761px]:gap-[9px] [&_.count-badge]:h-5 [&_.count-badge]:min-w-5 [&_.search-input]:basis-55 [&_.secondary-button]:px-3 [&_.secondary-button]:py-[9px] [&_select]:max-w-47.5 [&_select]:rounded-[7px] [&_select]:border [&_select]:border-[#dee2ea] [&_select]:bg-white [&_select]:px-2.5 [&_select]:py-[7px] [&_select]:text-[length:12px] [&_select]:text-[#6a7487] max-[761px]:[&_select]:w-full max-[761px]:[&_select]:max-w-none",
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
        <button
          className={cn(secondaryButtonStyles)}
          aria-expanded={expanded}
          aria-haspopup="dialog"
          aria-controls={expanded ? panelId : undefined}
          onClick={() => setExpanded(true)}
        >
          <i aria-hidden="true" className="bi bi-funnel" /> Filtros{" "}
          {active > 0 && (
            <span
              className={cn(
                "count-badge grid h-[23px] min-w-[23px] place-items-center rounded-[7px] bg-[#ebeef5] text-[length:12px] text-[#798499]",
              )}
            >
              {active}
            </span>
          )}
        </button>
      </div>
      {expanded && (
        <FinanceModal
          id={panelId}
          variant="drawer"
          title="Filtrar movimentações"
          onClose={() => setExpanded(false)}
        >
          <div
            className={cn(
              "finance-drawer-body min-h-0 flex-1 [scrollbar-width:thin] [scrollbar-color:#bdcae8_transparent] overflow-y-auto [overscroll-behavior:contain]",
            )}
          >
            <p
              className={cn(
                "filter-drawer-description pt-5 pr-6 pb-0 pl-6 text-[length:12px] leading-[1.8] text-[#737f94] max-[421px]:px-5",
              )}
            >
              Combine os filtros para encontrar movimentações do mês
              selecionado.
            </p>
            <div
              className={cn(
                "movement-advanced-filters [&_input:focus-visible]:border-primary [&_select:focus-visible]:border-primary mx-[23px] my-[15px] grid grid-cols-4 items-start gap-4 rounded-[9px] border border-[#e1e7f3] bg-[#f8faff] p-[17px] max-[1101px]:grid-cols-2 max-[761px]:mx-[17px] max-[761px]:p-[13px] max-[421px]:grid-cols-[1fr] [&_.form-error]:col-span-full [&_input]:h-10 [&_input]:w-full [&_input]:min-w-0 [&_input]:rounded-[7px] [&_input]:border [&_input]:border-[#d7dce7] [&_input]:bg-white [&_input]:p-2 [&_input]:text-[length:12px] [&_input]:text-[#303b51] [&_input:focus-visible]:shadow-[0_0_0_2px_#1447e61a] [&_input:focus-visible]:outline-none [&_label]:flex [&_label]:min-w-0 [&_label]:flex-col [&_label]:gap-2 [&_label]:text-[length:12px] [&_label]:text-[#646d80] [&_select]:h-10 [&_select]:w-full [&_select]:min-w-0 [&_select]:rounded-[7px] [&_select]:border [&_select]:border-[#d7dce7] [&_select]:bg-white [&_select]:p-2 [&_select]:text-[length:12px] [&_select]:text-[#303b51] [&_select:focus-visible]:shadow-[0_0_0_2px_#1447e61a] [&_select:focus-visible]:outline-none [&_small]:text-[length:10px] [&_small]:leading-[1.6] [&_small]:text-[#737f94] [&[hidden]]:hidden",
              )}
            >
              <label>
                Tipo
                <select
                  aria-label="Tipo de movimentação"
                  value={filters.kind}
                  onChange={(event) => set("kind", event.target.value)}
                >
                  <option value="ALL">Receitas e despesas</option>
                  <option value="EXPENSE">Despesas</option>
                  <option value="INCOME">Receitas</option>
                </select>
              </label>
              <label>
                Situação
                <select
                  aria-label="Situação da movimentação"
                  value={filters.status}
                  onChange={(event) => set("status", event.target.value)}
                >
                  <option value="ALL">Todas as situações</option>
                  <option value="REALIZED">Realizadas</option>
                  <option value="FORECAST">Movimentações planejadas</option>
                  <option value="COMPLETED">Pagas ou recebidas</option>
                  <option value="PLANNED">A pagar ou a receber</option>
                </select>
              </label>
              <label>
                Categoria
                <select
                  value={filters.category}
                  onChange={(event) => set("category", event.target.value)}
                >
                  <option value="ALL">Todas as categorias</option>
                  <option value="NONE">Sem categoria</option>
                  {options.map(([id, category]) => (
                    <option key={id} value={id}>
                      {category.name}
                      {category.archived ? " (arquivada)" : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Forma de pagamento
                <select
                  value={filters.paymentMethod}
                  onChange={(event) => set("paymentMethod", event.target.value)}
                >
                  <option value="ALL">Todas as formas</option>
                  <option value="PIX">Pix</option>
                  <option value="CASH">Dinheiro</option>
                  <option value="DEBIT_CARD">Débito</option>
                  <option value="CREDIT_CARD">Crédito</option>
                  <option value="OTHER">Outro</option>
                </select>
              </label>
              <label>
                Data inicial
                <input
                  type="date"
                  min={`${period}-01`}
                  max={lastDate}
                  value={filters.from}
                  onChange={(event) => set("from", event.target.value)}
                />
              </label>
              <label>
                Data final
                <input
                  type="date"
                  min={filters.from || `${period}-01`}
                  max={lastDate}
                  value={filters.to}
                  onChange={(event) => set("to", event.target.value)}
                />
              </label>
              <label>
                Valor mínimo (R$)
                <CurrencyInput
                  value={filters.minimum}
                  onValueChange={(value) => set("minimum", value)}
                />
              </label>
              <label>
                Valor máximo (R$)
                <CurrencyInput
                  aria-label="Valor máximo (R$)"
                  aria-describedby={`${panelId}-maximum-hint`}
                  value={filters.maximum}
                  onValueChange={(value) => set("maximum", value)}
                />
                <small id={`${panelId}-maximum-hint`}>
                  0,00 significa sem limite máximo.
                </small>
              </label>
              <label>
                Ordenar por
                <select
                  value={filters.order}
                  onChange={(event) => set("order", event.target.value)}
                >
                  <option value="NEWEST">Mais recentes</option>
                  <option value="OLDEST">Mais antigas</option>
                  <option value="HIGHEST">Maior valor</option>
                  <option value="LOWEST">Menor valor</option>
                </select>
              </label>
              <p
                className={cn(
                  "movement-filter-hint self-center text-[length:10px] leading-[1.6] text-[#737f94]",
                )}
              >
                Os filtros valem para o mês selecionado e para a exportação CSV.
              </p>
              {((filters.from && filters.to && filters.from > filters.to) ||
                (filters.maximum > 0 && filters.maximum < filters.minimum)) && (
                <p
                  className={cn(
                    "form-error rounded-[7px] bg-[#fff1eb] p-2.5 text-[length:13px] text-[#a54c36]",
                  )}
                  role="alert"
                >
                  Confira os intervalos: o início deve ser menor ou igual ao
                  fim.
                </p>
              )}
            </div>
          </div>
          <footer
            className={cn(
              "finance-drawer-footer flex shrink-0 items-center justify-between gap-3 border-t border-t-[#e1e7f3] bg-white pt-4.5 pr-6 pb-[max(18px,_env(safe-area-inset-bottom))] pl-6 max-[421px]:gap-2 max-[421px]:px-4 [&_.primary-button]:flex-1 max-[421px]:[&_button]:px-3 max-[421px]:[&_button]:text-[length:11px]",
            )}
          >
            <button className={cn(secondaryButtonStyles)} onClick={onClear}>
              Limpar filtros
            </button>
            <button
              className={cn(primaryButtonStyles)}
              onClick={() => setExpanded(false)}
            >
              Ver {count} {count === 1 ? "movimentação" : "movimentações"}
              <i aria-hidden="true" className="bi bi-arrow-right" />
            </button>
          </footer>
        </FinanceModal>
      )}
      <div
        className={cn(
          "movement-filter-results mt-0 mr-[23px] mb-[15px] ml-[23px] flex items-center justify-between gap-3 text-[length:11px] text-[#737f94] max-[761px]:mx-[17px] max-[761px]:flex-wrap",
        )}
      >
        <span aria-live="polite">
          Mostrando {count} de {entries.length} movimentações
        </span>
        {(active > 0 || search || filters.order !== "NEWEST") && (
          <button
            className={cn(
              "text-button [&:hover]:text-primary inline-flex items-center gap-2 text-[length:12px] font-semibold text-[#485774]",
            )}
            onClick={onClear}
          >
            <i aria-hidden="true" className="bi bi-x-circle" /> Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}

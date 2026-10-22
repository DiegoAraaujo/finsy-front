"use client";
import {
  categoryPanelStyles,
  secondaryButtonStyles,
} from "@/components/ui/finance-styles";

import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DotsRing } from "@/components/ui/dots-ring";
import { useUser } from "../../hooks/user/useUser";
import { finance } from "../../services/finance";
import { userError } from "../../utils/userError";
export default function ArchivedCategories({
  kind = "EXPENSE",
}: {
  kind?: "INCOME" | "EXPENSE";
}) {
  const { user } = useUser();
  const client = useQueryClient();
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["finance", user?.id, "archived-categories"],
    queryFn: finance.archivedCategories,
  });
  const restore = useMutation({
    mutationFn: finance.restoreCategory,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["finance"] });
      toast.success("Categoria restaurada. Ela já pode ser usada novamente.");
    },
    onError: (error) =>
      toast.error(
        userError(
          error,
          "Não foi possível restaurar a categoria. Tente novamente em instantes.",
        ),
      ),
  });
  if (isPending)
    return (
      <div className={cn(categoryPanelStyles)} role="status">
        <DotsRing decorative />
        <p>Carregando categorias arquivadas…</p>
      </div>
    );
  if (isError || !data)
    return (
      <div className={cn(categoryPanelStyles)} role="alert">
        <h3>Não foi possível carregar as categorias arquivadas.</h3>
        <button
          className={cn(secondaryButtonStyles)}
          onClick={() => void refetch()}
        >
          Tentar novamente
        </button>
      </div>
    );
  const visible = data.filter(
    (category) => (category.kind ?? "EXPENSE") === kind,
  );
  if (!visible.length)
    return (
      <div className={cn(categoryPanelStyles)}>
        <span
          className={cn(
            "empty-icon inline-grid h-[45px] w-[45px] shrink-0 place-items-center rounded-[13px] bg-[#edf0f6] text-[length:21px] text-[#78859f]",
          )}
        >
          <i aria-hidden="true" className="bi bi-archive" />
        </span>
        <h3>Nenhuma categoria arquivada</h3>
        <p>
          As categorias que você arquivar aparecem aqui e podem ser restauradas
          a qualquer momento.
        </p>
      </div>
    );
  return (
    <section
      className={cn(
        "category-grid grid grid-cols-3 gap-4.5 max-[1201px]:grid-cols-2 max-[761px]:gap-[13px] max-[421px]:grid-cols-[1fr]",
      )}
      aria-label="Categorias arquivadas"
    >
      {visible.map((category) => {
        const restoring =
          restore.isPending && restore.variables === category.id;
        return (
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
                <i aria-hidden="true" className="bi bi-archive" />
              </span>
              <h2>{category.name}</h2>
              <span
                className={cn(
                  "status-badge ml-1 rounded-sm bg-[#f6f1df] px-[5px] py-0.5 text-[length:10px] text-[#a28b51] max-[761px]:mt-[3px] max-[761px]:inline-block",
                )}
              >
                Arquivada
              </span>
            </div>
            <p
              className={cn(
                "budget-caption mx-0 my-3 text-[length:11px] leading-[1.7] text-[#666f81]",
              )}
            >
              Arquivada em{" "}
              {new Date(category.archivedAt).toLocaleDateString("pt-BR")}. Os
              lançamentos e limites foram mantidos.
            </p>
            <div
              className={cn(
                "category-footer mt-4 flex items-center justify-between border-t border-t-[#e5e9f0] pt-3 max-[761px]:[&_.text-button]:text-[length:11px]",
              )}
            >
              <button
                className={cn(secondaryButtonStyles)}
                disabled={restore.isPending}
                aria-busy={restoring}
                aria-label={`Restaurar ${category.name}`}
                onClick={() => restore.mutate(category.id)}
              >
                {restoring ? (
                  <DotsRing decorative size={16} className="text-current" />
                ) : (
                  <i
                    aria-hidden="true"
                    className="bi bi-arrow-counterclockwise"
                  />
                )}
                {restoring ? "Restaurando…" : "Restaurar categoria"}
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}

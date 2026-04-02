import { formatCurrency } from "../../../utils/formatCurrency";

type MonthOptionCardProps = {
  title: string;
  description: string;
  salary?: number;
  disabled?: boolean;
  categories?: number;
  icon?: string;
  onClick?: () => void;
};
const MonthOptionCard = ({
  title,
  description,
  salary,
  categories,
  icon,
  onClick,
  disabled,
}: MonthOptionCardProps) => {
  return (
    <button
      disabled={disabled}
      type="button"
      onClick={onClick}
      aria-label={`Selecionar opção: ${title}`}
      className={`group border-surface-subtle hover:bg-surface-subtle/50 bg-background flex w-full cursor-pointer items-center gap-4 rounded-2xl border-t p-4 transition-all duration-300 ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:bg-gray-100"
      }`}
    >
      {icon && (
        <i
          aria-hidden="true"
          className={`${icon} text-primary bg-primary/10 rounded-2xl p-1 px-2 sm:text-2xl`}
        />
      )}

      <div className="flex flex-1 flex-col items-start gap-0.5">
        <p className="font-bold">{title}</p>
        <p className="text-secundary text-xs sm:text-sm">{description}</p>

        {salary !== undefined && categories !== undefined && (
          <div className="flex gap-4 text-xs sm:text-sm">
            <p className="text-secundary">
              salário:{" "}
              <span className="text-base font-semibold">
                {formatCurrency(salary)}
              </span>
            </p>

            <p className="text-secundary">|</p>

            <p className="text-secundary">{categories} Categorias</p>
          </div>
        )}
      </div>

      <i
        aria-hidden="true"
        className="bi bi-arrow-right group-hover:text-primary transition-all duration-300 group-hover:translate-x-1 sm:text-xl"
      />
    </button>
  );
};

export default MonthOptionCard;

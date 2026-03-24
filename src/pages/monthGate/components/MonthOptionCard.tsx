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
      className={`group flex w-full cursor-pointer items-center gap-4 rounded-2xl border-t border-gray-200 bg-white p-4 transition-all duration-300 hover:bg-gray-100 ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:bg-gray-100"
      }`}
    >
      {icon && (
        <i
          aria-hidden="true"
          className={`${icon} rounded-2xl bg-blue-100 p-1 px-2 text-blue-600 sm:text-2xl`}
        />
      )}

      <div className="flex flex-1 flex-col items-start gap-0.5">
        <p className="font-bold">{title}</p>
        <p className="text-xs text-gray-500 sm:text-sm">{description}</p>

        {salary !== undefined && categories !== undefined && (
          <div className="flex gap-4 text-xs sm:text-sm">
            <p className="text-gray-500">
              salário:{" "}
              <span className="font-semibold text-gray-900">
                {formatCurrency(salary)}
              </span>
            </p>

            <p className="text-gray-500">|</p>

            <p className="text-gray-500">{categories} Categorias</p>
          </div>
        )}
      </div>

      <i
        aria-hidden="true"
        className="bi bi-arrow-right transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600 sm:text-xl"
      />
    </button>
  );
};

export default MonthOptionCard;

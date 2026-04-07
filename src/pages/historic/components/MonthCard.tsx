import { Link } from "react-router-dom";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatMonthYear } from "../../../utils/formatMonthName";

interface MonthCardProps {
  monthId: number;
  month: number;
  year: number;
  salary: number;
  isCurrentMonth: boolean;
}

const MonthCard = ({
  month,
  monthId,
  salary,
  year,
  isCurrentMonth,
}: MonthCardProps) => {
  return (
    <Link
      to={`/month/${monthId}`}
      state={{ isCurrentMonth }}
      className="group border-surface-subtle bg-background flex cursor-pointer justify-between gap-4 rounded-2xl border-t p-4 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold sm:text-[16px]">
          {formatMonthYear(month, year)}
        </p>
        <p className="text-secundary text-xs sm:text-sm">
          Salário {formatCurrency(salary)}
        </p>
      </div>
      <i className="bi bi-chevron-right text-secundary group-hover:text-primary text-sm transition-all duration-300 group-hover:translate-x-1" />
    </Link>
  );
};

export default MonthCard;

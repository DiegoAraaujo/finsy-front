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
      className="group border-surface-subtle bg-background flex cursor-pointer flex-col gap-4 rounded-2xl border-t p-4 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-bold">{formatMonthYear(month, year)}</p>
          <p className="text-secundary text-sm font-medium">
            Salário {formatCurrency(salary)}
          </p>
        </div>
        <i className="bi bi-chevron-right text-secundary group-hover:text-primary text-sm transition-all duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
};

export default MonthCard;

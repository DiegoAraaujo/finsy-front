import { Link } from "react-router-dom";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatMonthYear } from "../../../utils/formatMonthName";

interface MonthCardProps {
  monthId: number;
  month: number;
  year: number;
  salary: number;
}

const MonthCard = ({ month, monthId, salary, year }: MonthCardProps) => {
  return (
    <Link
      to={`/month/${monthId}`}
      className="group flex cursor-pointer flex-col gap-4 rounded-2xl border-t border-gray-200 bg-white p-4 transition-all duration-300 hover:bg-gray-100"
    >
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-bold">{formatMonthYear(month, year)}</p>
          <p className="text-sm font-medium text-gray-500">
            Salário {formatCurrency(salary)}
          </p>
        </div>
        <i className="bi bi-chevron-right text-sm text-gray-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600" />
      </div>
    </Link>
  );
};

export default MonthCard;

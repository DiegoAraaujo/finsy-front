import { formatCurrency } from "../utils/formatCurrency";

interface SummaryItemCardProps {
  label: string;
  value: number;
  textColor?: string;
}

const SummaryItemCard = ({
  label,
  value,
  textColor = "text-base",
}: SummaryItemCardProps) => {
  return (
    <div>
      <p className="text-secundary text-center text-xs font-medium">{label}</p>
      <p className={` ${textColor} text-center font-bold sm:text-lg`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
};

export default SummaryItemCard;

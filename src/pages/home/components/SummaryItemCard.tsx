import { formatCurrency } from "../../../utils/formatCurrency";

interface SummaryItemCardProps {
  label: string;
  value: number;
  textColor: string;
}

const SummaryItemCard = ({ label, value, textColor }: SummaryItemCardProps) => {
  return (
    <div>
      <p className="text-center text-xs font-medium text-gray-500">{label}</p>
      <p className={` ${textColor} text-center text-lg font-bold`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
};

export default SummaryItemCard;

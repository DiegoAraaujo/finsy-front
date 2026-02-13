import { formatCurrency } from "../../../utils/formatCurrency";

interface SummaryItemCardProps {
  label: string;
  value: number;
}

const SummaryItemCard = ({ label, value }: SummaryItemCardProps) => {
  return (
    <div >
      <p className="text-xs text-gray-500 font-medium text-center">{label}</p>
      <p className="font-bold text-center text-lg">{formatCurrency(value)}</p>
    </div>
  );
};

export default SummaryItemCard;

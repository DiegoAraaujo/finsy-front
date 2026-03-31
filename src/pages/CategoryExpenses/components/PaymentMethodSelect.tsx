import type { PaymentMethod } from "../interface";

interface Props {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

const PaymentMethodSelect = ({ value, onChange }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-gray-500">
        Método de Pagamento
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as PaymentMethod)}
        className="rounded-2xl border border-gray-300 p-2 text-sm focus:outline-blue-500"
      >
        <option value="PIX">Pix</option>
        <option value="CASH">Dinheiro</option>
        <option value="CREDIT_CARD">Cartão de Crédito</option>
        <option value="DEBIT_CARD">Cartão de Débito</option>
        <option value="OTHER">Outro</option>
      </select>
    </div>
  );
};

export default PaymentMethodSelect;
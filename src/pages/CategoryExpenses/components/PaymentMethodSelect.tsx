import type { PaymentMethod } from "../../../types/paymentMethod";

interface Props {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

const PaymentMethodSelect = ({ value, onChange }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-secundary font-medium">Método de Pagamento</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as PaymentMethod)}
        className="border-surface-subtle focus:outline-primary rounded-2xl border p-2 text-sm"
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

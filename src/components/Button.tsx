interface ButtonProps {
  label: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const Button = ({
  label,
  type = "button",
  onClick,
  loading = false,
  disabled = false,
  loadingLabel = "carregando...",
}: ButtonProps) => {
  const isDisabled = loading || disabled;

  return (
    <button
      disabled={isDisabled}
      type={type}
      onClick={onClick}
      aria-busy={loading}
      className="w-full cursor-pointer rounded-2xl bg-blue-600 p-2 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:transform-none disabled:opacity-60"
    >
      {loading ? loadingLabel : label}
    </button>
  );
};

export default Button;

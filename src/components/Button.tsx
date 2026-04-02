interface ButtonProps {
  label: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  textColor?: string;
  backgroundColor?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const Button = ({
  label,
  type = "button",
  onClick,
  textColor = "text-inverse",
  backgroundColor = "bg-button",
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
      className={`w-full cursor-pointer rounded-2xl p-2 font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:translate-none disabled:cursor-not-allowed disabled:opacity-60 ${backgroundColor} ${textColor}`}
    >
      {loading ? loadingLabel : label}
    </button>
  );
};

export default Button;

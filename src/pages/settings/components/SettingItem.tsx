interface SettingItemProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

const SettingItem = ({
  title,
  description,
  icon,
  variant = "default",
  onClick,
  disabled = false,
}: SettingItemProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`group border-surface-subtle bg-background flex w-full justify-between gap-4 rounded-2xl border-t p-4 transition-all duration-300 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:-translate-y-0.5"}`}
    >
      <div className="flex gap-4">
        <i
          className={`${icon} flex h-10 w-10 items-center justify-center rounded-full text-xl ${
            variant === "danger"
              ? "bg-danger/10 text-danger"
              : "bg-primary/10 text-primary"
          }`}
        />
        <div className="flex flex-col items-start text-left">
          <p
            className={`font-semibold ${
              variant === "danger" ? "text-danger" : "text-base"
            }`}
          >
            {title}
          </p>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
      </div>
      <i
        className={`bi bi-chevron-right text-sm text-gray-500 transition-all duration-300 ${!disabled && "group-hover:translate-x-1"} ${!disabled && (variant === "danger" ? "group-hover:text-danger" : "group-hover:text-primary")}`}
      />
    </button>
  );
};

export default SettingItem;

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
      className={`group flex w-full justify-between gap-4 rounded-2xl border-t border-gray-200 bg-white p-4 transition-all duration-300 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-gray-100"}`}
    >
      <div className="flex gap-4">
        <i
          className={`${icon} flex h-10 w-10 items-center justify-center rounded-full text-xl ${
            variant === "danger"
              ? "bg-red-100 text-red-600"
              : "bg-blue-100 text-blue-700"
          }`}
        />
        <div className="flex flex-col items-start text-left">
          <p
            className={`font-semibold ${
              variant === "danger" ? "text-red-600" : "text-gray-900"
            }`}
          >
            {title}
          </p>
          <p className="text-gray-500">{description}</p>
        </div>
      </div>
      <i
        className={`bi bi-chevron-right text-sm text-gray-500 transition-all duration-300 ${!disabled && "group-hover:translate-x-1"} ${!disabled && (variant === "danger" ? "group-hover:text-red-600" : "group-hover:text-blue-600")}`}
      />
    </button>
  );
};

export default SettingItem;

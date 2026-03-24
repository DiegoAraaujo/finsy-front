interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  message = "Algo deu errado",
  onRetry,
}: ErrorStateProps) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-lg font-semibold text-red-600">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
};

export default ErrorState;

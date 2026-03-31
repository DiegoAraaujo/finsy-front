import Button from "./Button";

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
        <Button label="Tentar novamente" onClick={onRetry} type="button" />
      )}
    </div>
  );
};

export default ErrorState;

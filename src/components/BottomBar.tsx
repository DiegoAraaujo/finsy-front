import { Link } from "react-router-dom";

const BottomBar = () => {
  return (
    <div className="border-surface-subtle bg-background flex w-full justify-between border-t p-4">
      <Link
        to="/home"
        className="hover:bg-primary/10 hover:text-primary flex flex-col items-center rounded-2xl px-4 py-1 font-semibold"
      >
        <i className="bi bi-house" />
        <span className="text-center text-[10px] sm:text-xs">Home</span>
      </Link>
      <Link
        to="/historic"
        className="hover:bg-primary/10 hover:text-primary flex flex-col items-center rounded-2xl px-4 py-1 font-semibold"
      >
        <i className="bi bi-clock-history" />
        <span className="text-center text-[10px] sm:text-xs">Historico</span>
      </Link>

      <Link
        to="/dashboard"
        className="hover:bg-primary/10 hover:text-primary flex flex-col items-center rounded-2xl px-4 py-1 font-semibold"
      >
        <i className="bi bi-bar-chart-line" />
        <span className="text-center text-[10px] sm:text-xs">Visão Geral</span>
      </Link>
      <Link
        to="/settings"
        className="hover:bg-primary/10 hover:text-primary flex flex-col items-center rounded-2xl px-4 py-1 font-semibold"
      >
        <i className="bi bi-gear" />
        <span className="text-center text-[10px] sm:text-xs">
          Configurações
        </span>
      </Link>
    </div>
  );
};

export default BottomBar;

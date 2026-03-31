import { Link } from "react-router-dom";

const BottomBar = () => {
  return (
    <div className="flex w-full justify-between border-t border-gray-300 bg-white p-4">
      <Link
        to="/home"
        className="flex flex-col items-center rounded-2xl px-4 py-1 font-semibold hover:bg-blue-100 hover:text-blue-700"
      >
        <i className="bi bi-house" />
        <span className="text-center text-[10px] sm:text-xs">Home</span>
      </Link>
      <Link
        to="/historic"
        className="flex flex-col items-center rounded-2xl px-4 py-1 font-semibold hover:bg-blue-100 hover:text-blue-700"
      >
        <i className="bi bi-clock-history" />
        <span className="text-center text-[10px] sm:text-xs">Historico</span>
      </Link>

      <Link
        to="/"
        className="flex flex-col items-center rounded-2xl px-4 py-1 font-semibold hover:bg-blue-100 hover:text-blue-700"
      >
        <i className="bi bi-bar-chart-line" />
        <span className="text-center text-[10px] sm:text-xs">Visão Geral</span>
      </Link>
      <Link
        to="/"
        className="flex flex-col items-center rounded-2xl px-4 py-1 font-semibold hover:bg-blue-100 hover:text-blue-700"
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

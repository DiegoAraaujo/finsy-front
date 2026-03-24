import { Link } from "react-router-dom";

const BottomBar = () => {
  return (
    <div className="z-20 flex w-full justify-between border-t border-gray-300 bg-white p-4">
      <Link
        to="/home"
        className="flex flex-col items-center rounded-2xl px-4 py-1 font-semibold hover:bg-blue-100 hover:text-blue-700"
      >
        <i className="bi bi-house text-lg" />
        <span className="text-xs sm:text-sm">Home</span>
      </Link>
      <Link
        to="/"
        className="flex flex-col items-center rounded-2xl px-4 py-1 font-semibold hover:bg-blue-100 hover:text-blue-700"
      >
        <i className="bi bi-clock-history text-lg" />
        <span className="text-xs sm:text-sm">Historico</span>
      </Link>

      <Link
        to="/"
        className="flex flex-col items-center rounded-2xl px-4 py-1 font-semibold hover:bg-blue-100 hover:text-blue-700"
      >
        <i className="bi bi-bar-chart-line text-lg" />
        <span className="text-xs sm:text-sm">Visão Geral</span>
      </Link>
      <Link
        to="/"
        className="flex flex-col items-center rounded-2xl px-4 py-1 font-semibold hover:bg-blue-100 hover:text-blue-700"
      >
        <i className="bi bi-gear text-lg" />
        <span className="text-xs sm:text-sm">Configurações</span>
      </Link>
    </div>
  );
};

export default BottomBar;

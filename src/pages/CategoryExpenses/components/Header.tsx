import { Link } from "react-router-dom";

interface HeaderProps {
  categoryName: string;
  status: string;
}

const Header = ({ categoryName, status }: HeaderProps) => {
  return (
    <header className="relative z-10 flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="group cursor pointer flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-gray-800"
        >
          <i className="bi bi-arrow-left text-gray-400 transition-transform duration-300 group-hover:-translate-x-0.5" />
        </Link>
        <span>
          <p className="text-xl font-bold text-white">{categoryName}</p>
          <p className="text-sm font-bold text-gray-400">
            Detalhes da Categoria
          </p>
        </span>
      </div>
      <div
        className={`${true ? "rounded-lg border border-red-600 bg-red-600/20 text-red-600" : "text-green-600"} px-4 py-1 text-xs font-bold`}
      >
        {status}
      </div>
    </header>
  );
};

export default Header;

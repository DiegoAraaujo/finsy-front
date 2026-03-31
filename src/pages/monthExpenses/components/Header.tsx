import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="relative z-10 flex items-center gap-4 p-4">
      <Link
        to="/historic"
        className="cursor-pointer transition-transform duration-300 hover:-translate-x-0.5"
      >
        <i className="bi bi-arrow-left text-xl text-gray-400" />
      </Link>
      <span>
        <p className="text-sm font-bold ">Detalhes do mês</p>
      </span>
    </header>
  );
};

export default Header;

import { Link } from "react-router-dom";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="relative z-10 flex items-center gap-4 p-4">
      <Link to="/historic" className="group cursor cursor-pointer">
        <i className="bi bi-arrow-left text-xl text-gray-400 transition-transform duration-300 group-hover:-translate-x-0.5" />
      </Link>
      <span>
        <p className="text-xl font-bold">{title}</p>
        <p className="text-sm font-bold text-gray-400">Detalhes do mês</p>
      </span>
    </header>
  );
};

export default Header;

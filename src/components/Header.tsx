import { Link } from "react-router-dom";

interface HeaderProps {
  title: string;
  subtitle?: string;
  backTo: string;
}

const Header = ({ title, subtitle, backTo }: HeaderProps) => {
  return (
    <header className="relative z-10 flex items-center gap-4 p-4">
      <Link
        to={`/${backTo}`}
        className="cursor-pointer transition-transform duration-300 hover:-translate-x-0.5"
      >
        <i className="bi bi-arrow-left text-xl text-gray-400" />
      </Link>
      <span>
        <p className="text-xl font-bold">{title}</p>
        {subtitle && (
          <p className="text-sm font-bold text-gray-400">{subtitle}</p>
        )}
      </span>
    </header>
  );
};

export default Header;

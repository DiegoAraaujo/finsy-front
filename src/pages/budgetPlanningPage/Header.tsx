import { Link } from "react-router-dom";

interface HeaderProps {
  title: string;
}
const Header = ({ title }: HeaderProps) => {
  return (
    <header className="relative z-10 flex items-center gap-4 p-4">
      <Link
        to="/"
        className="group cursor pointer flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-gray-800"
      >
        <i className="bi bi-arrow-left text-gray-400 transition-transform duration-300 group-hover:-translate-x-0.5" />
      </Link>
      <p className="text-xl font-bold text-white">{title}</p>
    </header>
  );
};
export default Header;

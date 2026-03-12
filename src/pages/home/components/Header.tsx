const Header = () => {
  return (
    <div className="relative z-10 flex justify-between p-4">
      <div>
        <p className="text-sm text-gray-400">Fevereiro de 2026</p>
        <p className="font-bold">Olá, Diego Araújo! 👋</p>
      </div>

      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-blue-300 bg-blue-700 text-white">
        <p>DA</p>
      </div>
    </div>
  );
};

export default Header;

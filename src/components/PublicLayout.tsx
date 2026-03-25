import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <main className="relative m-auto flex h-dvh w-full max-w-2xl flex-col overflow-x-hidden p-8">
      <Outlet />
    </main>
  );
};

export default PublicLayout;

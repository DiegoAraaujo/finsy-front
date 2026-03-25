import {  Outlet } from "react-router-dom";
import PageHeaderBackground from "./PageHeaderBackground";
import Header from "./Header";
import BottomBar from "./BottomBar";

const AppLayout = () => {
 
  return (
    <main className="relative m-auto flex h-dvh w-full max-w-2xl flex-col overflow-x-hidden">
      <PageHeaderBackground />
      <Header />
      <div className="no-scrollbar relative z-20 h-full flex-1 overflow-y-auto p-4">
        <Outlet />
      </div>
      <BottomBar />
    </main>
  );
};

export default AppLayout;

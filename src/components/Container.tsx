import BottomBar from "./BottomBar";
import Header from "./Header";
import PageHeaderBackground from "./PageHeaderBackground";

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <main className="relative m-auto flex h-dvh w-full max-w-2xl flex-col overflow-x-hidden">
      <PageHeaderBackground />
      <Header />
      <div className="no-scrollbar relative z-20 h-full flex-1 overflow-y-auto p-4">
        {children}
      </div>
      <BottomBar />
    </main>
  );
};

export default Container;

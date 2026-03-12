import PageHeaderBackground from "./PageHeaderBackground";

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <main className="relative m-auto h-dvh min-h-dvh w-full max-w-2xl overflow-y-auto overflow-hidden p-4">
      <PageHeaderBackground />
      <div className="relative z-20 h-full">{children}</div>
    </main>
  );
};

export default Container;

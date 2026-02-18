interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <main className="relative m-auto h-dvh min-h-dvh w-full max-w-2xl overflow-y-auto">
      {children}
    </main>
  );
};

export default Container;

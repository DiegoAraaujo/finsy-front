const PageHeaderBackground = () => {
  return (
    <div
      className="absolute top-0 left-0 z-0 h-full w-full max-w-2xl bg-gray-900"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 82%, 0 100%)",
      }}
    />
  );
};

export default PageHeaderBackground;

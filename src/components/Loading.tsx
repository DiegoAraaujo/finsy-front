import LoadingImage from "../assets/loadingImage.png";
const Loading = () => {
  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <img
        src={LoadingImage}
        alt="carregando"
        className="aspect-square w-48 animate-pulse md:w-62"
      />
      <p className="text-gray-500">
        Carregando <span className="loading"></span>
      </p>
    </div>
  );
};

export default Loading;

import KuboIcon from "../../assets/icons/Universal/KuboIcon.png";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] dark:bg-[rgba(0,0,0,0.85)] flex justify-center items-center z-[1000]">
      <div className="flex flex-col items-center gap-2">
        <img
          src={KuboIcon}
          alt="Carregando"
          className="w-32 h-32 md:w-50 md:h-50 animate-fade"
        />
        <p className="text-white text-xl font-medium">
          Carregando...
        </p>
      </div>
    </div>
  );
};

export default Loading;
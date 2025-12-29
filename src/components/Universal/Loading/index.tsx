import KuboIcon from "../../../assets/icons/Universal/kubo-main-icon-white.svg";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-[1000]">
      <div className="flex flex-col items-center gap-[20px]">
        <img
          src={KuboIcon}
          alt="Carregando"
          className="w-[80px] h-[80px] animate-fade"
        />
        <p className="text-white text-[1.2rem] font-medium mt-[10px]">
          Carregando...
        </p>
      </div>
    </div>
  );
};

export default Loading;
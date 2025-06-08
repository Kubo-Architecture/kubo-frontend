import KuboIcon from "../../../assets/icons/Universal/kubo-main-icon.svg";

export default function Logocontainer() {
  return (
    <div className="pt-5 flex items-center relative justify-center">
      <a href="/" className="flex items-center gap-1">
        <img src={KuboIcon} alt="Ícone da Kubo" className="w-8 h-8" />
        <h1 className="text-2xl font-montserrat font-normal pt-1">Kubo</h1>
      </a>
    </div>
  );
}

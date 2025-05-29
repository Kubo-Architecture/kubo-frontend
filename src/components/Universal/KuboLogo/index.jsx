import KuboIcon from "../../../assets/icons/Universal/kubo-main-icon.svg";

export default function Logocontainer() {
  return (
    <div className="flex items-center">
      <a href="/" className="flex items-center gap-2">
        <img src={KuboIcon} alt="Ícone da Kubo" className="w-8 h-8" />
        <h1 className="text-xl font-semibold">Kubo</h1>
      </a>
    </div>
  );
}

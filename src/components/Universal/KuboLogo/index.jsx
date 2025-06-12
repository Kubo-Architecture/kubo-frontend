import KuboIcon from "../../../assets/icons/Universal/kubo-main-icon.svg";

export default function Logocontainer() {
  return (
    <div className="flex items-center relative justify-center">
      <a href="/" className="flex items-center gap-1">
        <img src={KuboIcon} alt="Ícone da Kubo" className="
        w-8 h-8 
        xl:h-8
        
        " />
        <h1 className="text-2xl font-montserrat font-normal pt-1 hidden
       md:block
       md:text-xl
       xl:text-2xl
       ">Kubo</h1>   
      </a>
    </div>
  );
}

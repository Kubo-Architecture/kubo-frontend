import { useState } from "react";
import HamburgerIcon from "../../../assets/icons/Universal/HamburguerIcon.svg";

export default function HamburgerHeader() {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    // Só aparece em telas menores que 768px
    <div className="md:hidden font-montserrat">
      {/* Botão de menu */}
      <div className="relative">
        <button
          className="bg-none border-none p-2 cursor-pointer z-[1001] relative left-[15%]"
          onClick={toggleMenu}
        >
          <img
            src={HamburgerIcon}
            alt="Menu"
            className="w-[45px] h-[45px] filter brightness-0 saturate-100"
          />
        </button>
      </div>

      {/* Menu lateral */}
      <div
        className={`fixed top-[11%] w-[185px] h-full bg-[#4a4a4a] pt-[60px] transition-left duration-400 z-[1000] ${
          menuAberto ? "left-0" : "-left-[250px]"
        }`}
      >
        <ul className="list-none font-extralight text-white">
          <li className="px-6 py-4 text-xl cursor-pointer hover:bg-[#c4c4c4]">
            <a href="#home" className="text-white no-underline">Home</a>
          </li>
          <li className="px-6 py-4 text-xl cursor-pointer hover:bg-[#c4c4c4]">
            <a href="#sobre" className="text-white no-underline">Sobre nós</a>
          </li>
          <li className="px-6 py-4 text-xl cursor-pointer hover:bg-[#c4c4c4]">
            <a href="#novidades" className="text-white no-underline">Novidades</a>
          </li>
          <li className="px-6 py-4 text-xl cursor-pointer hover:bg-[#c4c4c4]">
            <a href="#contato" className="text-white no-underline">Contate-nos</a>
          </li>
          <li className="px-6 py-4 text-xl cursor-pointer hover:bg-[#c4c4c4]">
            <a href="#ajuda" className="text-white no-underline">Ajuda</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

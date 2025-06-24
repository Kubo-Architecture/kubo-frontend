import React, { useState } from "react";
import MenuLogo from "../../../assets/icons/Universal/HamburguerIcon.svg";
import KuboLogo from "../../../components/Universal/KuboLogo";
import HeartIcon from "../../../assets/icons/Universal/heart-sw.svg";
import ProfileIcon from "../../../assets/icons/Universal/defaultUserPhoto.svg";
import SettingsIcon from "../../../assets/icons/Universal/settings-sw.svg";
//import BookmarkIcon from "../../../assets/icons/Universal/bookmark.svg"

export default function IconWithPanel(props) {
  const [open, setOpen] = useState(false);

  const togglePanel = () => {
    setOpen(!open);
  };

  const menuItems = ["Home", "Galeria", "Planos e upgrades"];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-row justify-between items-center h-20 min-w-[300px] px-[20px] bg-white shadow-md">
      {/* Esquerda */}
      <div className="flex-1 h-full flex items-center min-w-[100px]">
        {/* Botão do menu (visível apenas em telas pequenas) */}
        <div onClick={togglePanel} className="block md:hidden">
          <img
            src={MenuLogo}
            alt="Menu icon"
            className="hover:scale-[1.1] transition-all ease-in-out duration-100 cursor-pointer h-10 w-10"
          />
        </div>

        {/* Links inline (visíveis apenas em telas md ou maiores) */}
        <div className="hidden md:flex items-center gap-6 ml-2 black">
          {menuItems.map((item) => (
            <span
              key={item}
              className="cursor-pointer text-[18px] transition-transform hover:translate-x-1 font-normal"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Centro */}
      <div className="flex-1 h-full flex justify-center items-center min-w-[100px]">
        <KuboLogo />
      </div>

      {/* Direita */}
      <div className="flex-1 h-full">
        <div className="flex flex-row gap-2 h-full w-full justify-end min-w-[120px]">
          <div className="flex items-center justify-center">
            <img src={HeartIcon} alt="Heart icon" className="h-7" />
            {/* <img src={BookmarkIcon} alt="Bookmark Icon" className="h-[30px]" /> */}
          </div>
          <div className="flex items-center justify-center">
            <img src={SettingsIcon} alt="Settings icon" className="h-7" />
          </div>
          <div className="flex items-center justify-center">
            <a href="">
              <div
                className="h-[35px] w-[35px] filter-none rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${props.photoUrl ? props.photoUrl : ProfileIcon})`,
                }}
              ></div>
            </a>
          </div>
        </div>
      </div>

      {/* Painel lateral: visível apenas em telas menores que md. */}
      <div
        className={`fixed top-20 left-0 z-[1000] h-[calc(100vh-80px)] w-[200px] bg-[#4A4A4A] rounded-tr-[10px] transition-transform ease-in-out duration-300 px-4 flex flex-col text-white md:hidden
          ${open ? "translate-x-0 shadow-[2px_0_5px_rgba(0,0,0,0.2)]" : "-translate-x-full shadow-none"}
        `}
      >
        {menuItems.map((item) => (
          <div
            key={item}
            className="h-[55px] flex flex-col justify-center items-start transition-transform hover:translate-x-1 cursor-pointer"
          >
            <p className="text-[18px] font-light">{item}</p>
          </div>
        ))}
      </div>
    </header>
  );
}

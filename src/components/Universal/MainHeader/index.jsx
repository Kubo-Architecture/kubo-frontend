import React, { useState } from "react";
import MenuLogo from "../../../assets/icons/Universal/HamburguerIcon.svg";
import KuboLogo from "../../../components/Universal/KuboLogo";
import HeartIcon from "../../../assets/icons/Universal/emptyheart.svg";
import ProfileIcon from "../../../assets/icons/Universal/defaultUserPhoto.svg";
import SettingsIcon from "../../../assets/icons/Universal/settingsbasic.svg";

export default function IconWithPanel() {
  const [open, setOpen] = useState(false);

  const togglePanel = () => {
    setOpen(!open);
  };

  return (
    <header className="flex flex-row justify-between items-center h-20 relative min-w-[300px]">
            
      <div className="flex-1 h-full w-full flex justify-start items-center min-w-[100px]">
          <div onClick={togglePanel}>
            <img
              src={MenuLogo}
              alt="Menu icon"
              className="hover:scale-[1.1] transition-all ease-in-out duration-100 cursor-pointer h-10 w-10"
            />
          </div>
      </div>
      <div className="flex-1 h-full flex justify-center align-center min-w-[100px]">
          <KuboLogo />
      </div>
      <div className="flex-1 h-full">
          <div className="flex flex-row gap-1 h-full w-full justify-end min-w-[120px]">
            <div className="flex items-center justify-center">
              <img src={HeartIcon} alt="Heart icon" className="h-[30px]" />
            </div>
            <div className="flex items-center justify-center">
              <img src={SettingsIcon} alt="Settings icon" className="h-[40px]" />
            </div>
            <div className="flex items-center justify-center">
              <img src={ProfileIcon} alt="Profile icon" className="h-[50px] filter-none" />
          </div>
        </div>
      </div>
      

      <div
        className={`fixed top-20 left-0 z-[1000] h-[calc(100vh-80px)] w-[200px] bg-[#4A4A4A] rounded-tr-[10px] transition-transform ease-in-out duration-300 px-4 shadow-[2px_0_5px_rgba(0,0,0,0.2)] flex flex-col text-white ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-[55px] flex flex-col justify-center items-start transition-transform hover:translate-x-1">
          <p className="text-[18px] font-light">Home</p>
        </div>
        <div className="h-[55px] flex flex-col justify-center items-start transition-transform hover:translate-x-1">
          <p className="text-[18px] font-light">Galeria</p>
        </div>
        <div className="h-[55px] flex flex-col justify-center items-start transition-transform hover:translate-x-1">
          <p className="text-[18px] font-light">Planos e upgrades</p>
        </div>
      </div>
    </header>
  );
}

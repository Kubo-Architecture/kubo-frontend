import React, { useState } from "react";
import "./styles.css";
import MenuLogo from "../../../assets/icons/Universal/HamburguerIcon.svg";
import KuboLogo from "../../../components/Universal/KuboLogo"
import HeartIcon from "../../../assets/icons/Universal/emptyheart.svg"
import ProfileIcon from "../../../assets/icons/Universal/defaultUserPhoto.svg"
import SettingsIcon from "../../../assets/icons/Universal/settingsbasic.svg"

export default function IconWithPanel() {
  const [open, setOpen] = useState(false);

  const togglePanel = () => {
    setOpen(!open);
  };

  return (
    <header>
      <div className="icon-button" onClick={togglePanel}>
        <img src={MenuLogo} alt="Menu icon" className="menu-icon" />
      </div>

      <div className={`side-panel ${open ? "open" : ""}`}>
        <div className="item">
          <p>Home</p>
        </div>
        <div className="item">
          <p>Galeria</p>
        </div>
        <div className="item">
          <p>Planos e upgrades</p>
        </div>
      </div>
      <KuboLogo/>
      <div className="nav-bar">
      <div className="icon-button">
        <img src={HeartIcon} alt="Menu-icon" id="heart-icon" className="menu-icon"/>
      </div>
      <div className="icon-button">
        <img src={SettingsIcon} alt="Menu-icon" id="settings-icon" className="menu-icon"/>
      </div>
      <div className="icon-button">
        <img src={ProfileIcon} alt="Menu-icon" id="profile-icon" className="menu-icon"/>
      </div>
      </div>
    </header>
  );
}
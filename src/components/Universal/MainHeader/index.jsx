import React, { useState } from "react";
import "./styles.css";
import MenuLogo from "../../../assets/icons/Universal/HamburguerIcon.svg";

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
    </header>
  );
}
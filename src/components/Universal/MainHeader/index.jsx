import React, { useState } from "react";
import "./styles.css";
import MenuLogo from "../../../assets/icons/Universal/HamburguerIcon.svg"

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

      {open && (
        <div className="side-panel">
            <div className="item">
                <p>Geral</p>
            </div>
            <div className="item">
                <p>Conta</p>
            </div>
            <div className="item">
                <p>Planos e upgrades</p>
            </div>
            <div className="item">
                <p>Inteface</p>
            </div>
            <div className="item">
                <p>Privacidade</p>
            </div>
        </div>
        
      )}
    </header>
  );
}

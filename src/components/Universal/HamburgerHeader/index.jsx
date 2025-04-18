import { useState } from "react";
import "./styles.css";
import HamburgerIcon from "../../../assets/icons/Universal/HamburguerIcon.svg";

export default function HamburgerHeader() {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <>
      <div className="header-container">
        <button className="menu-button" onClick={toggleMenu}>
          <img src={HamburgerIcon} alt="Menu" className="menu-icon" />
        </button>
      </div>

      <div className={`menu-sidebar ${menuAberto ? "ativo" : ""}`}>
        <ul className="menu-list">
          <li><a href="#home">Home</a></li>
          <li><a href="#sobre">Sobre nós</a></li>
          <li><a href="#novidades">Novidades</a></li>
          <li><a href="#contato">Contate-nos</a></li>
          <li><a href="#ajuda">Ajuda</a></li>
        </ul>
      </div>
        <nav class="nav-links">
            <a href="#home"><b>Home</b></a>
            <a href="#sobre-nos"><b>Sobre nós</b></a>
            <a href="#novidades"><b>Novidades</b></a>
        </nav>
    </>
  );
}

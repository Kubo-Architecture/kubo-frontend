import { useState } from "react";
import "./styles.css";
import HamburgerIcon from "../../../assets/icons/Universal/HamburguerIcon.svg";

export default function HamburgerHeader() {
    const [menuAberto, setMenuAberto] = useState(false);

    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };

    return (
        <div className="header-container">
            <button className="menu-button" onClick={toggleMenu}>
                <img src={HamburgerIcon} alt="Menu" className="menu-icon" />
            </button>

            <div className={`menu-sidebar ${menuAberto ? "ativo" : ""}`}>
                <ul className="menu-list">
                    <li><a href="#home"><strong>Home</strong></a></li>
                    <li><a href="#sobre"><strong>Sobre nós</strong></a></li>
                    <li><a href="#novidades"><strong>Novidades</strong></a></li>
                    <li><a href="#contato"><strong>Contate-nos</strong></a></li>
                    <li><a href="#ajuda"><strong>Ajuda</strong></a></li>
                </ul>
            </div>
        </div>
    );
}

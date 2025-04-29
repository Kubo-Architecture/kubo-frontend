import Logocontainer from "../KuboLogo"
import KuboIcon from "../assets/kubo-icon.png";

export function SimpleHeader(){
    return(
        <header>
            <Logocontainer/>
            <div className="icon-container">
                <a href="/">
                    <img src={KuboIcon} alt="Kubo icon" className="kubo-icon" />
                </a>
            </div>
            <h1>Kubo</h1>
        </header>
    )
}

import "./styles.css"
import KuboIcon from "../../../assets/icons/Universal/kubo-main-icon.svg"

export function SimpleHeader(){
    return(
        <header>
            <div className="icon-container">
                <a href="/">
                    <img src={KuboIcon} alt="Kubo icon" className="kubo-icon" />
                </a>
            </div>
            <h1>Kubo</h1>
        </header>
    )
}
import "./styles.css"
import KuboIcon from "../../../assets/icons/Universal/kubo-main-icon.svg"

export function SimpleHeader(){
    return(
        <header>
            <div className="icon-container">
                <img src={KuboIcon} alt="Kubo icon" className="kubo-icon" />
            </div>
            <h1>KUBO</h1>
        </header>
    )
}
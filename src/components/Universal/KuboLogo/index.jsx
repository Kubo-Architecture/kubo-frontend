import './styles.css';
import KuboIcon from "../../../assets/icons/Universal/kubo-main-icon.svg"


export default function Logocontainer(){
    return(

          <div>
             <img src={KuboIcon} alt="Kubo icon" className="kubo-icon" />
             <h1>Kubo</h1>
          </div>
    )
}
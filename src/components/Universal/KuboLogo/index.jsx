import './styles.css';
import KuboIcon from "../../../assets/icons/Universal/kubo-main-icon.svg"


export default function Logocontainer(){
    return(
          <div className='logo-header'>
            <a href="/"> <img src={KuboIcon} alt="Kubo icon" className="kubo-icon" /></a>
             <h1 className='kubo-title'>Kubo</h1>
          </div>
    )
}
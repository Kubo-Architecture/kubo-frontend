import "./styles.css"
import Logocontainer from "../../Universal/KuboLogo"
import HamburgerHeader from "../../Universal/HamburgerHeader";


export default function HomeHeader(){
    return(
        <header>   
                <HamburgerHeader/>
                <Logocontainer/>
                <a href="" className="btn-entrar"><strong>Entrar</strong></a>
         </header>
    )
}
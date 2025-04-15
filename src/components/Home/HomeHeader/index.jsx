import "./styles.css"
import Logocontainer from "../../Universal/KuboLogo"
import HamburgerHeader from "../../Universal/HamburgerHeader";


export default function HomeHeader(){
    return(
        <header>   
                <HamburgerHeader/>
                <Logocontainer/>
                <a href="login" className="btn-entrar"><b>Entrar</b></a>
                
         </header>
    )
}
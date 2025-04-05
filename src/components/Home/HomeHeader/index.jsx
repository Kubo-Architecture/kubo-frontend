import "./styles.css"
import Logocontainer from "../../Universal/KuboLogo"

export default function HomeHeader(){
    return(
            <header>
                <div className="ancora-header">
                    <a href="">Home</a>
                    <a href="">Sobre nos</a>
                    <a href="">Novidades</a>
                </div>
                <Logocontainer/>

                <a href=""><b>Entrar</b></a>


            </header>
            
    
    )
}
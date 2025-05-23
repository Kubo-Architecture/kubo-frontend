import Logocontainer from "../../Universal/KuboLogo"
import HamburgerHeader from "../../Universal/HamburgerHeader/index";

export default function HomeHeader() {
  return (
    <header>
      <div className="flex items-center justify-between md:px-20 px-4 h-20 text-xl ">
        <HamburgerHeader/>
        <div className="not-sm:hidden">
          
          <nav>
            <ul className="flex gap-10"> 
              <li>
                <a href="/" className="">Home</a>{/** tem que ficar preto,na pagina que eu estou navegando */}
              </li>
              <li>
                <a href="#" className="">Sobre nós</a>
              </li>
              <li>
                <a href="#" className="">Novidades</a>
              </li>
            </ul>
          </nav>
        </div>
        <Logocontainer/>
        <a href="login" className="">Entrar</a>
      </div>
    </header>
  );
}

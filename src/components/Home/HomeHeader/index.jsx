import Logocontainer from "../../Universal/KuboLogo"
import HamburgerHeader from "../../Home/HamburgerHeader/index";

export default function HomeHeader() {
  return (
    <header>
      <div className="flex items-center justify-between px-20 h-20 text-xl">
        <HamburgerHeader/>
        <div className="not-sm:hidden">
          
          <nav>
            <ul className="flex gap-10"> 
              <li>
                <a href="/" className="">Home</a>
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
        <a href="login" className="font-bold">Entrar</a>
      </div>
    </header>
  );
}

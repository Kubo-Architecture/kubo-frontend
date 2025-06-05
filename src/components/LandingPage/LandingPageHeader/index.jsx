import Logocontainer from "../../Universal/KuboLogo";
import HamburgerHeader from "../../Universal/HamburgerHeader/index";

export default function LandingPageHeader() {
  return (
    <header>
      <div className="flex items-center justify-between md:px-20 px-4 h-20 text-xl font-montserrat font-normal">
        <div className="block md:hidden">
          <HamburgerHeader />
        </div>

        <div className="hidden md:block">
          <nav>
            <ul className="flex gap-10 font-normal">
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

        <Logocontainer />

        <a href="login" className="">Entrar</a>
      </div>
    </header>
  );
}

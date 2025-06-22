import Logocontainer from "../../Universal/KuboLogo";
import HamburgerHeader from "../../Universal/HamburgerHeader/index";

export default function LandingPageHeader() {
  return (
    <header>
      <div className="flex items-center justify-between scroll-smooth min-w-[424px]
      px-4 h-20 text-xl font-montserrat font-normal w-full
      md:px-20
       ">
        <div className="block md:hidden">
          <HamburgerHeader />
        </div>

        <div className="hidden md:flex md:flex-1">
          <nav>
            <ul className="flex gap-10 lg:gap-12 2xl:text-xl font-normal">
              <li>
                <a href="/" className="">Home</a>
              </li>
              <li>
                <a href="#sobre nos" className="">Sobre nós</a>
              </li>
              <li>
                <a href="#novidades" className="">Novidades</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="md:flex md:flex-1 justify-center">
          <Logocontainer/>
        </div>

        <div className="md:flex md:flex-1 justify-end">
          <a href="login" className="
        text-xl
        ">Entrar</a>
        </div>
      </div>
    </header>
  );
}

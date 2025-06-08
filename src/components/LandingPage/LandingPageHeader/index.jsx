import Logocontainer from "../../Universal/KuboLogo";
import HamburgerHeader from "../../Universal/HamburgerHeader/index";

export default function LandingPageHeader() {
  return (
    <header>
      <div className="flex items-center justify-between md:px-20 2xl:py-15 px-4 h-20 text-xl 2xl:text-4xl font-montserrat font-normal min-w-[422px] md:min-w-[959px]">
        <div className="block md:hidden">
          <HamburgerHeader />
        </div>

        <div className="hidden md:block">
          <nav>
            <ul className="flex gap-10 2xl:gap-15 font-normal">
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

        <a href="login" className="2xl:text-4xl">Entrar</a>
      </div>
    </header>
  );
}

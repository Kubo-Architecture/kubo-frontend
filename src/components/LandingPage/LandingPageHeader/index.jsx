import { useEffect } from "react";
import Logocontainer from "../../Universal/KuboLogo";
import HamburgerHeader from "../../Universal/HamburgerHeader/index";

export default function LandingPageHeader() {
  useEffect(() => {
    // Função para lidar com o clique suave nas âncoras
    const handleSmoothScroll = (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Calcula a posição para centralizar o elemento
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - (window.innerHeight / 2) + (targetElement.offsetHeight / 2);

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    };

    // Adiciona os event listeners aos links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener("click", handleSmoothScroll);
    });

    // Limpa os event listeners quando o componente desmontar
    return () => {
      links.forEach(link => {
        link.removeEventListener("click", handleSmoothScroll);
      });
    };
  }, []);

  return (
    <header>
      <div className="flex items-center justify-between scroll-smooth 
      px-4 h-20 text-xl font-montserrat font-normal w-full
      md:px-20 not-sm:px-10
       ">
        {/* <div className="block sm:hidden">
          <HamburgerHeader />
        </div> */}

        <div className="hidden md:flex md:flex-1">
          <nav>
            <ul className="flex gap-10 lg:gap-12 2xl:text-xl font-normal ">
              <li className="transform hover:translate-x-2 duration-500">
                <a href="#sobre nos">Sobre nós</a>
              </li>
              <li className="transform hover:translate-x-2 duration-500">
                <a href="#novidades">Novidades</a>
              </li>
              <li className="transform hover:translate-x-2 duration-500">
                <a href="#projetos" >Projetos</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="md:flex md:flex-1 justify-center">
          <Logocontainer />
        </div>

        <div className="md:flex md:flex-1 justify-end ">
          <a href="login" className="text-xl transform hover:translate-x-2 duration-500">Entrar</a>
        </div>
      </div>
    </header>
  );
}
import { useEffect, useState, useRef } from "react";
import KuboIcon from "../assets/icons/Universal/kubo.png";
import KuboIconWhite from "../assets/icons/Universal/KuboIcon.png";
import Capalanding2 from "../assets/capalanding.png";
import Capalanding from "../assets/capa2.png";

function LandingPageHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleSmoothScroll = (e: any) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 80;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        setMobileMenuOpen(false);
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener("click", handleSmoothScroll);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener("click", handleSmoothScroll);
      });
    };
  }, []);

  return (
    <header className="select-none fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Hamburger menu button - Left (mobile only) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative w-10 h-8 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative transform transition-all duration-300">
              <span
                className={`absolute left-0 h-0.5 w-full bg-gray-900 transform transition-all duration-300 ${
                  mobileMenuOpen ? 'rotate-45 top-2' : 'top-0'
                }`}
              ></span>
              <span
                className={`absolute left-0 h-0.5 w-full bg-gray-900 top-2 transform transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              ></span>
              <span
                className={`absolute left-0 h-0.5 w-full bg-gray-900 transform transition-all duration-300 ${
                  mobileMenuOpen ? '-rotate-45 top-2' : 'top-4'
                }`}
              ></span>
            </div>
          </button>

          {/* Desktop Navigation - Left (md+) */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="#sobre" className="text-base lg:text-lg font-medium text-gray-600 hover:text-black duration-200 hover:translate-x-1">
              Sobre
            </a>
            <a href="#funcionalidades" className="text-base lg:text-lg font-medium text-gray-600 hover:text-black duration-200 hover:translate-x-1">
              Funcionalidades
            </a>
            <a href="#novidades" className="text-base lg:text-lg font-medium text-gray-600 hover:text-black duration-200 hover:translate-x-1">
              Novidades
            </a>
            <a href="#contato" className="text-base lg:text-lg font-medium text-gray-600 hover:text-black duration-200 hover:translate-x-1">
              Contato
            </a>
          </nav>

          {/* Logo - Center (all screens) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <img
              src={KuboIcon}
              alt="Kubo Icon"
              draggable={false}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
          </div>

          {/* Login - Right (all screens) */}
          <a
            href="/login"
            className="text-base lg:text-lg font-medium text-gray-900 hover:text-black transition-colors"
          >
            Entrar
          </a>
        </div>

        {/* Mobile Navigation - Shows only on mobile when menu is open */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-3 border-t border-gray-100">
            <a href="#sobre" className="block py-2 text-base font-medium text-gray-600 hover:text-black transition-colors">
              Sobre
            </a>
            <a href="#funcionalidades" className="block py-2 text-base font-medium text-gray-600 hover:text-black transition-colors">
              Funcionalidades
            </a>
            <a href="#novidades" className="block py-2 text-base font-medium text-gray-600 hover:text-black transition-colors">
              Novidades
            </a>
            <a href="#contato" className="block py-2 text-base font-medium text-gray-600 hover:text-black transition-colors">
              Contato
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="select-none relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-16">
      {/* Background com grid pattern sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-black/[0.02] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-black/[0.02] rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      {/* Badge v1.0 */}
      <div className="absolute top-20 sm:top-6 right-4 sm:right-6 z-20 pointer-events-none">
        <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black text-white rounded-full text-xs sm:text-sm font-bold shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span>v1.0 Disponível</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16 lg:py-0 relative z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* Coluna esquerda - Conteúdo */}
          <div className="space-y-6 sm:space-y-8">
            {/* Título */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-gray-900 leading-none tracking-tighter">
                KUBO
              </h1>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                O maior banco de dados
                <br />
                <span className="relative inline-block">
                  de arquitetura do país
                  <div className="absolute bottom-0.5 sm:bottom-1 left-0 right-0 h-2 sm:h-3 bg-black/10 -z-10 -rotate-1"></div>
                </span>
              </h2>
            </div>

            {/* Descrição */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
              Plataforma acadêmica para estudantes e professores. 
              <span className="text-gray-900 font-semibold"> Explore, compartilhe e cresça</span> com a comunidade de arquitetura.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a href="/login" className="group px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-full font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer">         
                <span>Começar gratuitamente</span>
                <i className="fas fa-arrow-right transition-transform group-hover:translate-x-1"></i>
              </a>
              
              <a href="#sobre" className="group px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-black text-black rounded-full font-bold text-sm sm:text-base transition-all duration-300 hover:bg-black hover:text-white flex items-center justify-center space-x-2 cursor-pointer">
                <span>Ver demonstração</span>
                <i className="fas fa-play-circle"></i>
              </a>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-2 sm:pt-4">
              <div className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-full">
                <i className="fas fa-graduation-cap text-black text-sm"></i>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">Para estudantes</span>
              </div>
              
              <div className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-full">
                <i className="fas fa-chalkboard-teacher text-black text-sm"></i>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">Para professores</span>
              </div>
              
              <div className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black text-white rounded-full">
                <i className="fas fa-star text-white text-sm"></i>
                <span className="text-xs sm:text-sm font-semibold">100% Gratuito</span>
              </div>
            </div>
          </div>

          {/* Coluna direita - Stats Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mt-8 lg:mt-0">
            {/* Card 1 */}
            <div className="group bg-white border-2 border-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <i className="fas fa-database text-white text-lg sm:text-xl"></i>
              </div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">1000+</p>
              <p className="text-xs lg:text-sm font-bold text-gray-600 uppercase tracking-wider mt-1 sm:mt-2">Projetos</p>
            </div>

            {/* Card 2 */}
            <div className="group bg-white border-2 border-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 mt-4 sm:mt-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <i className="fas fa-network-wired text-white text-lg sm:text-xl"></i>
              </div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">24/7</p>
              <p className="text-xs lg:text-sm font-bold text-gray-600 uppercase tracking-wider mt-1 sm:mt-2">V2 Disponível</p>
            </div>

            {/* Card 3 - Full width */}
            <div className="col-span-2 group bg-black text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-black">100%</p>
                  <p className="text-xs lg:text-sm font-bold text-white/80 uppercase tracking-wider mt-1 sm:mt-2">Gratuito Sempre</p>
                </div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center">
                  <i className="fas fa-infinity text-black text-xl sm:text-2xl"></i>
                </div>
              </div>
            </div>

            {/* Features badges */}
            <div className="col-span-2 flex flex-wrap gap-1.5 sm:gap-2">
              {[
                { icon: 'fa-search', text: 'Busca' },
                { icon: 'fa-heart', text: 'Favoritos' },
                { icon: 'fa-user', text: 'Perfis' },
                { icon: 'fa-images', text: 'Galeria' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-full text-xs font-semibold hover:border-black transition-all">
                  <i className={`fas ${feature.icon} text-black text-xs`}></i>
                  <span className="text-gray-900">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-none hidden sm:block">
        <a href="#sobre" className="flex flex-col items-center space-y-1 text-gray-400 hover:text-black transition-colors pointer-events-auto">
          <span className="text-xs font-bold uppercase tracking-wider">Scroll</span>
          <i className="fas fa-chevron-down text-sm"></i>
        </a>
      </div>
    </section>
  );
}

function StatsBanner() {
  return (
    <div className="select-none bg-black py-6 sm:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center">
          <span className="text-3xl sm:text-4xl font-bold text-white">1000+</span>
          <span className="text-lg sm:text-xl lg:text-2xl text-gray-300 font-light">projetos arquitetônicos catalogados</span>
        </div>
      </div>
    </div>
  );
}

function SobreSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(1); 
  const images = [Capalanding2, Capalanding];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="sobre" className="select-none py-16 sm:py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <span className="text-xs sm:text-sm font-semibold text-black tracking-wider uppercase">Sobre o Kubo</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Arquitetura e <span className="text-black">tecnologia</span> unidas
              </h2>
            </div>

            <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-600 leading-relaxed">
              <p>
                O <span className="font-semibold text-gray-900">Kubo</span> é uma aplicação web criada para centralizar e organizar projetos arquitetônicos em um ambiente digital voltado para o meio acadêmico.
              </p>

              <p>
                A plataforma permite que estudantes e professores encontrem, publiquem e analisem obras arquitetônicas de forma intuitiva, facilitando o acesso à informação e promovendo aprendizado, pesquisa e colaboração.
              </p>

              <p>
                Além de funcionar como um acervo de obras, o Kubo atua como uma rede acadêmica, onde cada usuário possui um perfil com seus projetos publicados, estatísticas e personalização visual.
              </p>
            </div>
          </div>

          <div className="relative order-first lg:order-last">
            <div className="relative h-[350px] sm:h-[450px] lg:h-[600px] w-full">
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Plataforma Kubo - Slide ${index + 1}`}
                    className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    draggable={false}
                  />
                ))}
              </div>

              {/* Indicadores de slides */}
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-black w-6 sm:w-8' 
                        : 'bg-gray-400 hover:bg-gray-600'
                    }`}
                    aria-label={`Ir para slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 bg-black rounded-full blur-3xl opacity-20 -z-10"></div>
              <div className="absolute -top-4 -left-4 w-24 h-24 sm:w-32 sm:h-32 bg-gray-800 rounded-full blur-3xl opacity-20 -z-10"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-20 lg:mt-24">
          <div className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center mb-4 sm:mb-6">
              <i className="fas fa-book-open text-white text-lg sm:text-xl"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Acervo Digital</h3>
            <p className="text-sm sm:text-base text-gray-600">Banco de dados centralizado de obras arquitetônicas nacionais e internacionais</p>
          </div>

          <div className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center mb-4 sm:mb-6">
              <i className="fas fa-users text-white text-lg sm:text-xl"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Rede Acadêmica</h3>
            <p className="text-sm sm:text-base text-gray-600">Conecte-se com estudantes e professores de arquitetura</p>
          </div>

          <div className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center mb-4 sm:mb-6">
              <i className="fas fa-graduation-cap text-white text-lg sm:text-xl"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Foco Acadêmico</h3>
            <p className="text-sm sm:text-base text-gray-600">Valorização da produção acadêmica e pesquisa arquitetônica</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FuncionalidadesV1() {
  const funcionalidades = [
    {
      icon: "fas fa-search",
      titulo: "Exploração Inteligente",
      descricao: "Busque obras arquitetônicas e usuários com filtros por categorias e organização por hashtags",
      features: [
        "Busca avançada de obras e usuários",
        "Filtragem por categorias",
        "Sistema de hashtags",
        "Visualização em grade ou lista"
      ]
    },
    {
      icon: "fas fa-building",
      titulo: "Acervo Colaborativo",
      descricao: "Cadastre novas obras no banco de dados e favorite projetos para referência futura",
      features: [
        "Cadastro de obras arquitetônicas",
        "Sistema de favoritos",
        "Especificações técnicas detalhadas",
        "Galeria de imagens"
      ]
    },
    {
      icon: "fas fa-user-circle",
      titulo: "Perfil Personalizado",
      descricao: "Gerencie sua conta, personalize seu perfil e acompanhe suas estatísticas",
      features: [
        "Gerenciamento de conta",
        "Tema claro/escuro",
        "Imagem de perfil e capa",
        "Estatísticas de projetos e seguidores"
      ]
    }
  ];

  return (
    <section id="funcionalidades" className="select-none py-16 sm:py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-semibold text-black tracking-wider uppercase">Versão 1.0</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-3 sm:mt-4 mb-4 sm:mb-6">
            Funcionalidades <span className="text-black">Disponíveis</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Explore tudo que você pode fazer no Kubo hoje
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {funcionalidades.map((func, index) => (
            <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-black to-gray-800 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <i className={`${func.icon} text-white text-xl sm:text-2xl`}></i>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{func.titulo}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{func.descricao}</p>
              
              <ul className="space-y-2 sm:space-y-3">
                {func.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2 sm:space-x-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="fas fa-check text-black text-xs"></i>
                    </div>
                    <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NovidadesV2() {
  const novidadesV2 = [
    {
      icon: "fas fa-palette",
      titulo: "Nova Tela de Loading",
      descricao: "Interface de carregamento mais moderna e fluida",
      status: "Em desenvolvimento"
    },
    {
      icon: "fas fa-ad",
      titulo: "Sistema de Anúncios",
      descricao: "Integração de publicidade para sustentabilidade da plataforma",
      status: "Em desenvolvimento"
    },
    {
      icon: "fas fa-eye",
      titulo: "Visibilidade de Perfil",
      descricao: "Controle quem pode visualizar seu perfil e projetos",
      status: "Planejado"
    },
    {
      icon: "fas fa-bell",
      titulo: "Notificações Personalizadas",
      descricao: "Gerencie suas preferências de notificações",
      status: "Planejado"
    },
    {
      icon: "fas fa-language",
      titulo: "Idioma do Perfil",
      descricao: "Escolha o idioma de exibição da plataforma",
      status: "Planejado"
    },
    {
      icon: "fas fa-users",
      titulo: "Visualização de Seguidores",
      descricao: "Veja quem está seguindo você e quem você segue",
      status: "Planejado"
    }
  ];

  return (
    <section id="novidades" className="select-none py-16 sm:py-20 lg:py-32 bg-gradient-to-br from-black/5 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-semibold text-black tracking-wider uppercase">Novidades</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-3 sm:mt-4 mb-4 sm:mb-6">
            O que está por vir na <span className="text-black">Versão 2.0</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Estamos trabalhando em novos recursos para tornar sua experiência ainda melhor
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {novidadesV2.map((novidade, index) => (
            <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-gray-100 hover:border-black transition-all duration-300 group">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/10 rounded-xl flex items-center justify-center group-hover:bg-black transition-colors">
                  <i className={`${novidade.icon} text-black group-hover:text-white text-lg sm:text-xl transition-colors`}></i>
                </div>
                <span className="text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full bg-gray-200 text-gray-800 whitespace-nowrap">
                  {novidade.status}
                </span>
              </div>
              
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">{novidade.titulo}</h3>
              <p className="text-sm text-gray-600">{novidade.descricao}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-xl text-center">
          <i className="fas fa-lightbulb text-4xl sm:text-5xl text-black mb-4 sm:mb-6"></i>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Tem alguma sugestão?</h3>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Sua opinião é muito importante para nós. Entre em contato e ajude a moldar o futuro do Kubo!
          </p>
          <a
            href="#contato"
            className="inline-flex items-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-full font-medium text-sm sm:text-base hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
          >
            <span>Enviar sugestão</span>
            <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
}

function ContatoSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const subjectRef = useRef<HTMLDivElement>(null);

  const subjects = [
    'Dúvida',
    'Sugestão',
    'Feedback',
    'Problema técnico',
    'Outro'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (subjectRef.current && !subjectRef.current.contains(event.target as Node)) {
        setIsSubjectOpen(false);
      }
    };

    if (isSubjectOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSubjectOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
    }
  };

  const handleSubjectSelect = (subject: string) => {
    setFormData({ ...formData, subject });
    setIsSubjectOpen(false);
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
    }
  };

  const handleSubmit = async () => {
    const trimmedData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim()
    };

    if (!trimmedData.fullName || !trimmedData.email || !trimmedData.subject || !trimmedData.message) {
      setSubmitStatus('error');
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      setSubmitStatus('error');
      setErrorMessage('Por favor, insira um e-mail válido.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trimmedData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          fullName: '',
          email: '',
          subject: '',
          message: ''
        });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data?.error || 'Erro ao enviar mensagem. Tente novamente.');
      }
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage('Erro ao enviar mensagem. Verifique sua conexão.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="select-none py-16 sm:py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16">
          <div className="space-y-6 sm:space-y-8">
            <div>
              <span className="text-xs sm:text-sm font-semibold text-black tracking-wider uppercase">Contato</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-3 sm:mt-4 mb-4 sm:mb-6">
                Entre em <span className="text-black">contato</span> conosco
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Tem dúvidas, sugestões ou quer dar feedback? Estamos aqui para ouvir você!
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-envelope text-white text-sm sm:text-base"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Email</h3>
                  <p className="text-gray-600 text-sm sm:text-base break-all">kuboprofessional@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-headset text-white text-sm sm:text-base"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Suporte</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Respondemos em até 72 horas úteis</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg">
            <div className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                    Nome completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Assunto <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={subjectRef}>
                  <button
                    type="button"
                    onClick={() => setIsSubjectOpen(!isSubjectOpen)}
                    className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl text-sm font-medium hover:border-black transition-all outline-none"
                  >
                    <span className={formData.subject ? 'text-gray-900' : 'text-gray-400'}>
                      {formData.subject || 'Selecione um assunto'}
                    </span>
                    <i className={`fas fa-chevron-down text-gray-400 text-xs sm:text-sm transition-transform ${isSubjectOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  
                  {isSubjectOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden">
                      {subjects.map((subject) => (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => handleSubjectSelect(subject)}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left text-sm font-medium transition-colors ${
                            formData.subject === subject
                              ? 'bg-black text-white'
                              : 'text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                  Mensagem <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Como podemos ajudar você?"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 outline-none transition-all resize-none"
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="flex items-center gap-2 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl">
                  <i className="fas fa-check-circle text-green-600 text-sm sm:text-base"></i>
                  <p className="text-xs sm:text-sm font-medium text-green-700">
                    Mensagem enviada com sucesso! Responderemos em breve.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="flex items-center gap-2 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
                  <i className="fas fa-exclamation-circle text-red-600 text-sm sm:text-base"></i>
                  <p className="text-xs sm:text-sm font-medium text-red-700">
                    {errorMessage}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-xl font-medium text-sm sm:text-base hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-black/20 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    <span>Enviar mensagem</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="select-none bg-black text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex text-xl sm:text-2xl font-bold gap-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex justify-center items-center">
                <img src={KuboIconWhite} alt="Kubo Icon" draggable={false} className="h-full" />
              </div>
              <span className="text-white">KUBO</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              A plataforma acadêmica para projetos arquitetônicos
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Plataforma</h3>
            <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
              <li><a href="#sobre" className="hover:text-white transition-colors">Sobre</a></li>
              <li><a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a></li>
              <li><a href="#novidades" className="hover:text-white transition-colors">Novidades</a></li>
              <li><a href="#contato" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Recursos</h3>
            <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Suporte</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Redes Sociais</h3>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <i className="fab fa-instagram text-sm sm:text-base"></i>
              </a>
             
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <i className="fab fa-linkedin text-sm sm:text-base"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2026 Kubo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white min-w-[320px]">
      <LandingPageHeader />
      <main>
        <HeroSection />
        <StatsBanner />
        <SobreSection />
        <FuncionalidadesV1 />
        <NovidadesV2 />
        <ContatoSection />
      </main>
      <Footer />
    </div>
  );
}
import { useEffect, useState } from "react";

// Imagens de exemplo do Unsplash - URLs reais que funcionam
const Mesa = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80";
const Estatua = "https://images.unsplash.com/photo-1600585154340-043788447d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80";
const Universo = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80";
const ImgHero = "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80";

// Nova imagem para a Kubo Gallery (exposição arquitetônica)
const GalleryImg = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80";

// Componente de imagem com fallback
const ImageWithFallback = ({ src, alt, fallbackSrc, className, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!error) {
      setError(true);
      setImgSrc(fallbackSrc || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%230B85FF'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial, sans-serif' font-size='48' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3E" + encodeURIComponent(alt) + "%3C/text%3E%3C/svg%3E");
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};

// Componente do Header
function LandingPageHeader() {
  useEffect(() => {
    const handleSmoothScroll = (e) => {
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <nav className="hidden md:flex space-x-8">
            <a href="#sobre-nos" className="text-lg font-medium text-gray-600 hover:text-[#0B85FF] transition-colors">
              Sobre
            </a>
            <a href="#novidades" className="text-lg font-medium text-gray-600 hover:text-[#0B85FF] transition-colors">
              Novidades
            </a>
            <a href="#projetos" className="text-lg font-medium text-gray-600 hover:text-[#0B85FF] transition-colors">
              Projetos
            </a>
          </nav>
          
          <div className="flex-1 flex justify-center md:justify-start md:flex-none">
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-gray-900">KU</span>
              <span className="text-gray-900">BO</span>
            </div>
          </div>

          <a href="#login" className="text-lg font-medium text-gray-900 hover:text-[#0B85FF] transition-colors">
            Entrar
          </a>
        </div>
      </div>
    </header>
  );
}

// Componente Hero
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-7xl md:text-8xl font-bold tracking-tight text-gray-900">
                Kubo
              </h1>
              <p className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-600 max-w-lg leading-tight">
                O maior banco de
              </p>
              <p className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-600 max-w-lg leading-tight" >dados de arquitetura</p>
              <p className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-600 max-w-lg leading-tight">do país</p>
              
            </div>
            
            <div className="flex items-center space-x-4 pt-4">
              <a 
                href="#register"
                className="px-8 py-3 bg-[#0B85FF] text-white rounded-full font-medium hover:bg-[#0969CC] transition-all duration-300 hover:shadow-lg hover:shadow-[#0B85FF]/20"
              >
                Começar agora
              </a>
              <a 
                href="#sobre-nos"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:border-[#0B85FF] hover:text-[#0B85FF] transition-colors"
              >
                Saber mais
              </a>
            </div>
          </div>

          <div className="relative h-[500px] lg:h-[600px] w-full">
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
              <ImageWithFallback 
                src={ImgHero}
                alt="Banco de dados de arquitetura Kubo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#0B85FF] rounded-full blur-3xl opacity-20 -z-10"></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#0969CC] rounded-full blur-3xl opacity-20 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Componente Stats Banner - AGORA PRETO
function StatsBanner() {
  return (
    <div className="bg-black py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-3">
          <span className="text-5xl font-bold text-white">1000+</span>
          <span className="text-xl text-gray-300 font-light">projetos documentados</span>
        </div>
      </div>
    </div>
  );
}

// Componente Sobre Nós
function SobreNos() {
  return (
    <section id="sobre-nos" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-sm font-semibold text-[#0B85FF] tracking-wider uppercase">Sobre nós</span>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                A jornada que moldou <span className="text-[#0B85FF]">nossa</span> plataforma
              </h2>
            </div>

            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                <span className="font-semibold text-gray-900">Kubo</span> é uma plataforma web criada para facilitar a conexão, o compartilhamento de ideias e a valorização de projetos no campo da Arquitetura.
              </p>
              
              <p>
                Pensada especialmente para estudantes e jovens profissionais da área, o Kubo funciona como uma rede social temática, onde os usuários podem publicar seus trabalhos acadêmicos e pessoais.
              </p>
              
              <p>
                A proposta central é criar um ambiente colaborativo e inspirador, no qual estudantes possam divulgar seus projetos e organizá-los em portfólios públicos, criando oportunidades de networking e visibilidade.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback 
                src={Mesa}
                alt="Mesa de trabalho de arquitetura" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#0B85FF] rounded-full blur-3xl opacity-20"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#0969CC] rounded-full blur-3xl opacity-20"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-[#0B85FF] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <i className="fas fa-palette text-white text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Criatividade</h3>
            <p className="text-gray-600">Expresse sua visão arquitetônica única</p>
          </div>
          
          <div className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-[#0B85FF] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <i className="fas fa-users text-white text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Colaboração</h3>
            <p className="text-gray-600">Conecte-se com profissionais da área</p>
          </div>
          
          <div className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-[#0B85FF] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <i className="fas fa-rocket text-white text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Crescimento</h3>
            <p className="text-gray-600">Desenvolva sua carreira profissional</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Componente Novidades
function Novidades() {
  return (
    <section id="novidades" className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <span className="text-sm font-semibold text-[#0B85FF] tracking-wider uppercase">Novidades</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 lg:p-16 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Conheça a <span className="text-[#0B85FF]">Kubo Gallery</span>
            </h2>

            <div className="space-y-6">
              <p className="text-xl text-gray-600 leading-relaxed">
                A plataforma traz uma nova maneira de conhecer o mundo. A Kubo Gallery oferece uma coletânea de obras ricas em detalhes e experiências imersivas únicas.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Explore galerias temáticas, descubra novos talentos e conecte-se com as mais inovadoras ideias arquitetônicas.
              </p>
              
              <div className="pt-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#0B85FF] rounded-full"></div>
                  <span className="text-gray-700">Mais de 100 projetos em exibição</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#0B85FF] rounded-full"></div>
                  <span className="text-gray-700">Exposição Kubo Gallery 2024</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#0B85FF] rounded-full"></div>
                  <span className="text-gray-700">Visitação virtual disponível</span>
                </div>
              </div>
            </div>

            <a
              href="#register"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-[#0B85FF] text-white rounded-full font-medium hover:bg-[#0969CC] transition-all duration-300 hover:shadow-lg hover:shadow-[#0B85FF]/20"
            >
              <span>Explore já</span>
              <i className="fas fa-arrow-right"></i>
            </a>
          </div>

          {/* Área da direita - IMAGEM SEM TEXTO */}
          <div className="relative h-full min-h-[400px]">
            <ImageWithFallback 
              src={GalleryImg}
              alt="Exposição da Kubo Gallery mostrando diferentes projetos arquitetônicos"
              className="w-full h-full object-cover"
              fallbackSrc={Mesa}
            />
            {/* Overlay sutil apenas para melhorar contraste */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Componente Projetos
function Projetos() {
  return (
    <section id="projetos" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-50 rounded-3xl overflow-hidden">
          <div className="relative h-full min-h-[400px] order-2 lg:order-1">
            <ImageWithFallback 
              src={Universo}
              alt="Universo criativo" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 lg:p-16 space-y-8 order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Crie com os <span className="text-[#0B85FF]">Projetos</span>
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              Deixe sua criatividade fluir e popule seu perfil com suas próprias obras de arte. Transforme ideias em realidade e compartilhe sua visão única com o mundo.
            </p>

            <a
              href="#register"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-[#0B85FF] text-white rounded-full font-medium hover:bg-[#0969CC] transition-all duration-300 hover:shadow-lg hover:shadow-[#0B85FF]/20"
            >
              <span>Crie já</span>
              <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer - AGORA PRETO
function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="text-2xl font-bold">
              <span className="text-white">KU</span>
              <span className="text-white">BO</span>
            </div>
            <p className="text-gray-400 text-sm">
              O maior banco de dados de arquitetura do país
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Plataforma</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#sobre-nos" className="hover:text-white transition-colors">Sobre</a></li>
              <li><a href="#novidades" className="hover:text-white transition-colors">Novidades</a></li>
              <li><a href="#projetos" className="hover:text-white transition-colors">Projetos</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Suporte</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-[#0B85FF] transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-[#0B85FF] transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-[#0B85FF] transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Kubo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

// Componente Principal
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      <LandingPageHeader />
      <main>
        <HeroSection />
        <StatsBanner />
        <SobreNos />
        <Novidades />
        <Projetos />
      </main>
      <Footer />
    </div>
  );
}
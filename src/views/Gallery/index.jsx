import React, { useState } from 'react';
import KuboIcon from "../../assets/icons/Universal/kubo-main-icon.svg";

export default function Gallery() {
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Obras arquitetônicas reais famosas
  const architecturalWorks = [
    {
      id: 1,
      title: "Mansão dos Arcos",
      location: "Jundiaí, Brasil",
      architect: "Paulo Mendes da Rocha",
      year: "1998",
      description: "Residência projetada pelo renomado arquiteto brasileiro, caracterizada por seus arcos de concreto aparente que integram o interior com a paisagem externa.",
      imageUrl: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800",
      category: "residencial",
      style: "brutalista",
      tags: ["concreto", "moderno", "brasil"]
    },
    {
      id: 2,
      title: "Torre Eiffel",
      location: "Paris, França",
      architect: "Gustave Eiffel",
      year: "1889",
      description: "Torre de ferro treliçada de 324 metros de altura, construída para a Exposição Universal de 1889. Símbolo mundial da França.",
      imageUrl: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=800",
      category: "monumento",
      style: "neogótico",
      tags: ["ferro", "torre", "frança"]
    },
    {
      id: 3,
      title: "Torre de Pisa",
      location: "Pisa, Itália",
      architect: "Bonanno Pisano",
      year: "1372",
      description: "Campanário da catedral de Pisa, mundialmente famosa por sua inclinação involuntária de aproximadamente 4 graus.",
      imageUrl: "https://images.unsplash.com/photo-1553615738-2d36d89e5e39?auto=format&fit=crop&w=800",
      category: "religioso",
      style: "românico",
      tags: ["mármore", "inclinada", "itália"]
    },
    {
      id: 4,
      title: "Casa da Cascata (Fallingwater)",
      location: "Pensilvânia, EUA",
      architect: "Frank Lloyd Wright",
      year: "1937",
      description: "Considerada a obra-prima da arquitetura orgânica, construída sobre uma cachoeira natural.",
      imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800",
      category: "residencial",
      style: "orgânica",
      tags: ["concreto", "natureza", "eua"]
    },
    {
      id: 5,
      title: "Museu Guggenheim Bilbao",
      location: "Bilbao, Espanha",
      architect: "Frank Gehry",
      year: "1997",
      description: "Edifício revolucionário de titânio e vidro que transformou a cidade industrial em destino cultural.",
      imageUrl: "https://images.unsplash.com/photo-1596394516093-9b9ca4f6e8c5?auto=format&fit=crop&w=800",
      category: "cultural",
      style: "deconstrutivista",
      tags: ["titânio", "curvas", "espanha"]
    },
    {
      id: 6,
      title: "Sydney Opera House",
      location: "Sydney, Austrália",
      architect: "Jørn Utzon",
      year: "1973",
      description: "Com suas conchas brancas que lembram velas de barco, é um dos edifícios mais fotografados do mundo.",
      imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800",
      category: "cultural",
      style: "expressionista",
      tags: ["concreto", "conchas", "austrália"]
    },
    {
      id: 7,
      title: "Burj Khalifa",
      location: "Dubai, Emirados Árabes",
      architect: "Adrian Smith",
      year: "2010",
      description: "Arranha-céu de 828 metros, o edifício mais alto do mundo, inspirado na flor do deserto Hymenocallis.",
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800",
      category: "comercial",
      style: "neofuturista",
      tags: ["vidro", "alto", "dubai"]
    },
    {
      id: 8,
      title: "Sagrada Família",
      location: "Barcelona, Espanha",
      architect: "Antoni Gaudí",
      year: "1882-presente",
      description: "Basílica modernista em construção há mais de 140 anos, obra-prima de Gaudí com formas inspiradas na natureza.",
      imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800",
      category: "religioso",
      style: "modernista",
      tags: ["pedra", "gótico", "espanha"]
    },
    {
      id: 9,
      title: "Museu do Amanhã",
      location: "Rio de Janeiro, Brasil",
      architect: "Santiago Calatrava",
      year: "2015",
      description: "Museu de ciências com design futurista inspirado nas bromélias do Jardim Botânico do Rio.",
      imageUrl: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800",
      category: "cultural",
      style: "futurista",
      tags: ["aço", "sustentável", "brasil"]
    },
    {
      id: 10,
      title: "Parthenon",
      location: "Atenas, Grécia",
      architect: "Ictino e Calícrates",
      year: "447 a.C.",
      description: "Templo dedicado à deusa Atena, obra máxima da arquitetura clássica grega e símbolo da democracia ateniense.",
      imageUrl: "https://images.unsplash.com/photo-1603952271746-024d79fe9d84?auto=format&fit=crop&w=800",
      category: "religioso",
      style: "clássico",
      tags: ["mármore", "grécia", "antigo"]
    },
    {
      id: 11,
      title: "Museu de Arte de São Paulo (MASP)",
      location: "São Paulo, Brasil",
      architect: "Lina Bo Bardi",
      year: "1968",
      description: "Famoso pelo vão livre de 74 metros, um marco da arquitetura moderna brasileira.",
      imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=800",
      category: "cultural",
      style: "modernista",
      tags: ["concreto", "vão livre", "brasil"]
    },
    {
      id: 12,
      title: "Empire State Building",
      location: "Nova York, EUA",
      architect: "Shreve, Lamb & Harmon",
      year: "1931",
      description: "Arranha-céu Art Déco de 443 metros que foi o edifício mais alto do mundo por quase 40 anos.",
      imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800",
      category: "comercial",
      style: "art déco",
      tags: ["aço", "nova york", "histórico"]
    }
  ];

  const filteredWorks = architecturalWorks.filter(work => {
    if (filter === 'residencial' && work.category !== 'residencial') return false;
    if (filter === 'cultural' && work.category !== 'cultural') return false;
    if (filter === 'religioso' && work.category !== 'religioso') return false;
    if (filter === 'comercial' && work.category !== 'comercial') return false;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        work.title.toLowerCase().includes(searchLower) ||
        work.location.toLowerCase().includes(searchLower) ||
        work.architect.toLowerCase().includes(searchLower) ||
        work.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  const user = {
    name: "Kubo",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100",
    role: "Arquiteto"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo e título */}
            <div className="flex items-center">
              {/* Navegação no header à esquerda */}
              <nav className="ml-8 hidden md:flex items-center space-x-6">
                <a 
                  href="#destaques" 
                  className="text-gray-700 hover:text-black transition-colors font-medium"
                >
                  Home
                </a>
                <a 
                  href="#artistas" 
                  className="text-gray-700 hover:text-black transition-colors font-medium"
                >
                  Galeria
                </a>
                <a 
                  href="#colecoes" 
                  className="text-gray-700 hover:text-black transition-colors font-medium"
                >
                  Favoritos
                </a>
              </nav>
            </div>
            <div className="w-8 h-8 flex justify-between mr-3">
              <a href="/"><img src={KuboIcon} alt="Kubo Icon" draggable={false} className="h-full" /></a>
            </div>

            {/* Menu do usuário */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="text-right hidden md:block">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <div className="relative">
                  <img
                    className="h-10 w-10 rounded-full border border-gray-300"
                    src={user.avatar}
                    alt=""
                  />
                </div>
                <i className={`fas fa-chevron-down text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <a
                      href="/profile/:username"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-user-circle mr-3 text-gray-400"></i>
                      <span>Meu Perfil</span>
                    </a>
                    <a
                      href="/configuracoes"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-cog mr-3 text-gray-400"></i>
                      <span>Configurações</span>
                    </a>
                    <a
                      href="/minhas-obras"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-bookmark mr-3 text-gray-400"></i>
                      <span>Minhas Obras</span>
                    </a>
                    <div className="border-t border-gray-200 my-1"></div>
                    <a
                      href="/ajuda"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-question-circle mr-3 text-gray-400"></i>
                      <span>Ajuda & Suporte</span>
                    </a>
                    <a
                      href="/sair"
                      className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <i className="fas fa-sign-out-alt mr-3"></i>
                      <span>Sair</span>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Barra de busca minimalista */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              
              <input
                type="text"
                placeholder="Buscar obras, arquitetos ou localizações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
              />
              
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            
            {/* Dicas de busca minimalistas */}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setSearchTerm('brasil')}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                #brasil
              </button>
              <button
                onClick={() => setSearchTerm('concreto')}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                #concreto
              </button>
              <button
                onClick={() => setSearchTerm('modernista')}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                #modernista
              </button>
            </div>
          </div>

          {/* Filtros com design preto no branco */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Galeria de Obras
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Explore arquitetura icônica mundial
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Filtros de categoria - Design preto no branco */}
                <div className="flex space-x-1 bg-white border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      filter === 'all'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFilter('residencial')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      filter === 'residencial'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Residencial
                  </button>
                  <button
                    onClick={() => setFilter('cultural')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      filter === 'cultural'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Cultural
                  </button>
                  <button
                    onClick={() => setFilter('religioso')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      filter === 'religioso'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Religioso
                  </button>
                </div>

                {/* Modos de visualização */}
                <div className="flex space-x-1 bg-white border border-gray-300 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title="Grade"
                  >
                    <i className="fas fa-th-large"></i>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title="Lista"
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Galeria */}
          {filteredWorks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-300">
              <i className="fas fa-building text-gray-300 text-5xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhuma obra encontrada
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Tente ajustar sua busca.' : 'Adicione sua primeira obra!'}
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                <i className="fas fa-plus mr-2"></i>
                Nova Obra
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            // Grade
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorks.map((work) => (
                <div
                  key={work.id}
                  className="bg-white rounded-lg border border-gray-300 overflow-hidden hover:shadow-md transition-all duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={work.imageUrl}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium rounded-full border border-gray-300">
                        {work.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <button
                        onClick={() => setSelectedImage(work)}
                        className="text-white text-sm font-medium flex items-center hover:text-gray-200"
                      >
                        Ver detalhes
                        <i className="fas fa-arrow-right ml-2"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{work.title}</h3>
                      <button className="text-gray-400 hover:text-black">
                        <i className="far fa-star"></i>
                      </button>
                    </div>
                    
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                      <span>{work.location}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{work.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Arquiteto</div>
                        <div className="text-sm font-medium text-gray-900">{work.architect}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Ano</div>
                        <div className="text-sm font-medium text-gray-900">{work.year}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-1">
                      {work.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                      {work.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{work.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Lista
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              {filteredWorks.map((work) => (
                <div
                  key={work.id}
                  className="border-b border-gray-300 last:border-0 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="p-6 flex items-start">
                    <div 
                      className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border border-gray-300"
                      onClick={() => setSelectedImage(work)}
                    >
                      <img
                        src={work.imageUrl}
                        alt={work.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="ml-6 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg mb-1">{work.title}</h3>
                          <div className="flex items-center text-gray-600 text-sm mb-2">
                            <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                            <span className="mr-4">{work.location}</span>
                            <i className="fas fa-user-tie mr-2 text-gray-400"></i>
                            <span>{work.architect}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{work.description}</p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button className="text-gray-400 hover:text-black">
                            <i className="far fa-star"></i>
                          </button>
                          <button 
                            onClick={() => setSelectedImage(work)}
                            className="text-gray-400 hover:text-black"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {work.category}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <i className="fas fa-calendar mr-2 text-gray-400"></i>
                            {work.year}
                          </div>
                          <div className="text-sm text-gray-600">
                            <i className="fas fa-palette mr-2 text-gray-400"></i>
                            {work.style}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {work.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de detalhes */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="h-64 md:h-96 relative">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedImage.title}</h2>
                  <div className="flex items-center text-white/90">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    <span className="mr-6">{selectedImage.location}</span>
                    <i className="fas fa-user-tie mr-2"></i>
                    <span>{selectedImage.architect}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Categoria</div>
                      <div className="font-medium text-gray-900">{selectedImage.category}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Estilo Arquitetônico</div>
                      <div className="font-medium text-gray-900">{selectedImage.style}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Ano de Construção</div>
                      <div className="font-medium text-gray-900">{selectedImage.year}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Tipo de Estrutura</div>
                      <div className="font-medium text-gray-900">
                        {selectedImage.category === 'residencial' ? 'Residencial' :
                         selectedImage.category === 'cultural' ? 'Cultural' :
                         selectedImage.category === 'religioso' ? 'Religioso' : 'Comercial'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Tags</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedImage.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-300 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
                  <p className="text-gray-600">{selectedImage.description}</p>
                </div>
                
                <div className="mt-6 flex justify-end space-x-4">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <i className="far fa-star mr-2"></i>
                    Favoritar
                  </button>
                  <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                    <i className="fas fa-share mr-2"></i>
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
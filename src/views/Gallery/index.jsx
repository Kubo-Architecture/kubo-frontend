import React, { useState } from 'react';
import KuboIcon from "../../assets/icons/Universal/kubo-main-icon.svg";

export default function Gallery() {
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Obras arquitetônicas reais famosas
  const architecturalWorks = [
    // ... (mantenha o mesmo array de obras)
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
    // ... (restante das obras)
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
              {/* Menu Hamburger para mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden mr-4 relative w-8 h-8 focus:outline-none"
                aria-label="Menu"
              >
                <div className="w-6 h-5 relative transform transition-all duration-300">
                  <span
                    className={`absolute left-0 h-0.5 w-full bg-gray-700 transform transition-all duration-300 ${isMobileMenuOpen
                        ? 'rotate-45 top-2'
                        : 'top-0'
                      }`}
                  ></span>
                  <span
                    className={`absolute left-0 h-0.5 w-full bg-gray-700 top-2 transform transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                      }`}
                  ></span>
                  <span
                    className={`absolute left-0 h-0.5 w-full bg-gray-700 transform transition-all duration-300 ${isMobileMenuOpen
                        ? '-rotate-45 top-2'
                        : 'top-4'
                      }`}
                  ></span>
                </div>
              </button>

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
            <div className="relative hidden md:block">
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

            {/* Menu do usuário mobile simplificado */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="focus:outline-none"
              >
                <img
                  className="h-10 w-10 rounded-full border border-gray-300"
                  src={user.avatar}
                  alt=""
                />
              </button>

              {/* Dropdown menu mobile */}
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  ></div>
                  <div className="absolute right-4 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <a
                      href="/profile/:username"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-user-circle mr-3 text-gray-400"></i>
                      <span>Meu Perfil</span>
                    </a>
                    <a
                      href="/minhas-obras"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-bookmark mr-3 text-gray-400"></i>
                      <span>Minhas Obras</span>
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

          {/* Menu mobile expandido */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-64 py-4' : 'max-h-0'
            }`}>
            <nav className="flex flex-col space-y-4">
              <a
                href="#destaques"
                className="text-gray-700 hover:text-black transition-colors font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#artistas"
                className="text-gray-700 hover:text-black transition-colors font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Galeria
              </a>
              <a
                href="#colecoes"
                className="text-gray-700 hover:text-black transition-colors font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Favoritos
              </a>
              <a
                href="/configuracoes"
                className="text-gray-700 hover:text-black transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Configurações
              </a>
            </nav>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  Galeria de Obras
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Explore arquitetura icônica mundial
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Filtros de categoria - Design preto no branco */}
                <div className="flex flex-wrap gap-1 bg-white border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all flex-1 min-w-[80px] ${filter === 'all'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFilter('residencial')}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all flex-1 min-w-[80px] ${filter === 'residencial'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Residencial
                  </button>
                  <button
                    onClick={() => setFilter('cultural')}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all flex-1 min-w-[80px] ${filter === 'cultural'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Cultural
                  </button>
                  <button
                    onClick={() => setFilter('religioso')}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all flex-1 min-w-[80px] ${filter === 'religioso'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Religioso
                  </button>
                </div>

                {/* Modos de visualização */}
                <div className="flex space-x-1 bg-white border border-gray-300 p-1 rounded-lg self-start">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${viewMode === 'grid'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    title="Grade"
                  >
                    <i className="fas fa-th-large"></i>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${viewMode === 'list'
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
            // Grade responsiva
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredWorks.map((work) => (
                <div
                  key={work.id}
                  className="bg-white rounded-lg border border-gray-300 overflow-hidden hover:shadow-md transition-all duration-300 group"
                >
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <img
                      src={work.imageUrl}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
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

                  <div className="p-4 md:p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-base md:text-lg line-clamp-1">{work.title}</h3>
                      <button className="text-gray-400 hover:text-black flex-shrink-0 ml-2">
                        <i className="far fa-star"></i>
                      </button>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <i className="fas fa-map-marker-alt mr-2 text-gray-400 flex-shrink-0"></i>
                      <span className="truncate">{work.location}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{work.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="min-w-0">
                        <div className="text-xs text-gray-500 mb-1 truncate">Arquiteto</div>
                        <div className="text-sm font-medium text-gray-900 truncate">{work.architect}</div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-xs text-gray-500 mb-1">Ano</div>
                        <div className="text-sm font-medium text-gray-900">{work.year}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1">
                      {work.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded truncate max-w-[100px]">
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
            // Lista responsiva
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              {filteredWorks.map((work) => (
                <div
                  key={work.id}
                  className="border-b border-gray-300 last:border-0 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="p-4 md:p-6 flex flex-col sm:flex-row items-start">
                    <div
                      className="w-full sm:w-32 h-48 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border border-gray-300 mb-4 sm:mb-0"
                      onClick={() => setSelectedImage(work)}
                    >
                      <img
                        src={work.imageUrl}
                        alt={work.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <div className="sm:ml-6 flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{work.title}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 text-sm mb-2 gap-2">
                            <div className="flex items-center">
                              <i className="fas fa-map-marker-alt mr-2 text-gray-400 flex-shrink-0"></i>
                              <span className="truncate">{work.location}</span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-user-tie mr-2 text-gray-400 flex-shrink-0"></i>
                              <span className="truncate">{work.architect}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">{work.description}</p>
                        </div>

                        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
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

                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {work.category}
                          </span>
                          <div className="text-sm text-gray-600 flex items-center">
                            <i className="fas fa-calendar mr-2 text-gray-400"></i>
                            {work.year}
                          </div>
                          <div className="text-sm text-gray-600 hidden md:flex items-center">
                            <i className="fas fa-palette mr-2 text-gray-400"></i>
                            {work.style}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {work.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded truncate max-w-[100px]">
                              {tag}
                            </span>
                          ))}
                          {work.tags.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{work.tags.length - 2}
                            </span>
                          )}
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

      {/* Modal de detalhes responsivo */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 sm:-top-12 right-0 text-white text-2xl hover:text-gray-300 transition-colors z-10"
            >
              <i className="fas fa-times"></i>
            </button>

            <div className="bg-white rounded-lg overflow-hidden">
              <div className="h-48 sm:h-64 md:h-80 lg:h-96 relative">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{selectedImage.title}</h2>
                  <div className="flex flex-col sm:flex-row sm:items-center text-white/90 gap-2 sm:gap-6">
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      <span className="truncate">{selectedImage.location}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-user-tie mr-2"></i>
                      <span className="truncate">{selectedImage.architect}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
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
                          <span key={index} className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
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

                <div className="mt-6 flex flex-wrap justify-end gap-2 sm:gap-4">
                  <button className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                    <i className="far fa-star mr-2"></i>
                    Favoritar
                  </button>
                  <button className="px-3 sm:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base">
                    <i className="fas fa-share mr-2"></i>
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adicionar CSS para melhorar a responsividade */}
      <style jsx>{`
        @media (max-width: 640px) {
          .line-clamp-1 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
          .line-clamp-2 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
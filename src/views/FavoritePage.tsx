import { useState, useEffect } from 'react';
import HeaderFull from "../components/Universal/HeaderFull/index";

export default function FavoritePage() {
  const [viewMode, setViewMode] = useState<string>('grid');
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [favoriteWorks, setFavoriteWorks] = useState<any[]>([]);

  const allWorks = [
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
      tags: ["concreto", "moderno", "brasil"],
      isFavorite: true
    },
    {
      id: 2,
      title: "Museu de Arte de São Paulo",
      location: "São Paulo, Brasil",
      architect: "Lina Bo Bardi",
      year: "1968",
      description: "Icone da arquitetura moderna brasileira, famoso por seu vão livre de 74 metros e estrutura suspensa.",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800",
      category: "cultural",
      style: "modernista",
      tags: ["concreto", "moderno", "brasil"],
      isFavorite: true
    },
    // Adicione mais obras favoritas conforme necessário
  ];

  // Simulando carregamento de favoritos
  useEffect(() => {
    // Em um app real, você buscaria os favoritos de uma API ou localStorage
    const favorites = allWorks.filter(work => work.isFavorite);
    setFavoriteWorks(favorites);
  }, []);

  // Função para remover dos favoritos
  const removeFromFavorites = (workId: any) => {
    setFavoriteWorks(prev => prev.filter(work => work.id !== workId));
  };

  const filteredWorks = favoriteWorks.filter(work => {
    if (filter !== 'all' && work.category !== filter) return false;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        work.title.toLowerCase().includes(searchLower) ||
        work.location.toLowerCase().includes(searchLower) ||
        work.architect.toLowerCase().includes(searchLower) ||
        work.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderFull />
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8">
          {/* Cabeçalho com título e controles */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Favoritos
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Suas obras arquitetônicas favoritas
                </p>
              </div>

              {/* Controles - Modos de visualização */}
              <div className="flex items-center space-x-3 self-start sm:self-center">
                <div className="flex space-x-1 bg-white border border-gray-300 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${viewMode === 'grid'
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    title="Grade"
                  >
                    <i className="fas fa-th-large text-sm sm:text-base"></i>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${viewMode === 'list'
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    title="Lista"
                  >
                    <i className="fas fa-list text-sm sm:text-base"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Barra de busca */}
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-search text-gray-400 text-sm sm:text-base"></i>
                    </div>

                    <input
                      type="text"
                      placeholder="Buscar nos seus favoritos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-10 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow text-sm sm:text-base"
                    />

                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <i className="fas fa-times text-sm sm:text-base"></i>
                      </button>
                    )}
                  </div>

                  {/* Contador de favoritos */}
                  <div className="mt-3 flex items-center text-sm text-gray-600">
                    <i className="fas fa-star text-yellow-500 mr-2"></i>
                    <span>{favoriteWorks.length} obra{favoriteWorks.length !== 1 ? 's' : ''} favoritada{favoriteWorks.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Filtros de categoria */}
                <div className="flex flex-wrap gap-1 bg-white border border-gray-300 rounded-lg p-1 w-full sm:w-auto self-start">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all flex-1 min-w-[60px] sm:min-w-[80px] ${filter === 'all'
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFilter('residencial')}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all flex-1 min-w-[60px] sm:min-w-[80px] ${filter === 'residencial'
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Residencial
                  </button>
                  <button
                    onClick={() => setFilter('cultural')}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all flex-1 min-w-[60px] sm:min-w-[80px] ${filter === 'cultural'
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Cultural
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Galeria de favoritos */}
          {filteredWorks.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-white rounded-lg border border-gray-300">
              <i className="fas fa-star text-gray-300 text-4xl sm:text-5xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchTerm || filter !== 'all' ? 'Nenhum favorito encontrado' : 'Nenhum favorito ainda'}
              </h3>
              <p className="text-gray-500 mb-4 text-sm sm:text-base">
                {searchTerm || filter !== 'all'
                  ? 'Tente ajustar sua busca ou filtro.'
                  : 'Explore a galeria e adicione obras aos seus favoritos!'}
              </p>
              <a
                href="/galeria"
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <i className="fas fa-building mr-2"></i>
                Explorar Galeria
              </a>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {filteredWorks.map((work) => (
                <div
                  key={work.id}
                  className="bg-white rounded-lg border border-gray-300 overflow-hidden hover:shadow-md transition-all duration-300 group"
                >
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
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

                  <div className="p-4">
                    {/* Título com estrela no mesmo lugar da galeria */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">{work.title}</h3>
                      <button
                        onClick={() => removeFromFavorites(work.id)}
                        className="text-yellow-500 hover:text-yellow-600 flex-shrink-0 ml-2 transition-colors"
                        title="Remover dos favoritos"
                      >
                        <i className="fas fa-star text-sm sm:text-base"></i>
                      </button>
                    </div>

                    <div className="flex items-center text-gray-600 text-xs sm:text-sm mb-3">
                      <i className="fas fa-map-marker-alt mr-2 text-gray-400 flex-shrink-0"></i>
                      <span className="truncate">{work.location}</span>
                    </div>

                    <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">{work.description}</p>

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
                      {work.tags.slice(0, 3).map((tag: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded truncate max-w-[80px] sm:max-w-[100px]">
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
            // Modo lista
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {filteredWorks.map((work, index) => (
                <div
                  key={work.id}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${index !== filteredWorks.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Imagem */}
                    <div
                      className="lg:w-1/4 cursor-pointer group"
                      onClick={() => setSelectedImage(work)}
                    >
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={work.imageUrl}
                          alt={work.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium rounded-full">
                            {work.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="lg:w-3/4">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
                        <div className="mb-4 lg:mb-0 lg:pr-8">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{work.title}</h3>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                              {work.year}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mb-3 text-gray-600">
                            <div className="flex items-center">
                              <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                              <span>{work.location}</span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-user-tie mr-2 text-gray-400"></i>
                              <span className="font-medium">{work.architect}</span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-palette mr-2 text-gray-400"></i>
                              <span>{work.style}</span>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4 line-clamp-2">
                            {work.description}
                          </p>
                        </div>

                        {/* Ações - Alinhadas à direita */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => removeFromFavorites(work.id)}
                            className="text-yellow-500 hover:text-yellow-600 transition-colors p-2"
                            title="Remover dos favoritos"
                          >
                            <i className="fas fa-star text-lg"></i>
                          </button>
                          <button
                            onClick={() => setSelectedImage(work)}
                            className="text-gray-400 hover:text-blue-600 transition-colors p-2"
                            title="Ver detalhes"
                          >
                            <i className="fas fa-expand text-lg"></i>
                          </button>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2 mb-3 lg:mb-0">
                          {work.tags.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-default"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <i className="fas fa-clock mr-2"></i>
                            {work.year}
                          </span>
                          <span className="flex items-center">
                            <i className="fas fa-building mr-2"></i>
                            {work.category === 'residencial' ? 'Residencial' :
                              work.category === 'cultural' ? 'Cultural' : 'Religioso'}
                          </span>
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
                          selectedImage.category === 'cultural' ? 'Cultural' : 'Religioso'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Tags</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedImage.tags.map((tag: string, index: number) => (
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
                  <button
                    onClick={() => removeFromFavorites(selectedImage.id)}
                    className="px-3 sm:px-4 py-2 border border-yellow-300 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors text-sm sm:text-base flex items-center"
                  >
                    <i className="fas fa-star mr-2"></i>
                    Remover dos Favoritos
                  </button>
                  <button className="px-3 sm:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base flex items-center">
                    <i className="fas fa-share mr-2"></i>
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 475px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .xs\\:flex-row {
            flex-direction: row !important;
          }
          .xs\\:w-32 {
            width: 8rem !important;
          }
          .xs\\:h-24 {
            height: 6rem !important;
          }
          .xs\\:ml-4 {
            margin-left: 1rem !important;
          }
          .xs\\:mb-0 {
            margin-bottom: 0 !important;
          }
        }
        
        @media (max-width: 380px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
        }
        
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
        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
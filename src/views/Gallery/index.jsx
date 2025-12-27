import React, { useState } from 'react';
import HeaderFull from "../../components/Universal/HeaderFull/index"

export default function Gallery() {
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    location: '',
    architect: '',
    year: '',
    description: '',
    category: 'residencial',
    style: '',
    tags: []
  });

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
      title: "Museu de Arte de São Paulo",
      location: "São Paulo, Brasil",
      architect: "Lina Bo Bardi",
      year: "1968",
      description: "Icone da arquitetura moderna brasileira, famoso por seu vão livre de 74 metros e estrutura suspensa.",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800",
      category: "cultural",
      style: "modernista",
      tags: ["concreto", "moderno", "brasil"]
    },
  ];

  const [works, setWorks] = useState(architecturalWorks);

  const filteredWorks = works.filter(work => {
    if (filter !== 'all' && work.category !== filter) return false;

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

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.location || !newProject.architect) {
      alert('Por favor, preencha os campos obrigatórios');
      return;
    }

    const newWork = {
      id: works.length + 1,
      ...newProject,
      tags: newProject.tags.length > 0 ? newProject.tags.split(',').map(tag => tag.trim()) : []
    };

    setWorks([...works, newWork]);
    setShowCreateModal(false);
    setNewProject({
      title: '',
      location: '',
      architect: '',
      year: '',
      description: '',
      category: 'residencial',
      style: '',
      tags: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo */}
      <HeaderFull />

      {/* Conteúdo principal */}
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8">
          {/* Cabeçalho com título e controles */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Galeria de Obras
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Explore arquitetura icônica mundial
                </p>
              </div>
              
              {/* Controles - Modos de visualização e botão de criar */}
              <div className="flex items-center space-x-3 self-start sm:self-center">
                {/* Modos de visualização */}
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

                {/* Botão de Criar Projeto - Minimalista */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                  title="Criar projeto"
                >
                  <i className="fas fa-plus text-base sm:text-lg"></i>
                </button>
              </div>
            </div>

            {/* Barra de busca e filtros */}
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
                      placeholder="Buscar obras, arquitetos ou localizações..."
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

                  {/* Dicas de busca */}
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

                {/* Filtros de categoria - Agora ao lado da busca */}
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
                    className={`px-4 pr-7 py-2 text-xs sm:text-sm font-medium rounded-md transition-all flex-1 min-w-[60px] sm:min-w-[80px] ${filter === 'residencial'
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
                  <button
                    onClick={() => setFilter('religioso')}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all flex-1 min-w-[60px] sm:min-w-[80px] ${filter === 'religioso'
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Religioso
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Galeria responsiva */}
          {filteredWorks.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-white rounded-lg border border-gray-300">
              <i className="fas fa-building text-gray-300 text-4xl sm:text-5xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhuma obra encontrada
              </h3>
              <p className="text-gray-500 mb-4 text-sm sm:text-base">
                {searchTerm ? 'Tente ajustar sua busca.' : 'Adicione sua primeira obra!'}
              </p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
              >
                <i className="fas fa-plus mr-2"></i>
                Criar Projeto
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            // Grade responsiva com diferentes breakpoints
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
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">{work.title}</h3>
                      <button className="text-gray-400 hover:text-black flex-shrink-0 ml-2">
                        <i className="far fa-star text-sm sm:text-base"></i>
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
                      {work.tags.slice(0, 3).map((tag, index) => (
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
            // Lista responsiva - NOVO DESIGN MELHORADO
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {filteredWorks.map((work, index) => (
                <div
                  key={work.id}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${index !== filteredWorks.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Imagem - Mais clean */}
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

                    {/* Conteúdo - Layout melhor organizado */}
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
                            className="text-gray-400 hover:text-yellow-500 transition-colors p-2"
                            title="Favoritar"
                          >
                            <i className="far fa-star text-lg"></i>
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

                      {/* Tags e informações adicionais */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2 mb-3 lg:mb-0">
                          {work.tags.map((tag, index) => (
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
                             work.category === 'cultural' ? 'Cultural' : 
                             work.category === 'religioso' ? 'Religioso' : 'Comercial'}
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

      {/* Modal de Criar Projeto */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="relative max-w-md w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg">
            <div className="sticky top-0 bg-white border-b border-gray-300 p-4 sm:p-6 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Criar Novo Projeto</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg sm:text-xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                    placeholder="Nome do projeto"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Localização *
                    </label>
                    <input
                      type="text"
                      value={newProject.location}
                      onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                      placeholder="Cidade, País"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arquiteto *
                    </label>
                    <input
                      type="text"
                      value={newProject.architect}
                      onChange={(e) => setNewProject({...newProject, architect: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                      placeholder="Nome do arquiteto"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ano
                    </label>
                    <input
                      type="text"
                      value={newProject.year}
                      onChange={(e) => setNewProject({...newProject, year: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                      placeholder="2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria
                    </label>
                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="residencial">Residencial</option>
                      <option value="cultural">Cultural</option>
                      <option value="religioso">Religioso</option>
                      <option value="comercial">Comercial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estilo Arquitetônico
                  </label>
                  <input
                    type="text"
                    value={newProject.style}
                    onChange={(e) => setNewProject({...newProject, style: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                    placeholder="Modernista, Brutalista, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base resize-none"
                    placeholder="Descreva o projeto..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={newProject.tags}
                    onChange={(e) => setNewProject({...newProject, tags: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                    placeholder="concreto, moderno, brasil (separados por vírgula)"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base w-full sm:w-auto"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateProject}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base w-full sm:w-auto"
                >
                  Criar Projeto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Adicionar CSS para responsividade */}
      <style jsx global>{`
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
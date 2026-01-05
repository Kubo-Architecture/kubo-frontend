import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import axios from 'axios';

const ProjectGallery = ({ userId, onProjectsLoaded, setIsLoadingChild }: any) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('meus-projetos');
  const [editingProject, setEditingProject] = useState<any>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [likes, setLikes] = useState<{ [key: number]: number }>({});
  const [likedProjects, setLikedProjects] = useState<number[]>([]);

  const tabs = [
    { id: 'meus-projetos', label: 'Projetos' },
    { id: 'colecoes', label: 'Coleções' }
  ];

  // Exemplos de dados mockados
  const mockProjects = [
    {
      id: 101,
      title: 'Residência Sustentável',
      location: 'São Paulo, Brasil',
      description: 'Casa moderna projetada com foco em sustentabilidade e eficiência energética...',
      architect: 'Pedro Oliveira',
      year: 2023,
      category: 'residencial',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
      tags: ['sustentavel', 'moderno', 'ecologico'],
      isUserProject: true,
      likes: 89,
      materials: ['Madeira certificada', 'Vidro low-e'],
      status: 'Concluído',
      build_area: '320',
      terrain_area: '800',
      usage_type: 'Residencial',
      style: 'Sustentável'
    },
    {
      id: 102,
      title: 'Edifício Comercial',
      location: 'Rio de Janeiro, Brasil',
      description: 'Complexo comercial com design contemporâneo e espaços integrados...',
      architect: 'Carla Mendes',
      year: 2022,
      category: 'comercial',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      tags: ['comercial', 'corporativo', 'vidro'],
      isUserProject: true,
      likes: 156,
      materials: ['Vidro', 'Aço', 'Concreto'],
      status: 'Concluído',
      build_area: '5500',
      terrain_area: '8000',
      usage_type: 'Comercial',
      style: 'Contemporâneo'
    },
    {
      id: 103,
      title: 'Projeto Urbano',
      location: 'Brasília, Brasil',
      description: 'Revitalização de área urbana com foco em mobilidade e espaços públicos...',
      architect: 'Roberto Lima',
      year: 2024,
      category: 'urbano',
      image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
      tags: ['urbano', 'publico', 'revitalizacao'],
      isUserProject: true,
      likes: 203,
      materials: ['Concreto permeável', 'Vegetação nativa'],
      status: 'Em construção',
      build_area: '12000',
      terrain_area: '25000',
      usage_type: 'Público',
      style: 'Urbanismo'
    }
  ];

  const mockCollections = [
    {
      id: 1,
      name: 'Inspirações 2024',
      count: 12,
      preview: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400']
    },
    {
      id: 2,
      name: 'Arquitetura Moderna',
      count: 8,
      preview: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400']
    },
    {
      id: 3,
      name: 'Design de Interiores',
      count: 15,
      preview: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400']
    }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${userId}`);
        const data = response.data;
        setProjects(data);

        if (onProjectsLoaded) {
          onProjectsLoaded(data ? data.length : null);
        }

        // Inicializar likes
        const initialLikes: { [key: number]: number } = {};
        data.forEach((project: any) => {
          initialLikes[project.id] = project.likes || 0;
        });
        setLikes(initialLikes);
      } catch (err: any) {
        console.error("Erro ao buscar projetos:", err);
        setError(err.message);
        
        // Inicializar likes para projetos mockados
        const initialLikes: { [key: number]: number } = {};
        mockProjects.forEach((project: any) => {
          initialLikes[project.id] = project.likes || 0;
        });
        setLikes(initialLikes);
      } finally {
        setLoading(false);
        if (setIsLoadingChild) {
          setIsLoadingChild(false);
        }
      }
    };

    if (userId) fetchProjects();
  }, [userId]);

  // Fechar modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingProject(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Função para favoritar
  const toggleFavorite = (projectId: number) => {
    setFavorites(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  // Função para dar like
  const toggleLike = (projectId: number) => {
    if (likedProjects.includes(projectId)) {
      setLikedProjects(prev => prev.filter(id => id !== projectId));
      setLikes(prev => ({
        ...prev,
        [projectId]: Math.max((prev[projectId] || 0) - 1, 0)
      }));
    } else {
      setLikedProjects(prev => [...prev, projectId]);
      setLikes(prev => ({
        ...prev,
        [projectId]: (prev[projectId] || 0) + 1
      }));
    }
  };

  // Função para editar projeto
  const handleEditProject = (project: any) => {
    setEditingProject({
      ...project,
      materials: project.materials || [''],
      status: project.status || '',
      build_area: project.build_area || '',
      terrain_area: project.terrain_area || '',
      usage_type: project.usage_type || '',
    });
  };

  // Função para salvar edição
  const handleSaveEdit = () => {
    if (!editingProject) return;

    // Atualizar no estado de projetos mockados
    const updatedMockProjects = mockProjects.map(p => 
      p.id === editingProject.id ? editingProject : p
    );
    
    setEditingProject(null);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Tabs skeleton */}
            <div className="flex gap-8 border-b border-gray-200/60">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-gray-100 rounded w-28 mb-[-1px] animate-pulse" />
              ))}
            </div>
            
            {/* Grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[4/3] bg-gray-100 rounded-2xl animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navegação de Abas */}
        <div className="flex gap-8 border-b border-gray-200/60 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative pb-4 px-1 text-base font-medium transition-all duration-200
                ${activeTab === tab.id 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="pb-12">
          {/* Meus Projetos */}
          {activeTab === 'meus-projetos' && (
            <>
              {projects?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects?.map((project: any) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : mockProjects.length > 0 ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {mockProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-lg border border-gray-300 overflow-hidden hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        
                        {/* Botão de editar */}
                        {project.isUserProject && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProject(project);
                            }}
                            className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-md hover:shadow-lg z-10"
                            title="Editar projeto"
                          >
                            <i className="fas fa-edit text-gray-700 text-xs"></i>
                          </button>
                        )}

                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium rounded-full border border-gray-300">
                            {project.category}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <button className="text-white text-sm font-medium flex items-center hover:text-gray-200">
                            Ver detalhes
                            <i className="fas fa-arrow-right ml-2"></i>
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">{project.title}</h3>
                          <button
                            onClick={() => toggleFavorite(project.id)}
                            className={`flex-shrink-0 ml-2 transition-colors ${
                              favorites.includes(project.id) 
                                ? 'text-yellow-400 hover:text-yellow-500' 
                                : 'text-gray-400 hover:text-yellow-400'
                            }`}
                          >
                            <i className={`${favorites.includes(project.id) ? 'fas' : 'far'} fa-star text-sm sm:text-base`}></i>
                          </button>
                        </div>

                        <div className="flex items-center text-gray-600 text-xs sm:text-sm mb-3">
                          <i className="fas fa-map-marker-alt mr-2 text-gray-400 flex-shrink-0"></i>
                          <span className="truncate">{project.location}</span>
                        </div>

                        <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">{project.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="min-w-0">
                            <div className="text-xs text-gray-500 mb-1 truncate">Arquiteto</div>
                            <div className="text-sm font-medium text-gray-900 truncate">{project.architect}</div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <div className="text-xs text-gray-500 mb-1">Ano</div>
                            <div className="text-sm font-medium text-gray-900">{project.year}</div>
                          </div>
                        </div>

                        {/* Tags e Like */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex flex-wrap gap-1 flex-1">
                            {project.tags.slice(0, 2).map((tag: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded truncate max-w-[70px] sm:max-w-[90px]">
                                {tag}
                              </span>
                            ))}
                            {project.tags.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{project.tags.length - 2}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => toggleLike(project.id)}
                            className={`flex items-center space-x-1 transition-colors ml-2 ${
                              likedProjects.includes(project.id)
                                ? 'text-red-500 hover:text-red-600'
                                : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            <i className={`${likedProjects.includes(project.id) ? 'fas' : 'far'} fa-heart text-sm`}></i>
                            <span className="text-xs font-medium">{likes[project.id] || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                  title="Nenhum projeto ainda"
                  description="Comece compartilhando seu primeiro projeto com a comunidade"
                  buttonText="Criar projeto"
                  onButtonClick={() => console.log('Criar projeto')}
                />
              )}
            </>
          )}

          {/* Coleções */}
          {activeTab === 'colecoes' && (
            <>
              {mockCollections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {mockCollections.map((collection) => (
                    <div key={collection.id} className="group cursor-pointer">
                      <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden mb-4 relative shadow-sm hover:shadow-md transition-all duration-300">
                        <img 
                          src={collection.preview[0]} 
                          alt={collection.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium text-gray-900 shadow-sm">
                          {collection.count} projetos
                        </div>
                      </div>
                      <h3 className="text-base font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                        {collection.name}
                      </h3>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  }
                  title="Nenhuma coleção criada"
                  description="Organize seus projetos favoritos em coleções temáticas"
                  buttonText="Criar coleção"
                  onButtonClick={() => console.log('Criar coleção')}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de Edição */}
      {editingProject && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setEditingProject(null)}
        >
          <div
            className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-8 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Editar Projeto</h2>
                  <p className="text-gray-500 text-sm mt-1">Atualize as informações do projeto</p>
                </div>
                <button
                  onClick={() => setEditingProject(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            {/* Conteúdo com scroll */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="space-y-8">
                {/* Seção 1: Informações básicas */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">
                    Informações Básicas
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Nome do Projeto *
                      </label>
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                        placeholder="Ex: Casa Moderna"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Localização *
                      </label>
                      <input
                        type="text"
                        value={editingProject.location}
                        onChange={(e) => setEditingProject({...editingProject, location: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                        placeholder="Ex: São Paulo, Brasil"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Descrição
                      </label>
                      <textarea
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none text-sm"
                        placeholder="Descreva o projeto..."
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 2: Detalhes técnicos */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">
                    Detalhes Técnicos
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Arquiteto
                      </label>
                      <input
                        type="text"
                        value={editingProject.architect}
                        onChange={(e) => setEditingProject({...editingProject, architect: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                        placeholder="Nome do arquiteto"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Ano
                      </label>
                      <input
                        type="text"
                        value={editingProject.year}
                        onChange={(e) => setEditingProject({...editingProject, year: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                        placeholder="2024"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        value={editingProject.status}
                        onChange={(e) => setEditingProject({...editingProject, status: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm appearance-none bg-white"
                      >
                        <option value="">Selecione o status</option>
                        <option value="Em planejamento">Em planejamento</option>
                        <option value="Em construção">Em construção</option>
                        <option value="Concluído">Concluído</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Categoria
                      </label>
                      <select
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({...editingProject, category: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm appearance-none bg-white"
                      >
                        <option value="residencial">Residencial</option>
                        <option value="comercial">Comercial</option>
                        <option value="cultural">Cultural</option>
                        <option value="religioso">Religioso</option>
                        <option value="industrial">Industrial</option>
                        <option value="urbano">Urbano</option>
                        <option value="publico">Público</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Estilo Arquitetônico
                      </label>
                      <input
                        type="text"
                        value={editingProject.style || ''}
                        onChange={(e) => setEditingProject({...editingProject, style: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                        placeholder="Ex: Modernista"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Tipo de Uso
                      </label>
                      <select
                        value={editingProject.usage_type}
                        onChange={(e) => setEditingProject({...editingProject, usage_type: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm appearance-none bg-white"
                      >
                        <option value="">Selecione o tipo de uso</option>
                        <option value="Residencial">Residencial</option>
                        <option value="Comercial">Comercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Religioso">Religioso</option>
                        <option value="Público">Público</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Área Construída (m²)
                      </label>
                      <input
                        type="number"
                        value={editingProject.build_area}
                        onChange={(e) => setEditingProject({...editingProject, build_area: e.target.value})}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Área do Terreno (m²)
                      </label>
                      <input
                        type="number"
                        value={editingProject.terrain_area}
                        onChange={(e) => setEditingProject({...editingProject, terrain_area: e.target.value})}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Materiais */}
                    <div className="md:col-span-2 space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Materiais Utilizados
                      </label>
                      <div className="space-y-3">
                        {editingProject.materials?.map((material: string, index: number) => (
                          <div key={index} className="flex items-center space-x-3 group">
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                value={material}
                                onChange={(e) => {
                                  const newMaterials = [...editingProject.materials];
                                  newMaterials[index] = e.target.value;
                                  setEditingProject({...editingProject, materials: newMaterials});
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                                placeholder={`Material ${index + 1}`}
                              />
                              {editingProject.materials.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newMaterials = editingProject.materials.filter((_: any, i: number) => i !== index);
                                    setEditingProject({...editingProject, materials: newMaterials});
                                  }}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-black"
                                >
                                  <i className="fas fa-times text-sm"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject({
                              ...editingProject,
                              materials: [...(editingProject.materials || []), '']
                            });
                          }}
                          className="text-sm text-gray-600 hover:text-black transition-colors flex items-center"
                        >
                          <i className="fas fa-plus mr-2 text-xs"></i>
                          Adicionar material
                        </button>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Tags (separadas por vírgula)
                      </label>
                      <input
                        type="text"
                        value={editingProject.tags?.join(', ') || ''}
                        onChange={(e) => setEditingProject({
                          ...editingProject, 
                          tags: e.target.value.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                        placeholder="Ex: moderno, minimalista, sustentável"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer com botões */}
            <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 px-8 py-5">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setEditingProject(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de Estado Vazio
const EmptyState = ({ icon, title, description, buttonText, onButtonClick }: any) => (
  <div className="flex flex-col items-center justify-center py-24 px-6">
    <div className="mb-6 opacity-80">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 mb-8 text-center max-w-md leading-relaxed">
      {description}
    </p>
    {buttonText && (
      <button 
        onClick={onButtonClick}
        className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {buttonText}
      </button>
    )}
  </div>
);

export default ProjectGallery;
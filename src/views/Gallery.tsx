import { useState, useEffect } from 'react';
import Btncriarprojeto from "../components/BtnCriarProjeto";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Gallery() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [likes, setLikes] = useState<{ [key: number]: number }>({});
  const [likedProjects, setLikedProjects] = useState<number[]>([]);

  // Obras arquitetônicas reais famosas
  const architecturalWorks: any[] = [
    {
      id: 1,
      title: "Meu Projeto Residencial",
      location: "Brasília, Brasil",
      architect: "Você",
      year: "2024",
      description: "Projeto residencial moderno com conceitos sustentáveis e design minimalista. Integração perfeita entre espaços internos e externos.",
      imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800",
      category: "residencial",
      style: "contemporâneo",
      tags: ["moderno", "sustentável", "minimalista"],
      isUserProject: true,
      likes: 45
    },
    {
      id: 2,
      title: "Mansão dos Arcos",
      location: "Jundiaí, Brasil",
      architect: "Paulo Mendes da Rocha",
      year: "1998",
      description: "Residência projetada pelo renomado arquiteto brasileiro, caracterizada por seus arcos de concreto aparente que integram o interior com a paisagem externa.",
      imageUrl: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800",
      category: "residencial",
      style: "brutalista",
      tags: ["concreto", "moderno", "brasil"],
      isUserProject: true,
      likes: 127
    },
    {
      id: 3,
      title: "Museu de Arte de São Paulo",
      location: "São Paulo, Brasil",
      architect: "Lina Bo Bardi",
      year: "1968",
      description: "Icone da arquitetura moderna brasileira, famoso por seu vão livre de 74 metros e estrutura suspensa.",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800",
      category: "cultural",
      style: "modernista",
      tags: ["concreto", "moderno", "brasil"],
      isUserProject: true,
      likes: 243
    },
  ];

  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  function getUsers(user: string) {
    setSearchTerm(user);

    if (!user.trim()) {
      setUsers(architecturalWorks); 
      return;
    }
  
    axios.get(`${import.meta.env.VITE_API_URL}/users`, { 
      params: { name: user } 
    })
      .then((response) => {
        setUsers(response.data);
      });
  }

  function getProjects(project: string) {
    setSearchTerm(project);

    if (!project.trim()) {
      setProjects(architecturalWorks); 
      return;
    }
  
    axios.get(`${import.meta.env.VITE_API_URL}/projects`, { 
      params: { title: project } 
    })
      .then((response) => {
        setProjects(response.data);
      });
  }

  const [works, setWorks] = useState<any>(architecturalWorks);

  useEffect(() => {
    const initialLikes: { [key: number]: number } = {};
    works.forEach((work: any) => {
      initialLikes[work.id] = work.likes || 0;
    });
    setLikes(initialLikes);
  }, []);

  // Fechar modal com ESC
  useEffect(() => {
    const checkUserLogged = async () => {
      const idUser = localStorage.getItem('idUser');

      if (idUser) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${idUser}`);
          const user = response.data;

          if (user.nickname) {
            navigate(`/profile/${user.nickname}`);
          } else {
            navigate('/profile/nickname');
          }

          return;
        } catch (error: any) {
          console.error("Erro ao verificar usuário:", error);
          localStorage.removeItem('idUser');
        }
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingProject(null);
      }
    };
    window.addEventListener('keydown', handleEsc);

    checkUserLogged()

    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const filteredWorks = works.filter((work: any) => {
    if (filter !== 'all' && work.category !== filter) return false;

    return true;
  });

  // Função para lidar com a criação de novo projeto
  const handleNewProjectCreated = (projectData: any) => {
    const newWork = {
      id: works.length + 1,
      ...projectData,
      imageUrl: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800",
      isUserProject: true,
      likes: 0
    };

    setWorks([...works, newWork]);
  };

  // Função para favoritar
  const toggleFavorite = (workId: number) => {
    setFavorites(prev => 
      prev.includes(workId) 
        ? prev.filter(id => id !== workId)
        : [...prev, workId]
    );
  };

  // Função para dar like
  const toggleLike = (workId: number) => {
    if (likedProjects.includes(workId)) {
      // Remover like
      setLikedProjects(prev => prev.filter(id => id !== workId));
      setLikes(prev => ({
        ...prev,
        [workId]: Math.max((prev[workId] || 0) - 1, 0)
      }));
    } else {
      // Adicionar like
      setLikedProjects(prev => [...prev, workId]);
      setLikes(prev => ({
        ...prev,
        [workId]: (prev[workId] || 0) + 1
      }));
    }
  };

  // Função para editar projeto
  const handleEditProject = (work: any) => {
    console.log('Editando projeto:', work);
    setEditingProject({
      ...work,
      // Garantir que todos os campos existam
      materials: work.materials || [''],
      status: work.status || '',
      build_area: work.build_area || '',
      terrain_area: work.terrain_area || '',
      usage_type: work.usage_type || '',
    });
  };

  // Função para salvar edição
  const handleSaveEdit = () => {
    if (!editingProject) return;

    setWorks(works.map((work: any) => 
      work.id === editingProject.id ? editingProject : work
    ));
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

                <Btncriarprojeto onProjectCreated={handleNewProjectCreated} />
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
                      placeholder="Buscar obras, arquitetos ou localizações..."
                      value={searchTerm}
                      onChange={(e) => {
                        getUsers(e.target.value)
                        getProjects(e.target.value)
                      }}
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
              <Btncriarprojeto onProjectCreated={handleNewProjectCreated} />
            </div>
          ) : viewMode === 'grid' ? (
            // Grade responsiva com diferentes breakpoints
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {
                users.map((user: any) => (
                  <div className="" key={user.id}>
                    <img src={ user.photoUrl } />
                    <h2>{ user.name }</h2>
                  </div>
                ))
              }

              {projects.map((work: any) => (
                <div
                  key={work.id}
                  className="bg-white rounded-lg border border-gray-300 overflow-hidden hover:shadow-md transition-all duration-300 group"
                >
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    <img
                      src={work.photo_url}
                      alt={work.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Botão de editar (somente para projetos do usuário) */}
                    {work.isUserProject && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProject(work);
                        }}
                        className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-md hover:shadow-lg z-10"
                        title="Editar projeto"
                      >
                        <i className="fas fa-edit text-gray-700 text-xs"></i>
                      </button>
                    )}

                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium rounded-full border border-gray-300">
                        {work.usage_type}
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
                      <button 
                        onClick={() => toggleFavorite(work.id)}
                        className={`flex-shrink-0 ml-2 transition-colors ${
                          favorites.includes(work.id) 
                            ? 'text-yellow-400 hover:text-yellow-500' 
                            : 'text-gray-400 hover:text-yellow-400'
                        }`}
                      >
                        <i className={`${favorites.includes(work.id) ? 'fas' : 'far'} fa-star text-sm sm:text-base`}></i>
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
                        <div className="text-sm font-medium text-gray-900 truncate">Dono do projeto</div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-xs text-gray-500 mb-1">Ano</div>
                        <div className="text-sm font-medium text-gray-900">2024</div>
                      </div>
                    </div>

                    {/* Botão de Like */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1 flex-1">
                        {work.tags.slice(0, 2).map((tag: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded truncate max-w-[70px] sm:max-w-[90px]">
                            {tag}
                          </span>
                        ))}
                        {work.tags.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{work.tags.length - 2}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => toggleLike(work.id)}
                        className={`flex items-center space-x-1 transition-colors ml-2 ${
                          likedProjects.includes(work.id)
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <i className={`${likedProjects.includes(work.id) ? 'fas' : 'far'} fa-heart text-sm`}></i>
                        <span className="text-xs font-medium">{likes[work.id] || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Lista responsiva
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {filteredWorks.map((work: any, index: number) => (
                <div
                  key={work.id}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${index !== filteredWorks.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Imagem */}
                    <div
                      className="lg:w-1/4 cursor-pointer group relative"
                      onClick={() => setSelectedImage(work)}
                    >
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={work.imageUrl}
                          alt={work.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        
                        {/* Botão de editar para projetos do usuário */}
                        {work.isUserProject && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProject(work);
                            }}
                            className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-md hover:shadow-lg z-10"
                            title="Editar projeto"
                          >
                            <i className="fas fa-edit text-gray-700 text-xs"></i>
                          </button>
                        )}

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

            //               <div className="flex flex-wrap items-center gap-4 mb-3 text-gray-600">
            //                 <div className="flex items-center">
            //                   <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
            //                   <span>{work.location}</span>
            //                 </div>
            //                 <div className="flex items-center">
            //                   <i className="fas fa-user-tie mr-2 text-gray-400"></i>
            //                   <span className="font-medium">{work.architect}</span>
            //                 </div>
            //                 <div className="flex items-center">
            //                   <i className="fas fa-palette mr-2 text-gray-400"></i>
            //                   <span>{work.style}</span>
            //                 </div>
            //               </div>

            //               <p className="text-gray-700 mb-4 line-clamp-2">
            //                 {work.description}
            //               </p>
            //             </div>

                        {/* Ações */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleFavorite(work.id)}
                            className={`transition-colors p-2 ${
                              favorites.includes(work.id)
                                ? 'text-yellow-400 hover:text-yellow-500'
                                : 'text-gray-400 hover:text-yellow-400'
                            }`}
                            title="Favoritar"
                          >
                            <i className={`${favorites.includes(work.id) ? 'fas' : 'far'} fa-star text-lg`}></i>
                          </button>
                          <button
                            onClick={() => toggleLike(work.id)}
                            className={`flex items-center space-x-1 transition-colors p-2 ${
                              likedProjects.includes(work.id)
                                ? 'text-red-500 hover:text-red-600'
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                            title="Curtir"
                          >
                            <i className={`${likedProjects.includes(work.id) ? 'fas' : 'far'} fa-heart text-lg`}></i>
                            <span className="text-sm font-medium">{likes[work.id] || 0}</span>
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
          )
          }
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
                          selectedImage.category === 'cultural' ? 'Cultural' :
                            selectedImage.category === 'religioso' ? 'Religioso' : 'Comercial'}
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
                    onClick={() => toggleFavorite(selectedImage.id)}
                    className={`px-3 sm:px-4 py-2 border border-gray-300 rounded-lg transition-colors text-sm sm:text-base ${
                      favorites.includes(selectedImage.id)
                        ? 'bg-yellow-50 border-yellow-400 text-yellow-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`${favorites.includes(selectedImage.id) ? 'fas' : 'far'} fa-star mr-2`}></i>
                    {favorites.includes(selectedImage.id) ? 'Favoritado' : 'Favoritar'}
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
                        <option value="cultural">Cultural</option>
                        <option value="religioso">Religioso</option>
                        <option value="comercial">Comercial</option>
                        <option value="industrial">Industrial</option>
                        <option value="publico">Público</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Estilo Arquitetônico
                      </label>
                      <input
                        type="text"
                        value={editingProject.style}
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
}
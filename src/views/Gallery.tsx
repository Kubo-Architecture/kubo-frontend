import { useState, useEffect } from 'react';
import Btncriarprojeto from "../components/BtnCriarProjeto";
import axios from 'axios';
import SearchBar from '../components/Searchbar';
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

  const [users, setUsers] = useState<any[]>([
    {
      id: 1,
      name: "Oscar Niemeyer",
      nickname: "oscarniem",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100",
      role: "Arquiteto",
      verified: true,
      projectCount: 156
    },
    {
      id: 2,
      name: "Lina Bo Bardi",
      nickname: "linabobardi",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100",
      role: "Arquiteta",
      verified: true,
      projectCount: 89
    },
    {
      id: 3,
      name: "Paulo Mendes",
      nickname: "paulomendes",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100",
      role: "Arquiteto",
      verified: true,
      projectCount: 124
    },
    {
      id: 4,
      name: "Ana Costa",
      nickname: "anacosta",
      photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100",
      role: "Designer",
      verified: false,
      projectCount: 45
    },
    {
      id: 5,
      name: "Roberto Silva",
      nickname: "robertosilva",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100",
      role: "Engenheiro",
      verified: false,
      projectCount: 32
    }
  ]);
  
  const [projects, setProjects] = useState<any[]>([]);
  const [works, setWorks] = useState<any[]>([]);

  function getUsers(user: string) {
    if (!user.trim()) {
      return;
    }

    const searchQuery = user.startsWith('@') ? user.slice(1) : user;
  
    axios.get(`${import.meta.env.VITE_API_URL}/users`, { 
      params: { name: searchQuery } 
    })
      .then((response) => {
        const apiUsers = response.data || [];
        const exampleUsers = [
          {
            id: 1,
            name: "Oscar Niemeyer",
            nickname: "oscarniem",
            photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100",
            role: "Arquiteto",
            verified: true,
            projectCount: 156
          },
          {
            id: 2,
            name: "Lina Bo Bardi",
            nickname: "linabobardi",
            photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100",
            role: "Arquiteta",
            verified: true,
            projectCount: 89
          },
          {
            id: 3,
            name: "Paulo Mendes",
            nickname: "paulomendes",
            photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100",
            role: "Arquiteto",
            verified: true,
            projectCount: 124
          },
          {
            id: 4,
            name: "Ana Costa",
            nickname: "anacosta",
            photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100",
            role: "Designer",
            verified: false,
            projectCount: 45
          },
          {
            id: 5,
            name: "Roberto Silva",
            nickname: "robertosilva",
            photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100",
            role: "Engenheiro",
            verified: false,
            projectCount: 32
          }
        ];
        
        setUsers([...apiUsers, ...exampleUsers]);
      })
      .catch(() => {
        setUsers([
          {
            id: 1,
            name: "Oscar Niemeyer",
            nickname: "oscarniem",
            photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100",
            role: "Arquiteto",
            verified: true,
            projectCount: 156
          },
          {
            id: 2,
            name: "Lina Bo Bardi",
            nickname: "linabobardi",
            photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100",
            role: "Arquiteta",
            verified: true,
            projectCount: 89
          },
          {
            id: 3,
            name: "Paulo Mendes",
            nickname: "paulomendes",
            photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100",
            role: "Arquiteto",
            verified: true,
            projectCount: 124
          },
          {
            id: 4,
            name: "Ana Costa",
            nickname: "anacosta",
            photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100",
            role: "Designer",
            verified: false,
            projectCount: 45
          },
          {
            id: 5,
            name: "Roberto Silva",
            nickname: "robertosilva",
            photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100",
            role: "Engenheiro",
            verified: false,
            projectCount: 32
          }
        ]);
      });
  }

  function getProjects(project: string) {
    if (!project.trim()) {
      // Recarrega todos os projetos quando a busca está vazia
      axios.get(`${import.meta.env.VITE_API_URL}/projects`)
        .then((response) => {
          setProjects(response.data);
          setWorks(response.data);
        })
        .catch((error) => {
          console.error("Erro ao carregar projetos:", error);
          setProjects([]);
          setWorks([]);
        });
      return;
    }
  
    // Busca por nome ou localização
    axios.get(`${import.meta.env.VITE_API_URL}/projects`, { 
      params: { name: project, location: project } 
    })
      .then((response) => {
        setProjects(response.data);
        setWorks(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar projetos:", error);
        setProjects([]);
        setWorks([]);
      });
  }

  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    getUsers(searchValue);
    getProjects(searchValue);
  };

  useEffect(() => {
    const initialLikes: { [key: number]: number } = {};
    works.forEach((work: any) => {
      initialLikes[work.id] = work.likes || 0;
    });
    setLikes(initialLikes);
  }, [works]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects`);
        setProjects(response.data);
        setWorks(response.data);
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        setProjects([]);
        setWorks([]);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    const checkUserLogged = async () => {
      const idUser = localStorage.getItem('idUser');

      if (idUser) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${idUser}`);
          const user = response.data;

          if (!user.nickname) {
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

  // Debug - logs para verificar o estado
  useEffect(() => {
    console.log('Projects atualizado:', projects.length);
    console.log('Works atualizado:', works.length);
  }, [projects, works]);

  const filteredWorks = works.filter((work: any) => {
    if (filter !== 'all' && work.category !== filter && work.usage_type !== filter) return false;
    return true;
  });

  const handleNewProjectCreated = (projectData: any) => {
    console.log('Novo projeto recebido:', projectData);
    
    // Formatar o projeto para o padrão esperado
    const newProject = {
      id: projectData.id,
      title: projectData.name,
      name: projectData.name,
      location: projectData.location,
      description: projectData.description,
      photo_url: projectData.photo_url,
      imageUrl: projectData.photo_url,
      category: projectData.usage_type,
      usage_type: projectData.usage_type,
      status: projectData.status,
      build_area: projectData.build_area,
      terrain_area: projectData.terrain_area,
      materials: projectData.materials,
      architect: projectData.architect || 'Dono do projeto',
      year: projectData.year || new Date().getFullYear(),
      tags: projectData.tags || [],
      likes: 0,
      isUserProject: true,
      idUser: projectData.idUser
    };

    // Atualizar estados IMEDIATAMENTE
    setProjects(prev => [newProject, ...prev]);
    setWorks(prev => [newProject, ...prev]);
    
    // Inicializar likes para o novo projeto
    setLikes(prev => ({
      ...prev,
      [newProject.id]: 0
    }));

    console.log('Projeto adicionado localmente');
    
    // Recarregar da API em background para sincronizar
    setTimeout(() => {
      axios.get(`${import.meta.env.VITE_API_URL}/projects`)
        .then((response) => {
          setProjects(response.data);
          setWorks(response.data);
          console.log('Projetos recarregados da API');
        })
        .catch((error) => {
          console.error("Erro ao recarregar projetos:", error);
        });
    }, 500);
  };

  const toggleFavorite = (workId: number) => {
    setFavorites(prev => 
      prev.includes(workId) 
        ? prev.filter(id => id !== workId)
        : [...prev, workId]
    );
  };

  const toggleLike = (workId: number) => {
    if (likedProjects.includes(workId)) {
      setLikedProjects(prev => prev.filter(id => id !== workId));
      setLikes(prev => ({
        ...prev,
        [workId]: Math.max((prev[workId] || 0) - 1, 0)
      }));
    } else {
      setLikedProjects(prev => [...prev, workId]);
      setLikes(prev => ({
        ...prev,
        [workId]: (prev[workId] || 0) + 1
      }));
    }
  };

  const handleEditProject = (work: any) => {
    console.log('Editando projeto:', work);
    setEditingProject({
      ...work,
      materials: work.materials || [''],
      status: work.status || '',
      build_area: work.build_area || '',
      terrain_area: work.terrain_area || '',
      usage_type: work.usage_type || '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8">
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

                <Btncriarprojeto onProjectCreated={handleNewProjectCreated} />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  onSearch={handleSearch}
                  users={users}
                  projects={projects}
                />
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
                    onClick={() => setFilter('Residencial')}
                    className={`px-4 pr-7 py-2 text-xs sm:text-sm font-medium rounded-md transition-all flex-1 min-w-[60px] sm:min-w-[80px] ${filter === 'Residencial'
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Residencial
                  </button>
                  <button
                    onClick={() => setFilter('Cultural')}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all flex-1 min-w-[60px] sm:min-w-[80px] ${filter === 'Cultural'
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    Cultural
                  </button>
                  <button
                    onClick={() => setFilter('Religioso')}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all flex-1 min-w-[60px] sm:min-w-[80px] ${filter === 'Religioso'
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
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {filteredWorks.map((work: any) => (
                <div
                  key={work.id}
                  className="bg-white rounded-lg border border-gray-300 overflow-hidden hover:shadow-md transition-all duration-300 group"
                >
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    <img
                      src={work.photo_url || work.imageUrl}
                      alt={work.name || work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    
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
                        {work.usage_type || work.category}
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
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">{work.title || work.name}</h3>
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
                        <div className="text-sm font-medium text-gray-900 truncate">{work.architect || 'Dono do projeto'}</div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-xs text-gray-500 mb-1">Ano</div>
                        <div className="text-sm font-medium text-gray-900">{work.year || '2024'}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1 flex-1">
                        {work.tags?.slice(0, 2).map((tag: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded truncate max-w-[70px] sm:max-w-[90px]">
                            {tag}
                          </span>
                        ))}
                        {work.tags && work.tags.length > 2 && (
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {filteredWorks.map((work: any, index: number) => (
                <div
                  key={work.id}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${index !== filteredWorks.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  {/* Adicione o conteúdo do modo lista aqui se necessário */}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
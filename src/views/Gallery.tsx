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

  // Carregar projetos ao montar o componente
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/projects`)
      .then((response) => {
        setProjects(response.data);
        setWorks(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar projetos:", error);
      });
  }, []);

  useEffect(() => {
    const initialLikes: { [key: number]: number } = {};
    works.forEach((work: any) => {
      initialLikes[work.id] = work.likes || 0;
    });
    setLikes(initialLikes);
  }, [works]);

  useEffect(() => {
    const checkUserLogged = async () => {
      const userId = localStorage.getItem('userId');

      if (userId) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`);
          const user = response.data;

          if (!user.nickname) {
            navigate('/profile/nickname');
          }

          return;
        } catch (error: any) {
          console.error("Erro ao verificar usuário:", error);
          localStorage.removeItem('userId');
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
    if (filter !== 'all' && work.category !== filter && work.usage_type !== filter) return false;
    return true;
  });

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
    <div className="min-h-screen bg-gray-50 dark:bg-[#151B23]">
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Galeria de Obras
                </h1>
                <p className="text-gray-600 dark:text-neutral-400 text-sm sm:text-base mt-1">
                  Explore arquitetura icônica mundial
                </p>
              </div>

              <div className="flex items-center space-x-3 self-start sm:self-center">
                <div className="flex space-x-1 bg-white dark:bg-[#202830] border border-gray-300 dark:border-[#3d444d] p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors cursor-pointer ${viewMode === 'grid'
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#151B23]'
                      }`}
                    title="Grade"
                  >
                    <i className="fas fa-th-large text-sm sm:text-base"></i>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded cursor-pointer transition-colors ${viewMode === 'list'
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#151B23]'
                      }`}
                    title="Lista"
                  >
                    <i className="fas fa-list text-sm sm:text-base"></i>
                  </button>
                </div>

                <Btncriarprojeto />
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
                <div className="flex flex-wrap gap-1 bg-white dark:bg-[#202830] border border-gray-300 dark:border-[#3d444d] rounded-lg p-1 w-full sm:w-auto self-start">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md cursor-pointer transition-all flex-1 min-w-[60px] sm:min-w-[80px] ${filter === 'all'
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#151B23]'
                      }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFilter('Residencial')}
                    className={`px-4 pr-7 py-2 text-xs sm:text-sm font-medium cursor-pointer rounded-md transition-all flex-1 min-w-[60px] sm:min-w-[80px] ${filter === 'Residencial'
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#151B23]'
                      }`}
                  >
                    Residencial
                  </button>
                  <button
                    onClick={() => setFilter('Cultural')}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md cursor-pointer transition-all flex-1 min-w-[60px] sm:min-w-[80px] ${filter === 'Cultural'
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#151B23]'
                      }`}
                  >
                    Cultural
                  </button>
                  <button
                    onClick={() => setFilter('Religioso')}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md cursor-pointer transition-all flex-1 min-w-[60px] sm:min-w-[80px] ${filter === 'Religioso'
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#151B23]'
                      }`}
                  >
                    Religioso
                  </button>
                </div>
              </div>
            </div>
          </div>

          {filteredWorks.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-white dark:bg-[#151B23] min-h-52 rounded-lg border border-gray-300 dark:border-[#3d444d]">
              <i className="fas fa-building text-gray-300 dark:text-neutral-600 text-4xl sm:text-5xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
                Nenhuma obra encontrada
              </h3>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {filteredWorks.map((work: any) => (
                <div
                  key={work.id}
                  className="bg-white dark:bg-[#151B23] rounded-lg border border-gray-300 dark:border-[#3d444d] overflow-hidden hover:shadow-md transition-all duration-300 group"
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
                        className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center bg-white/90 dark:bg-[#202830]/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-[#202830] transition-all shadow-md hover:shadow-lg z-10"
                        title="Editar projeto"
                      >
                        <i className="fas fa-edit text-gray-700 dark:text-neutral-400 text-xs"></i>
                      </button>
                    )}

                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-white/90 dark:bg-[#202830]/90 backdrop-blur-sm text-gray-900 dark:text-neutral-400 text-xs font-medium rounded-full border border-gray-300 dark:border-[#3d444d]">
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
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-1">{work.title || work.name}</h3>
                      <button 
                        onClick={() => toggleFavorite(work.id)}
                        className={`flex-shrink-0 ml-2 transition-colors ${
                          favorites.includes(work.id) 
                            ? 'text-yellow-400 hover:text-yellow-500' 
                            : 'text-gray-400 dark:text-neutral-500 hover:text-yellow-400 dark:hover:text-yellow-400'
                        }`}
                      >
                        <i className={`${favorites.includes(work.id) ? 'fas' : 'far'} fa-star text-sm sm:text-base`}></i>
                      </button>
                    </div>

                    <div className="flex items-center text-gray-600 dark:text-neutral-400 text-xs sm:text-sm mb-3">
                      <i className="fas fa-map-marker-alt mr-2 text-gray-400 dark:text-neutral-500 flex-shrink-0"></i>
                      <span className="truncate">{work.location}</span>
                    </div>

                    <p className="text-gray-600 dark:text-neutral-400 text-xs sm:text-sm mb-4 line-clamp-2">{work.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-[#3d444d]">
                      <div className="min-w-0">
                        <div className="text-xs text-gray-500 dark:text-neutral-500 mb-1 truncate">Arquiteto</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-neutral-400 truncate">{work.architect || 'Dono do projeto'}</div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-xs text-gray-500 dark:text-neutral-500 mb-1">Ano</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-neutral-400">{work.year || '2024'}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1 flex-1">
                        {work.tags?.slice(0, 2).map((tag: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-[#202830] text-gray-600 dark:text-neutral-400 text-xs rounded truncate max-w-[70px] sm:max-w-[90px]">
                            {tag}
                          </span>
                        ))}
                        {work.tags && work.tags.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-[#202830] text-gray-600 dark:text-neutral-400 text-xs rounded">
                            +{work.tags.length - 2}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => toggleLike(work.id)}
                        className={`flex items-center space-x-1 transition-colors ml-2 ${
                          likedProjects.includes(work.id)
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-gray-500 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-500'
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
            <div className="bg-white dark:bg-[#151B23] rounded-xl shadow-sm border border-gray-200 dark:border-[#3d444d] overflow-hidden">
              {filteredWorks.map((work: any, index: number) => (
                <div
                  key={work.id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-[#202830] transition-colors duration-200 ${index !== filteredWorks.length - 1 ? 'border-b border-gray-100 dark:border-[#3d444d]' : ''}`}
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
import { useState, useEffect, useRef } from 'react';
import CreateProjectButton from '../components/CreateProjectButton';
import axios from 'axios';
import SearchBar from '../components/Searchbar';
import { useNavigate } from 'react-router-dom';
import { getUserIdFromToken } from '../utils/jwt';
import ProjectCard from '../components/Profile/ProjectCard';

interface GalleryProps {
  onInitialLoadComplete?: () => void;
}

export default function Gallery({ onInitialLoadComplete }: GalleryProps) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('galleryViewMode') || 'grid';
  });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [works, setWorks] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const FEED_PAGE_SIZE = 20;

  const loadFeedProjects = async (pageToLoad: number = 1) => {
    if (isLoading || !hasMore) return;

    const userId = getUserIdFromToken();
    if (!userId) {
      if (pageToLoad === 1 && onInitialLoadComplete) {
        onInitialLoadComplete();
      }
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/projects/gallery/${userId}`,
        {
          params: {
            page: pageToLoad,
            limit: FEED_PAGE_SIZE,
          },
        }
      );

      const newProjects = response.data || [];

      setWorks((prev) =>
        pageToLoad === 1 ? newProjects : [...prev, ...newProjects]
      );

      setPage(pageToLoad);
      if (newProjects.length < FEED_PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
    } finally {
      setIsLoading(false);
      if (pageToLoad === 1 && onInitialLoadComplete) {
        onInitialLoadComplete();
      }
    }
  };

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
        
        setUsers(apiUsers);
      })
      .catch(() => {
        setUsers([]);
      });
  }

  function getProjects(project: string) {
    if (!project.trim()) {
      setUsers([]);
      setProjects([]);
      return;
    }

    const userId = getUserIdFromToken();

    axios.get(`${import.meta.env.VITE_API_URL}/projects`, {
      params: {
        title: project,
        userId: userId || undefined,
      },
    })
      .then((response) => {
        const apiProjects = response.data || [];
        setProjects(apiProjects);
      })
      .catch(() => {
        setProjects([]);
      });
  }

  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    if (searchValue.startsWith('@')) {
      getUsers(searchValue);
    } else {
      getUsers('');
      getProjects(searchValue);
    }
  };

  // Função para atualizar as curtidas de um projeto específico
  const updateProjectLikes = async (projectId: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${projectId}`);
      setWorks(prev => prev.map(work => 
        work.id === projectId || work._id === projectId
          ? { ...work, likes: response.data.likes }
          : work
      ));
    } catch (error) {
      console.error('Error updating project likes:', error);
    }
  };

  useEffect(() => {
    loadFeedProjects(1);
  }, []);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (
          firstEntry.isIntersecting &&
          hasMore &&
          !isLoading &&
          !searchTerm.trim()
        ) {
          loadFeedProjects(page + 1);
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0,
      }
    );

    const current = loaderRef.current;
    observer.observe(current);

    return () => {
      observer.unobserve(current);
      observer.disconnect();
    };
  }, [hasMore, isLoading, page, searchTerm]);

  // Atualiza os projetos quando a página volta ao foco
  useEffect(() => {
    const handleFocus = () => {
      if (!searchTerm.trim() && works.length > 0) {
        // Atualiza todos os projetos visíveis
        works.forEach(work => {
          updateProjectLikes(work.id || work._id);
        });
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [works, searchTerm]);

  useEffect(() => {
    const checkUserLogged = async () => {
      const userId = getUserIdFromToken();

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
          localStorage.removeItem('token');
        }
      }
    };

    checkUserLogged()

    return () => {};
  }, []);

  const safeWorks = Array.isArray(works) ? works : [];

  const filteredWorks = safeWorks.filter((work: any) => {
    if (filter === 'all') return true;
    const usageTypes = work.usage_type
      ? String(work.usage_type).split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];
    if (usageTypes.includes(filter)) return true;
    if (work.category === filter) return true;
    return false;
  });

  const isInitialLoading =
    isLoading &&
    !searchTerm.trim() &&
    page === 1 &&
    safeWorks.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#151B23]">
      <main className="pt-20 pb-8">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
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
                    onClick={() => {
                      setViewMode('grid');
                      localStorage.setItem('galleryViewMode', 'grid');
                    }}
                    className={`p-2 rounded transition-colors cursor-pointer ${viewMode === 'grid'
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#151B23]'
                      }`}
                    title="Grade"
                  >
                    <i className="fas fa-th-large text-sm sm:text-base"></i>
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('list');
                      localStorage.setItem('galleryViewMode', 'list');
                    }}
                    className={`p-2 rounded cursor-pointer transition-colors ${viewMode === 'list'
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#151B23]'
                      }`}
                    title="Lista"
                  >
                    <i className="fas fa-list text-sm sm:text-base"></i>
                  </button>
                </div>

                <CreateProjectButton/>
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

          {isInitialLoading ? null : filteredWorks.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-white dark:bg-[#151B23] min-h-52 rounded-lg border border-gray-300 dark:border-[#3d444d]">
              <i className="fas fa-building text-gray-300 dark:text-neutral-600 text-4xl sm:text-5xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
                Nenhuma obra encontrada
              </h3>
            </div>
          ) : viewMode === 'grid' ? (
            <>
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {filteredWorks.map((work: any) => (
                  <div key={work.id} className="group">
                    <ProjectCard project={work} />
                  </div>
                ))}
              </div>

              {/* Sentinela sempre visível para manter o layout; o ref só é usado quando não está pesquisando */}
              <div
                ref={!searchTerm.trim() ? loaderRef : null}
                className="h-12 flex items-center justify-center mt-6 mb-4 text-xs text-gray-500 dark:text-neutral-500"
              >
                {!searchTerm.trim() && (isLoading
                  ? 'Carregando mais projetos...'
                  : !hasMore ? '' : '')}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {filteredWorks.map((work: any) => (
                  <div 
                    key={work.id} 
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 bg-white dark:bg-[#1a2128] rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer group"
                    onClick={() => navigate(`/project/${work.id}`)}
                  >
                    {/* Imagem */}
                    <div className="relative flex-shrink-0 w-full sm:w-48 md:w-64 lg:w-80 h-40 sm:h-48 md:h-56 lg:h-64 rounded-lg overflow-hidden">
                      <img 
                        src={work.images?.[0]?.url || work.images?.[0] || work.photo_url || '/placeholder.jpg'} 
                        alt={work.name || work.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        {/* Título e Ano */}
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 sm:line-clamp-1">
                            {work.name || work.title}
                          </h2>
                          {work.year && (
                            <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm flex-shrink-0">
                              {work.year}
                            </span>
                          )}
                        </div>

                        {/* Metadados */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4">
                          {work.location && (
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <i className="fas fa-map-marker-alt text-xs sm:text-sm"></i>
                              <span className="truncate max-w-[120px] sm:max-w-none">{work.location}</span>
                            </div>
                          )}
                          {(work.user?.nickname || work.author) && (
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <i className="fas fa-user text-xs sm:text-sm"></i>
                              <span className="truncate max-w-[100px] sm:max-w-none">{work.user?.nickname || work.author}</span>
                            </div>
                          )}
                          {work.style && (
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <i className="fas fa-palette text-xs sm:text-sm"></i>
                              <span className="truncate max-w-[100px] sm:max-w-none">{work.style}</span>
                            </div>
                          )}
                        </div>

                        {/* Descrição */}
                        {work.description && (
                          <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 md:mb-4 line-clamp-2 sm:line-clamp-3">
                            {work.description}
                          </p>
                        )}

                        {/* Tags */}
                        {work.tags && work.tags.length > 0 && (
                          <div className="flex gap-1 sm:gap-1.5 md:gap-2 flex-wrap">
                            {work.tags.slice(0, 3).map((tag: string, index: number) => (
                              <span 
                                key={index}
                                className="px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              >
                                {tag.startsWith('#') ? tag : `#${tag}`}
                              </span>
                            ))}
                            {work.tags.length > 3 && (
                              <span className="px-2 py-0.5 text-gray-500 dark:text-gray-500 text-xs">
                                +{work.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer com info adicional */}
                      {(work.category || work.usage_type) && (
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <i className="fas fa-building text-xs sm:text-sm"></i>
                            <span className="text-xs sm:text-sm">{work.category || work.usage_type}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {!searchTerm.trim() && (
                <div
                  ref={loaderRef}
                  className="h-12 flex items-center justify-center mt-6 mb-4 text-xs text-gray-500 dark:text-neutral-500"
                >
                  {isLoading
                    ? 'Carregando mais projetos...'
                    : !hasMore && ''}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
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
  const [viewMode, setViewMode] = useState('grid');
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

      setProjects((prev) =>
        pageToLoad === 1 ? newProjects : [...prev, ...newProjects]
      );
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
      setWorks([]);
      setPage(1);
      setHasMore(true);
      loadFeedProjects(1);
      return;
    }
  
    axios.get(`${import.meta.env.VITE_API_URL}/projects`, { 
      params: { title: project } 
    })
      .then((response) => {
        const apiProjects = response.data || [];
        setProjects(apiProjects);
        setWorks(apiProjects);
      })
      .catch(() => {
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
    if (filter !== 'all' && work.category !== filter && work.usage_type !== filter) return false;
    return true;
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
          ) : (
            <div className="bg-white dark:bg-[#151B23] rounded-xl shadow-sm border border-gray-200 dark:border-[#3d444d] overflow-hidden">
              {filteredWorks.map((work: any, index: number) => (
                <div
                  key={work.id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-[#202830] transition-colors duration-200 ${index !== filteredWorks.length - 1 ? 'border-b border-gray-100 dark:border-[#3d444d]' : ''}`}
                >
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
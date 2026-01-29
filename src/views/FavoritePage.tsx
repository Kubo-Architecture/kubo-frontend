import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FavoritePage() {
  const [viewMode, setViewMode] = useState<string>(() => {
    return localStorage.getItem('favoriteViewMode') || 'grid';
  });
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [favoriteWorks, setFavoriteWorks] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [likes, setLikes] = useState<{ [key: number]: number }>({});
  const [likedProjects, setLikedProjects] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Implementar busca de favoritos da API
    // const fetchFavorites = async () => {
    //   try {
    //     setIsLoading(true);
    //     const response = await axios.get(`${import.meta.env.VITE_API_URL}/favorites`);
    //     setFavoriteWorks(response.data);
    //   } catch (error) {
    //     console.error('Erro ao carregar favoritos:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchFavorites();
    
    setFavoriteWorks([]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingProject(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
    localStorage.setItem('favoriteViewMode', mode);
  };

  const removeFromFavorites = (workId: any) => {
    setFavoriteWorks(prev => prev.filter(work => work.id !== workId));
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
    setEditingProject({
      ...work,
      materials: work.materials || [''],
      status: work.status || '',
      build_area: work.build_area || '',
      terrain_area: work.terrain_area || '',
      usage_type: work.usage_type || '',
    });
  };

  const handleSaveEdit = () => {
    if (!editingProject) return;

    setFavoriteWorks(favoriteWorks.map((work: any) => 
      work.id === editingProject.id ? editingProject : work
    ));
    setEditingProject(null);
  };

  const filteredWorks = favoriteWorks.filter(work => {
    if (filter !== 'all' && work.category !== filter) return false;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        work.title?.toLowerCase().includes(searchLower) ||
        work.location?.toLowerCase().includes(searchLower) ||
        work.architect?.toLowerCase().includes(searchLower) ||
        work.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#151B23] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-gray-400">Carregando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#151B23]">
      <main className="pt-20 pb-8">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Favoritos
                </h1>
                <p className="text-gray-600 dark:text-neutral-400 text-sm sm:text-base mt-1">
                  Suas obras arquitetônicas favoritas
                </p>
              </div>

              <div className="flex items-center space-x-3 self-start sm:self-center">
                <div className="flex space-x-1 bg-white dark:bg-[#202830] border border-gray-300 dark:border-[#3d444d] p-1 rounded-lg">
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={`p-2 rounded cursor-pointer transition-colors ${viewMode === 'grid'
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#151B23]'
                      }`}
                    title="Grade"
                  >
                    <i className="fas fa-th-large text-sm sm:text-base"></i>
                  </button>
                  <button
                    onClick={() => handleViewModeChange('list')}
                    className={`p-2 rounded cursor-pointer transition-colors ${viewMode === 'list'
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#151B23]'
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
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-search text-gray-400 dark:text-neutral-500 text-sm sm:text-base"></i>
                    </div>

                    <input
                      type="text"
                      placeholder="Buscar nos seus favoritos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-10 py-2 sm:py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none transition-shadow text-sm sm:text-base"
                    />

                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-400 transition-colors"
                      >
                        <i className="fas fa-times text-sm sm:text-base"></i>
                      </button>
                    )}
                  </div>

                  <div className="mt-3 flex items-center text-sm text-gray-600 dark:text-neutral-400">
                    <i className="fas fa-star text-yellow-500 mr-2"></i>
                    <span>{favoriteWorks.length} obra{favoriteWorks.length !== 1 ? 's' : ''} favoritada{favoriteWorks.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 bg-white dark:bg-[#202830] border border-gray-300 dark:border-[#3d444d] rounded-lg p-1 w-full sm:w-auto self-start">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-2 text-xs sm:text-sm cursor-pointer font-medium rounded-md transition-all flex-1 min-w-[60px] sm:min-w-[80px] text-center whitespace-nowrap ${filter === 'all'
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#151B23]'
                      }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFilter('Residencial')}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium cursor-pointer rounded-md transition-all flex-1 min-w-[90px] sm:min-w-[110px] text-center whitespace-nowrap ${filter === 'Residencial'
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#151B23]'
                      }`}
                  >
                    Residencial
                  </button>
                  <button
                    onClick={() => setFilter('Cultural')}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium cursor-pointer rounded-md transition-all flex-1 min-w-[60px] sm:min-w-[80px] text-center whitespace-nowrap ${filter === 'Cultural'
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-gray-700 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#151B23]'
                      }`}
                  >
                    Cultural
                  </button>
                  <button
                    onClick={() => setFilter('Religioso')}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium cursor-pointer rounded-md transition-all flex-1 min-w-[60px] sm:min-w-[80px] text-center whitespace-nowrap ${filter === 'Religioso'
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
            <div className="text-center py-12 sm:py-16 bg-white dark:bg-[#151B23] rounded-lg border border-gray-300 dark:border-[#3d444d]">
              <i className="fas fa-star text-gray-300 dark:text-neutral-600 text-4xl sm:text-5xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
                {searchTerm || filter !== 'all' ? 'Nenhum favorito encontrado' : 'Nenhum favorito ainda'}
              </h3>
              <p className="text-gray-500 dark:text-neutral-400 mb-4 text-sm sm:text-base">
                {searchTerm || filter !== 'all'
                  ? 'Tente ajustar sua busca ou filtro.'
                  : 'Explore a galeria e adicione obras aos seus favoritos!'}
              </p>
              <a
                onClick={() => navigate("/gallery")}
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-neutral-200 transition-colors"
              >
                <i className="fas fa-building mr-2"></i>
                Explorar Galeria
              </a>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-neutral-400">
              Conteúdo de favoritos será implementado aqui
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
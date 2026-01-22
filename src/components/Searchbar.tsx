import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: (searchTerm: string) => void;
  users?: any[];
  projects?: any[];
}

export default function SearchBar({ 
  searchTerm,
  setSearchTerm,
  onSearch,
  users = [],
  projects = []
}: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentUserNickname, setCurrentUserNickname] = useState<string>('');
  const searchRef = useRef<HTMLDivElement>(null);
  const currentuser = localStorage.getItem('userId');
  const navigate = useNavigate();
  
  useEffect(() => {
    getCurrentUserNickname();
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentUserNickname = async () => {
    if (!currentuser) return;
    try {
      const userData = await axios.get<any>(`${import.meta.env.VITE_API_URL}/users/${currentuser}`);
      setCurrentUserNickname(userData.data.nickname || '');
    } catch (error) {
      console.error('Erro ao buscar nickname do usuário:', error);
    }
  };

  const isUserSearch = searchTerm.startsWith('@');
  const searchQuery = isUserSearch ? searchTerm.slice(1) : searchTerm;

  const filteredUsers = isUserSearch && searchQuery.trim()
    ? users.filter(user => 
        (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.nickname?.toLowerCase().includes(searchQuery.toLowerCase())) && user.nickname !== currentUserNickname
      ).slice(0, 5)
    : [];

  const filteredProjects = !isUserSearch && searchTerm.trim()
    ? projects.filter(project => 
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location?.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  const hasSuggestions = filteredUsers.length > 0 || filteredProjects.length > 0;

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleSelectUser = (user: any) => {
    setSearchTerm(`@${user.nickname || user.name}`);
    onSearch(`@${user.nickname || user.name}`);
    navigate(`/profile/${user.nickname || user.name}`);
  };

  const handleSelectProject = (project: any) => {
    setSearchTerm(project.title);
    onSearch(project.title);
    setShowSuggestions(false);
  };

  return (
    <div className="flex-1" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <i className="fas fa-search text-gray-400 dark:text-neutral-500 text-sm sm:text-base"></i>
        </div>

        <input
          type="text"
          placeholder="Buscar obras ou @usuário..."
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
          className="w-full pl-10 sm:pl-12 pr-10 py-2 sm:py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none transition-shadow text-sm sm:text-base"
        />

        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              onSearch('');
              setShowSuggestions(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-400 transition-colors"
          >
            <i className="fas fa-times text-sm sm:text-base"></i>
          </button>
        )}

        {showSuggestions && hasSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#151B23] border border-gray-200 dark:border-[#3d444d] rounded-lg shadow-lg overflow-hidden z-50">
            {filteredUsers.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase tracking-wider">
                  Usuários
                </div>
                {filteredUsers.map((user, index) => (
                  <button
                    key={user.id || index}
                    onClick={() => handleSelectUser(user)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[#202830] transition-colors group cursor-pointer"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={user.photoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'User')}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 dark:border-[#3d444d] group-hover:border-gray-200 dark:group-hover:border-[#3d444d] transition-colors"
                      />
                      {user.verified && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-[#151B23]">
                          <i className="fas fa-check text-white text-[8px]"></i>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {user.name}
                        </span>
                        {user.role && (
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-[#202830] text-gray-600 dark:text-neutral-400 text-xs rounded-full">
                            {user.role}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-neutral-500 truncate">
                        @{user.nickname || user.name?.toLowerCase().replace(/\s+/g, '')}
                      </div>
                    </div>

                    {user.projectCount && (
                      <div className="flex-shrink-0 text-xs text-gray-400 dark:text-neutral-500">
                        <i className="fas fa-building mr-1"></i>
                        {user.projectCount}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {filteredProjects.length > 0 && (
              <div className="py-2 border-t border-gray-100 dark:border-[#3d444d]">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase tracking-wider">
                  Obras
                </div>
                {filteredProjects.map((project, index) => (
                  <button
                    key={project.id || index}
                    onClick={() => handleSelectProject(project)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[#202830] transition-colors group"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={project.photo_url || project.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=100'}
                        alt={project.title}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-[#3d444d] group-hover:border-gray-300 dark:group-hover:border-[#3d444d] transition-colors"
                      />
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {project.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-400">
                        <i className="fas fa-map-marker-alt text-[10px]"></i>
                        <span className="truncate">{project.location}</span>
                      </div>
                    </div>

                    {project.category && (
                      <div className="flex-shrink-0">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-[#202830] text-gray-600 dark:text-neutral-400 text-xs rounded-full capitalize">
                          {project.category}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setSearchTerm('brasil');
            onSearch('brasil');
            setShowSuggestions(false);
          }}
          className="text-xs px-3 py-1 bg-gray-100 dark:bg-[#202830] cursor-pointer text-gray-700 dark:text-neutral-400 rounded-full hover:bg-gray-200 dark:hover:bg-[#151B23] transition-colors"
        >
          #brasil
        </button>
        <button
          onClick={() => {
            setSearchTerm('concreto');
            onSearch('concreto');
            setShowSuggestions(false);
          }}
          className="text-xs px-3 py-1 bg-gray-100 dark:bg-[#202830] cursor-pointer text-gray-700 dark:text-neutral-400 rounded-full hover:bg-gray-200 dark:hover:bg-[#151B23] transition-colors"
        >
          #concreto
        </button>
        <button
          onClick={() => {
            setSearchTerm('modernista');
            onSearch('modernista');
            setShowSuggestions(false);
          }}
          className="text-xs px-3 py-1 bg-gray-100 dark:bg-[#202830] cursor-pointer text-gray-700 dark:text-neutral-400 rounded-full hover:bg-gray-200 dark:hover:bg-[#151B23] transition-colors"
        >
          #modernista
        </button>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import axios from 'axios';

const ProjectGallery = ({ userId, onProjectsLoaded, setIsLoadingChild }: any) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('meus-projetos');

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
      tags: ['sustentavel', 'moderno', 'ecologico']
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
      tags: ['comercial', 'corporativo', 'vidro']
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
      tags: ['urbano', 'publico', 'revitalizacao']
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
      } catch (err: any) {
        console.error("Erro ao buscar projetos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        if (setIsLoadingChild) {
          setIsLoadingChild(false);
        }
      }
    };

    if (userId) fetchProjects();
  }, [userId]);

  // Adicionar estilos globais para line-clamp e truncate
  useEffect(() => {
    const styles = `
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
      @media (max-width: 475px) {
        .xs\\:grid-cols-2 {
          grid-template-columns: repeat(2, 1fr) !important;
        }
      }
      @media (max-width: 380px) {
        .xs\\:grid-cols-2 {
          grid-template-columns: 1fr !important;
        }
      }
    `;

    if (typeof document !== 'undefined') {
      const styleSheet = document.createElement("style");
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
    }
  }, []);

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
        
        {/* Navegação de Abas - Removido padding superior excessivo */}
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
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium rounded-full border border-gray-300">
                            {project.category}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <button
                            className="text-white text-sm font-medium flex items-center hover:text-gray-200"
                          >
                            Ver detalhes
                            <i className="fas fa-arrow-right ml-2"></i>
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">{project.title}</h3>
                          <button className="text-gray-400 hover:text-black flex-shrink-0 ml-2">
                            <i className="far fa-star text-sm sm:text-base"></i>
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

                        <div className="mt-4 flex flex-wrap gap-1">
                          {project.tags.slice(0, 3).map((tag: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded truncate max-w-[80px] sm:max-w-[100px]">
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{project.tags.length - 3}
                            </span>
                          )}
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
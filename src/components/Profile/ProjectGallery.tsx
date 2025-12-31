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
    { id: 'salvos', label: 'Salvos' },
    { id: 'colecoes', label: 'Coleções' }
  ];

  // Exemplos de dados mockados
  const mockSavedProjects = [
    {
      id: 1,
      title: 'Residência Minimalista',
      author: 'Maria Silva',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
      likes: 342
    },
    {
      id: 2,
      title: 'Loft Industrial',
      author: 'João Santos',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      likes: 289
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

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navegação de Abas */}
        <div className="flex gap-8 border-b border-gray-200/60 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative pb-4 px-1 text-sm font-medium transition-all duration-200
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
        <div>
          {/* Meus Projetos */}
          {activeTab === 'meus-projetos' && (
            <>
              {(projects?.length === 0 || error) ? (
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
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects?.map((project: any) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Projetos Salvos */}
          {activeTab === 'salvos' && (
            <>
              {mockSavedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {mockSavedProjects.map((project) => (
                    <div key={project.id} className="group cursor-pointer">
                      <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden mb-4 shadow-sm hover:shadow-md transition-all duration-300">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h3 className="text-base font-medium text-gray-900 mb-1.5 group-hover:text-gray-700 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {project.author} · {project.likes} likes
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  }
                  title="Nenhum projeto salvo"
                  description="Salve projetos inspiradores para visualizar depois"
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
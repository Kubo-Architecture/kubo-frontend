import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import Loading from '../Universal/Loading';
import axios from 'axios';
import { getUserIdFromToken } from '../../utils/jwt';

const ProjectGallery = ({ userId, onProjectsLoaded, setIsLoadingChild, refreshTrigger, isOwnProfile }: any) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [favoritedProjects, setFavoritedProjects] = useState<any[]>([]);
  const [favoritedLoading, setFavoritedLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('meus-projetos');
  const [isDeleting, setIsDeleting] = useState<string | number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);

  const tabs = [
    { id: 'meus-projetos', label: 'Projetos' },
    ...(isOwnProfile ? [{ id: 'favoritos', label: 'Favoritos' }] : []),
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}/projects`);
        const data = response.data;
        setProjects(data || []);

        if (onProjectsLoaded) {
          onProjectsLoaded(data ? data.length : 0);
        }
      } catch (err: any) {
        console.error("Erro ao buscar projetos:", err);
        setProjects([]);
      } finally {
        if (setIsLoadingChild) {
          setIsLoadingChild(false);
        }
      }
    };

    if (userId) fetchProjects();
  }, [userId, refreshTrigger]);

  useEffect(() => {
    const fetchFavorited = async () => {
      if (!userId || !isOwnProfile) return;
      setFavoritedLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}/favorites`);
        setFavoritedProjects(response.data || []);
      } catch (err: any) {
        console.error('Erro ao buscar favoritos:', err);
        setFavoritedProjects([]);
      } finally {
        setFavoritedLoading(false);
      }
    };

    if (activeTab === 'favoritos' && userId && isOwnProfile) {
      fetchFavorited();
    }
  }, [activeTab, userId, isOwnProfile, refreshTrigger]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDeleteModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Bloquear scroll no modal de delete
  useEffect(() => {
    if (showDeleteModal) {
      const scrollY = window.scrollY;
      
      const originalBodyOverflow = document.body.style.overflow || '';
      const originalBodyPosition = document.body.style.position || '';
      const originalBodyTop = document.body.style.top || '';
      const originalBodyWidth = document.body.style.width || '';
      const originalHtmlOverflow = document.documentElement.style.overflow || '';
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        if (originalBodyOverflow) {
          document.body.style.overflow = originalBodyOverflow;
        } else {
          document.body.style.removeProperty('overflow');
        }
        
        if (originalBodyPosition) {
          document.body.style.position = originalBodyPosition;
        } else {
          document.body.style.removeProperty('position');
        }
        
        if (originalBodyTop) {
          document.body.style.top = originalBodyTop;
        } else {
          document.body.style.removeProperty('top');
        }
        
        if (originalBodyWidth) {
          document.body.style.width = originalBodyWidth;
        } else {
          document.body.style.removeProperty('width');
        }
        
        if (originalHtmlOverflow) {
          document.documentElement.style.overflow = originalHtmlOverflow;
        } else {
          document.documentElement.style.removeProperty('overflow');
        }
        
        window.scrollTo(0, scrollY);
      };
    }
  }, [showDeleteModal]);

  const handleEditProject = (project: any) => {
    const projectId = project._id || project.id;
    navigate(`/edit-project/${projectId}`);
  };

  // Função para abrir modal de confirmação de exclusão
  const handleDeleteClick = (project: any) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  // Função para deletar projeto
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    const projectId = projectToDelete._id || projectToDelete.id;
    const idToCompare = projectId;
    setIsDeleting(idToCompare as any);
    
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/projects/${projectId}`
      );

      if (response.status === 200 || response.status === 204) {
        const updatedProjects = projects.filter((p: any) => {
          const pId = p._id || p.id;
          return String(pId) !== String(projectId);
        });
        setProjects(updatedProjects);
        
        if (onProjectsLoaded) {
          onProjectsLoaded(updatedProjects.length);
        }
        
        // Fechar modal
        setShowDeleteModal(false);
        setProjectToDelete(null);
      }
    } catch (err: any) {
      console.error("Erro ao deletar projeto:", err);
      alert(err.response?.data?.error || "Erro ao deletar projeto");
    } finally {
      setIsDeleting(null);
    }
  };

  // Função para alterar privacidade do projeto
  const handlePrivacyChange = async (projectId: string, isPrivate: boolean) => {
    try {
      // Atualizar localmente
      const updatedProjects: any = projects.map((p: any) => {
        const pId = p._id || p.id;
        return String(pId) === String(projectId) ? { ...p, isPrivate } : p;
      });
      setProjects(updatedProjects);

      // Chamar API para persistir mudança
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/projects/${projectId}/privacy`,
        { isPrivate }
      );

      console.log(`Projeto ${projectId} agora é ${isPrivate ? 'privado' : 'público'}`);
    } catch (err: any) {
      console.error("Erro ao alterar privacidade:", err);
      // Reverter mudança em caso de erro
      const revertedProjects: any = projects.map((p: any) => {
        const pId = p._id || p.id;
        return String(pId) === String(projectId) ? { ...p, isPrivate: !isPrivate } : p;
      });
      setProjects(revertedProjects);
      alert(err.response?.data?.error || "Erro ao alterar privacidade do projeto");
    }
  };

  return (
    <div className="w-full h-auto bg-white dark:bg-[#151B23] pt-5">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        
        {/* Navegação de Abas */}
        <div className="flex gap-8 border-b border-gray-200/60 dark:border-[#3d444d] mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative pb-4 px-1 text-base cursor-pointer font-medium transition-all duration-200
                ${activeTab === tab.id 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300'
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="pb-8">
          {/* Meus Projetos */}
          {activeTab === 'meus-projetos' && (
            <>
              {projects?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects?.map((project: any) => {
                    const projectId = project._id || project.id;
                    const currentUserId = getUserIdFromToken();
                    const isOwnProject = project.userId === currentUserId || project.userId?._id === currentUserId || project.userId?._id?.toString() === currentUserId;
                    
                    return (
                      <ProjectCard
                        key={projectId}
                        project={project}
                        isOwner={isOwnProject}
                        onDelete={() => handleDeleteClick(project)}
                        onEdit={handleEditProject}
                        onPrivacyChange={handlePrivacyChange}
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={
                    <svg className="w-16 h-16 text-gray-300 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                  title="Nenhum projeto ainda"
                  description="Comece compartilhando seu primeiro projeto com a comunidade"
                />
              )}
            </>
          )}

          {/* Favoritos */}
          {activeTab === 'favoritos' && (
            <>
              {favoritedLoading ? (
                <Loading />
              ) : favoritedProjects?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {favoritedProjects?.map((project: any) => {
                    const projectId = project._id || project.id;
                    return (
                      <ProjectCard
                        key={projectId}
                        project={project}
                        isOwner={false}
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={
                    <svg className="w-16 h-16 text-gray-300 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  }
                  title="Nenhum projeto favoritado"
                  description="Projetos que você favoritar aparecerão aqui"
                  isOwnProfile={isOwnProfile}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* ✅ MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {showDeleteModal && projectToDelete && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowDeleteModal(false);
            setProjectToDelete(null);
          }}
        >
          <div
            className="bg-white dark:bg-[#202830] rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-trash text-red-600 dark:text-red-400 text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Deletar Projeto?
                </h3>
                <p className="text-sm text-gray-500 dark:text-neutral-500">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-neutral-400 mb-6 text-sm">
              Você está prestes a deletar <strong className="text-gray-900 dark:text-white">{projectToDelete.name || projectToDelete.title}</strong>. 
              Todos os dados do projeto, incluindo imagens, serão perdidos permanentemente.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProjectToDelete(null);
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-[#3d444d] text-gray-700 dark:text-neutral-400 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-[#151B23] transition-colors cursor-pointer"
                disabled={isDeleting !== null}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={isDeleting !== null}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isDeleting !== null
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 cursor-pointer'
                } text-white`}
              >
                {isDeleting !== null ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Deletando...
                  </span>
                ) : (
                  'Sim, Deletar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de Estado Vazio
const EmptyState = ({ icon, title, description, buttonText, onButtonClick, isOwnProfile }: any) => (
  <div className="flex flex-col items-center justify-center py-24 px-6">
    <div className="mb-6 opacity-80">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    {isOwnProfile && <p className="text-sm text-gray-500 dark:text-neutral-400 mb-8 text-center max-w-md leading-relaxed">
      {description}
    </p>}
    {buttonText && isOwnProfile && (
      <button 
        onClick={onButtonClick}
        className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-neutral-200 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
      >
        {buttonText}
      </button>
    )}
  </div>
);

export default ProjectGallery;
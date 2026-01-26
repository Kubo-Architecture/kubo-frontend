import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import axios from 'axios';
import { getUserIdFromToken } from '../../utils/jwt';

const ProjectGallery = ({ userId, onProjectsLoaded, setIsLoadingChild, refreshTrigger, isOwnProfile }: any) => {
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('meus-projetos');
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | number | null>(null);

  const tabs = [
    { id: 'meus-projetos', label: 'Projetos' },
    //{ id: 'colecoes', label: 'Coleções' }
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
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingProject(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (editingProject) {
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
        // Restaurar valores originais (remover propriedade se estava vazia)
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
        
        // Restaurar posição do scroll
        window.scrollTo(0, scrollY);
      };
    }
  }, [editingProject]);

  const handleEditProject = (project: any) => {
    setEditingProject({
      ...project,
      name: project.name || project.title || '',
      title: project.title || project.name || '',
      materials: project.materials || [''],
      status: project.status || '',
      build_area: project.build_area || '',
      terrain_area: project.terrain_area || '',
      usage_type: project.usage_type || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingProject) return;

    setIsSaving(true);
    try {
      const projectId = editingProject._id || editingProject.id;
      const updateData = {
        id: projectId,
        name: editingProject.name || editingProject.title,
        location: editingProject.location,
        description: editingProject.description,
        status: editingProject.status,
        build_area: editingProject.build_area,
        terrain_area: editingProject.terrain_area,
        usage_type: editingProject.usage_type,
        materials: editingProject.materials?.filter((m: string) => m.trim()) || []
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/projects/`,
        updateData
      );

      if (response.status === 200 || response.status === 204) {
        const updatedProjects: any = projects.map((p: any) => {
          const pId = p._id || p.id;
          return pId === projectId ? { ...p, ...updateData } : p;
        });
        setProjects(updatedProjects);
        setEditingProject(null);
        
        const refreshResponse = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${userId}`);
        if (refreshResponse.data) {
          setProjects(refreshResponse.data);
          if (onProjectsLoaded) {
            onProjectsLoaded(refreshResponse.data.length);
          }
        }
      }
    } catch (err: any) {
      console.error("Erro ao atualizar projeto:", err);
      alert(err.response?.data?.error || "Erro ao atualizar projeto");
    } finally {
      setIsSaving(false);
    }
  };

  // Função para deletar projeto
  const handleDeleteProject = async (projectId: string | number) => {
    if (!window.confirm("Tem certeza que deseja deletar este projeto? Esta ação não pode ser desfeita.")) {
      return;
    }

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
      }
    } catch (err: any) {
      console.error("Erro ao deletar projeto:", err);
      alert(err.response?.data?.error || "Erro ao deletar projeto");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="w-full h-auto bg-white dark:bg-[#151B23] pt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
                      <div key={projectId} className="relative group">
                        <ProjectCard project={project} />
                        {isOwnProject && (
                          <div 
                            className="absolute top-3 left-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditProject(project);
                              }}
                              className="w-8 h-8 flex items-center justify-center bg-white/90 dark:bg-[#202830]/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-[#202830] transition-all shadow-md hover:shadow-lg"
                              title="Editar projeto"
                            >
                              <i className="fas fa-edit text-gray-700 dark:text-neutral-400 text-xs"></i>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProject(projectId);
                              }}
                              disabled={isDeleting === projectId}
                              className="w-8 h-8 flex items-center justify-center bg-red-500/90 backdrop-blur-sm rounded-full hover:bg-red-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                              title="Deletar projeto"
                            >
                              {isDeleting === projectId ? (
                                <i className="fas fa-spinner fa-spin text-white text-xs"></i>
                              ) : (
                                <i className="fas fa-trash text-white text-xs"></i>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
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

          {/* Coleções */}
          {activeTab === 'colecoes' && (
            <>
              <EmptyState
                icon={
                  <svg className="w-16 h-16 text-gray-300 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
                title={isOwnProfile ? "Nenhuma coleção criada" : "O perfil não possui coleções"}
                description="Organize seus projetos favoritos em coleções temáticas"
                isOwnProfile={isOwnProfile}
                buttonText="Criar coleção"
                onButtonClick={() => console.log('Criar coleção')}
              />
            </>
          )}
        </div>
      </div>

      {/* Modal de Edição */}
      {editingProject && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setEditingProject(null)}
        >
          <div
            className="relative bg-white dark:bg-[#151B23] rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 bg-white dark:bg-[#151B23] border-b border-gray-200 dark:border-[#3d444d] px-8 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Projeto</h2>
                  <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1">Atualize as informações do projeto</p>
                </div>
                <button
                  onClick={() => setEditingProject(null)}
                  className="text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-400 transition-colors"
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
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-[#3d444d] pb-3">
                    Informações Básicas
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-500">
                        Nome do Projeto *
                      </label>
                      <input
                        type="text"
                        value={editingProject.name || editingProject.title || ''}
                        onChange={(e) => setEditingProject({...editingProject, name: e.target.value, title: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-gray-300 rounded-lg focus:outline-none text-sm"
                        placeholder="Ex: Casa Moderna"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-500">
                        Localização *
                      </label>
                      <input
                        type="text"
                        value={editingProject.location}
                        onChange={(e) => setEditingProject({...editingProject, location: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-gray-300 rounded-lg focus:outline-none text-sm"
                        placeholder="Ex: São Paulo, Brasil"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-500">
                        Descrição
                      </label>
                      <textarea
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-gray-300 rounded-lg focus:outline-none resize-none text-sm"
                        placeholder="Descreva o projeto..."
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 2: Detalhes técnicos */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-[#3d444d] pb-3">
                    Detalhes Técnicos
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-500">
                        Arquiteto
                      </label>
                      <input
                        type="text"
                        value={editingProject.architect}
                        onChange={(e) => setEditingProject({...editingProject, architect: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-gray-300 rounded-lg focus:outline-none text-sm"
                        placeholder="Nome do arquiteto"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-500">
                        Ano
                      </label>
                      <input
                        type="text"
                        value={editingProject.year}
                        onChange={(e) => setEditingProject({...editingProject, year: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-gray-300 rounded-lg focus:outline-none text-sm"
                        placeholder="2024"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-500">
                        Status
                      </label>
                      <select
                        value={editingProject.status}
                        onChange={(e) => setEditingProject({...editingProject, status: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 border border-gray-300 rounded-lg focus:outline-none text-sm appearance-none"
                      >
                        <option value="">Selecione o status</option>
                        <option value="Em planejamento">Em planejamento</option>
                        <option value="Em construção">Em construção</option>
                        <option value="Concluído">Concluído</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-500">
                        Categoria
                      </label>
                      <select
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({...editingProject, category: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 border border-gray-300 rounded-lg focus:outline-none text-sm appearance-none"
                      >
                        <option value="residencial">Residencial</option>
                        <option value="comercial">Comercial</option>
                        <option value="cultural">Cultural</option>
                        <option value="religioso">Religioso</option>
                        <option value="industrial">Industrial</option>
                        <option value="urbano">Urbano</option>
                        <option value="publico">Público</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-500">
                        Estilo Arquitetônico
                      </label>
                      <input
                        type="text"
                        value={editingProject.style || ''}
                        onChange={(e) => setEditingProject({...editingProject, style: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-gray-300 rounded-lg focus:outline-none text-sm"
                        placeholder="Ex: Modernista"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-500">
                        Tipo de Uso
                      </label>
                      <select
                        value={editingProject.usage_type}
                        onChange={(e) => setEditingProject({...editingProject, usage_type: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 border border-gray-300 rounded-lg focus:outline-none text-sm appearance-none"
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-500">
                        Área Construída (m²)
                      </label>
                      <input
                        type="number"
                        value={editingProject.build_area}
                        onChange={(e) => setEditingProject({...editingProject, build_area: e.target.value})}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-gray-300 rounded-lg focus:outline-none text-sm"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-500">
                        Área do Terreno (m²)
                      </label>
                      <input
                        type="number"
                        value={editingProject.terrain_area}
                        onChange={(e) => setEditingProject({...editingProject, terrain_area: e.target.value})}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-gray-300 rounded-lg focus:outline-none text-sm"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Materiais */}
                    <div className="md:col-span-2 space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-500">
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
                                className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-gray-300 rounded-lg focus:outline-none text-sm"
                                placeholder={`Material ${index + 1}`}
                              />
                              {editingProject.materials.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newMaterials = editingProject.materials.filter((_: any, i: number) => i !== index);
                                    setEditingProject({...editingProject, materials: newMaterials});
                                  }}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 dark:text-neutral-500 hover:text-black dark:hover:text-white"
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
                          className="text-sm text-gray-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors flex items-center"
                        >
                          <i className="fas fa-plus mr-2 text-xs"></i>
                          Adicionar material
                        </button>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-500">
                        Tags (separadas por vírgula)
                      </label>
                      <input
                        type="text"
                        value={editingProject.tags?.join(', ') || ''}
                        onChange={(e) => setEditingProject({
                          ...editingProject, 
                          tags: e.target.value.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
                        })}
                        className="w-full px-4 py-3 bg-white dark:bg-[#202830] dark:border-[#3d444d] dark:text-neutral-400 dark:placeholder:text-neutral-500 border border-gray-300 rounded-lg focus:outline-none text-sm"
                        placeholder="Ex: moderno, minimalista, sustentável"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer com botões */}
            <div className="flex-shrink-0 bg-gray-50 dark:bg-[#202830] border-t border-gray-200 dark:border-[#3d444d] px-8 py-5">
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const projectId = editingProject._id || editingProject.id;
                      if (projectId && window.confirm("Tem certeza que deseja deletar este projeto?")) {
                        handleDeleteProject(projectId);
                        setEditingProject(null);
                      }
                    }}
                    className="px-6 py-3 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                  >
                    Deletar
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingProject(null)}
                    className="px-6 py-3 border border-gray-300 dark:border-[#3d444d] text-gray-700 dark:text-neutral-400 rounded-lg hover:bg-gray-100 dark:hover:bg-[#151B23] transition-colors text-sm font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className={`px-8 py-3 rounded-lg text-white dark:text-black transition-colors text-sm font-medium ${
                      isSaving 
                        ? 'bg-gray-400 dark:bg-neutral-700 cursor-not-allowed' 
                        : 'bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-neutral-200'
                    }`}
                  >
                    {isSaving ? (
                      <span className="flex items-center">
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Salvando...
                      </span>
                    ) : (
                      'Salvar Alterações'
                    )}
                  </button>
                </div>
              </div>
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
        className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-neutral-200 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {buttonText}
      </button>
    )}
  </div>
);

export default ProjectGallery;
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

interface ProjectCardProps {
  project: any;
  isOwner?: boolean;
  onDelete?: (projectId: string) => void;
  onEdit?: (project: any) => void;
  onPrivacyChange?: (projectId: string, isPrivate: boolean) => void;
}

const ProjectCard = ({ project, isOwner = false, onDelete, onEdit, onPrivacyChange }: ProjectCardProps) => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isPrivate, setIsPrivate] = useState(project.isPrivate || false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) {
      return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
    }
    if (path.startsWith('http')) {
      return path;
    }
    return `${API_URL}${path}`;
  };

  const handleClick = () => {
    const projectId = project._id || project.id;
    navigate(`/project/${projectId}`);
  };

  // ✅ Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onEdit) {
      onEdit(project);
    } else {
      const projectId = project._id || project.id;
      navigate(`/edit-project/${projectId}`);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    const projectId = project._id || project.id;
    if (onDelete) {
      onDelete(projectId);
    }
  };

  const handlePrivacy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    
    const projectId = project._id || project.id;
    const newPrivacyStatus = !isPrivate;
    
    try {
      // Atualizar estado local imediatamente
      setIsPrivate(newPrivacyStatus);
      
      // Chamar callback se fornecido
      if (onPrivacyChange) {
        onPrivacyChange(projectId, newPrivacyStatus);
      }
      
      // Chamar API (opcional - implementar no backend)
      // await fetch(`${API_URL}/projects/${projectId}/privacy`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ isPrivate: newPrivacyStatus })
      // });
      
      console.log('Privacidade alterada:', newPrivacyStatus ? 'Privado' : 'Público');
    } catch (err) {
      console.error('Erro ao alterar privacidade:', err);
      // Reverter em caso de erro
      setIsPrivate(!newPrivacyStatus);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer bg-white dark:bg-[#151B23] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-[#3d444d] relative"
    >
      {/* ✅ MENU DE 3 PONTOS (só aparece no hover e se for dono) */}
      {isOwner && (
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef}>
          <button
            onClick={handleMenuClick}
            className="w-9 h-9 flex items-center justify-center bg-white dark:bg-[#202830] rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-[#151B23] transition-all"
            title="Opções"
          >
            <i className="fas fa-ellipsis text-gray-700 dark:text-neutral-300 text-sm"></i>
          </button>

          {/* ✅ DROPDOWN MENU */}
          {showMenu && (
            <div className="absolute top-11 right-0 w-56 bg-white dark:bg-[#202830] rounded-xl shadow-2xl border border-gray-200 dark:border-[#3d444d] py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
              
              {/* ✅ PÚBLICO/PRIVADO */}
              <button
                onClick={handlePrivacy}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-[#151B23] transition-colors flex items-center justify-between text-gray-700 dark:text-neutral-300"
              >
                <div className="flex items-center gap-3">
                  <i className={`${isPrivate ? 'fas fa-lock' : 'fas fa-globe'} text-sm w-4`}></i>
                  <span className="text-sm font-medium">
                    {isPrivate ? 'Projeto Privado' : 'Projeto Público'}
                  </span>
                </div>
                {/* Toggle visual */}
                <div className={`w-9 h-5 rounded-full transition-colors ${
                  isPrivate ? 'bg-gray-400 dark:bg-gray-600' : 'bg-green-500 dark:bg-green-600'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 mt-0.5 ${
                    isPrivate ? 'translate-x-0.5' : 'translate-x-4'
                  }`}></div>
                </div>
              </button>

              {/* ✅ EDITAR */}
              <button
                onClick={handleEdit}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-[#151B23] transition-colors flex items-center gap-3 text-gray-700 dark:text-neutral-300"
              >
                <i className="fas fa-edit text-sm w-4"></i>
                <span className="text-sm font-medium">Editar</span>
              </button>

              {/* Divisor */}
              <div className="border-t border-gray-100 dark:border-[#3d444d] my-2"></div>

              {/* ✅ DELETAR */}
              <button
                onClick={handleDelete}
                className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-3 text-red-600 dark:text-red-400"
              >
                <i className="fas fa-trash text-sm w-4"></i>
                <span className="text-sm font-medium">Excluir</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Badge de Privacidade (se privado) */}
      {isPrivate && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 bg-gray-900/80 dark:bg-gray-800/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1.5">
            <i className="fas fa-lock text-xs"></i>
            Privado
          </span>
        </div>
      )}

      {/* Imagem */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-[#202830]">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-[#202830] dark:via-[#252d38] dark:to-[#202830] animate-pulse" />
        )}
        
        <img
          src={getImageUrl(project.photo_url || project.imageUrl)}
          alt={project.name || project.title || 'Projeto'}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
            setImageLoaded(true);
          }}
        />
      </div>

      {/* Conteúdo - COMPACTO */}
      <div className="p-4">
        {/* Título */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5 line-clamp-1">
          {project.name || project.title || 'Sem título'}
        </h3>

        {/* Localização */}
        <div className="flex items-center text-gray-500 dark:text-neutral-500 text-sm mb-3">
          <i className="fas fa-location-dot mr-1.5 text-xs"></i>
          <span className="truncate">{project.location || 'Localização não informada'}</span>
        </div>

        {/* Descrição */}
        {project.description && (
          <p className="text-gray-600 dark:text-neutral-400 text-sm mb-3 line-clamp-2 leading-snug">
            {project.description}
          </p>
        )}

        {/* Divisor */}
        <div className="border-t border-gray-200 dark:border-[#3d444d] my-3"></div>

        {/* Autor e Ano */}
        {project.author && (
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="flex items-center min-w-0">
              <span className="text-xs text-gray-500 dark:text-neutral-500 font-medium mr-2">Arquiteto</span>
              <span className="text-sm text-gray-900 dark:text-white font-medium truncate">{project.author}</span>
            </div>
            {project.year && (
              <div className="flex items-center ml-4">
                <span className="text-xs text-gray-500 dark:text-neutral-500 font-medium mr-2">Ano</span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">{project.year}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer - Tags inline */}
        <div className="flex items-center justify-between gap-2">
          {/* Materiais */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {project.materials && project.materials.length > 0 && (
              <>
                <span className="px-2 py-1 bg-gray-100 dark:bg-[#202830] text-gray-700 dark:text-neutral-400 rounded-md text-xs font-medium truncate border border-gray-200 dark:border-[#3d444d]">
                  {project.materials[0]}
                </span>
                {project.materials.length > 1 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-[#202830] text-gray-500 dark:text-neutral-500 rounded-md text-xs font-medium border border-gray-200 dark:border-[#3d444d]">
                    +{project.materials.length - 1}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Status e Categoria */}
          <div className="flex items-center gap-1.5">
            {project.status && (
              <span className={`px-2 py-1 text-xs font-medium rounded-md border ${
                project.status === 'Concluído' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' 
                  : 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800'
              }`}>
                {project.status}
              </span>
            )}

            {(project.usage_type || project.category) && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-[#202830] text-gray-700 dark:text-neutral-400 text-xs font-medium rounded-md border border-gray-200 dark:border-[#3d444d]">
                {project.usage_type || project.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
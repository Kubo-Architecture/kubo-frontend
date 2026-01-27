import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: any;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Helper para construir URL da imagem
  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) {
      // Imagem placeholder se não houver foto
      return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800';
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

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer bg-white dark:bg-[#151B23] rounded-xl border border-gray-200 dark:border-[#3d444d] overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Imagem do Projeto */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-[#202830]">
        <img
          src={getImageUrl(project.photo_url || project.imageUrl)}
          alt={project.name || project.title || 'Projeto'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback se a imagem não carregar
            e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800';
          }}
        />
        
        {/* Overlay no hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white text-sm font-medium">Ver detalhes</p>
          </div>
        </div>

        {/* Badge de Categoria */}
        {(project.usage_type || project.category) && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-white/90 dark:bg-[#202830]/90 backdrop-blur-sm text-gray-900 dark:text-neutral-400 text-xs font-medium rounded-full border border-gray-200 dark:border-[#3d444d]">
              {project.usage_type || project.category}
            </span>
          </div>
        )}
      </div>

      {/* Informações do Projeto */}
      <div className="p-5">
        {/* Título */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {project.name || project.title || 'Sem título'}
        </h3>

        {/* Localização */}
        <div className="flex items-center text-gray-600 dark:text-neutral-400 text-sm mb-3">
          <i className="fas fa-map-marker-alt mr-2 text-xs"></i>
          <span className="truncate">{project.location || 'Localização não informada'}</span>
        </div>

        {/* Descrição */}
        {project.description && (
          <p className="text-gray-600 dark:text-neutral-400 text-sm mb-4 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Footer com informações adicionais */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#3d444d]">
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-neutral-500">
            {/* Autor */}
            {project.author && (
              <div className="flex items-center">
                <i className="fas fa-user mr-1.5"></i>
                <span className="truncate max-w-[100px]">{project.author}</span>
              </div>
            )}
            
            {/* Status */}
            {project.status && (
              <div className="flex items-center">
                <i className="fas fa-circle text-[6px] mr-1.5"></i>
                <span>{project.status}</span>
              </div>
            )}
          </div>

          {/* Materiais (tags) */}
          {project.materials && project.materials.length > 0 && (
            <div className="flex items-center space-x-1">
              <span className="px-2 py-1 bg-gray-100 dark:bg-[#202830] text-gray-600 dark:text-neutral-400 text-xs rounded">
                {project.materials[0]}
              </span>
              {project.materials.length > 1 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-[#202830] text-gray-600 dark:text-neutral-400 text-xs rounded">
                  +{project.materials.length - 1}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
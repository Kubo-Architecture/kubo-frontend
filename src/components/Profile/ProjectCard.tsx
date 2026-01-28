import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project }: any) => {
    const navigate = useNavigate();
    const ProjectID = project._id || project.id;

    const handleClick = () => {
        navigate(`/project/${ProjectID}`);
    };

    return (
        <div
            className="group bg-[#1a2128] rounded-xl border border-gray-700 hover:border-gray-600 transition-all cursor-pointer overflow-hidden"
            onClick={handleClick}
        >
            <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                <img 
                    src={
                        project.images?.[0]?.url || 
                        project.images?.[0] || 
                        project.photo_url ||
                        project.cover_image || 
                        project.image ||
                        '/placeholder.jpg'
                    }
                    alt={project.name || project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
                    }}
                />
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white transition-colors truncate">
                        {project.name || project.title}
                    </h3>
                    {project.year && (
                        <span className="text-gray-400 text-sm flex-shrink-0">{project.year}</span>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 text-gray-400 text-xs mb-3">
                    {project.location && (
                        <div className="flex items-center gap-1">
                            <i className="fas fa-map-marker-alt"></i>
                            <span className="truncate">{project.location}</span>
                        </div>
                    )}
                    {(project.user?.nickname || project.author) && (
                        <div className="flex items-center gap-1">
                            <i className="fas fa-user"></i>
                            <span className="truncate">{project.user?.nickname || project.author}</span>
                        </div>
                    )}
                </div>

                {project.description && (
                    <p className="text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
                        {project.description}
                    </p>
                )}

                {project.tags && project.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap mb-3">
                        {project.tags.slice(0, 3).map((tag: string, index: number) => (
                            <span 
                                key={index}
                                className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-full hover:bg-gray-700 transition-colors"
                            >
                                {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                        ))}
                        {project.tags.length > 3 && (
                            <span className="px-2 py-0.5 text-gray-500 text-xs">
                                +{project.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {(project.category || project.usage_type || project.style) && (
                    <div className="flex items-center gap-3 text-gray-400 text-xs pt-3 border-t border-gray-700">
                        {(project.category || project.usage_type) && (
                            <div className="flex items-center gap-1">
                                <i className="fas fa-building"></i>
                                <span>{project.category || project.usage_type}</span>
                            </div>
                        )}
                        {project.style && (
                            <div className="flex items-center gap-1">
                                <i className="fas fa-palette"></i>
                                <span className="truncate">{project.style}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;
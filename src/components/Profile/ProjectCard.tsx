import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project }: any) => {
    const navigate = useNavigate();
    const ProjectID = project._id || project.id;

    const handleClick = () => {
        navigate(`/project/${ProjectID}`);
    };

    return (
        <div
            className="bg-white dark:bg-[#151B23] rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200 dark:border-[#3d444d]"
            onClick={handleClick}
        >
            {project.photo_url ? (
                <div className="h-48 overflow-hidden bg-gray-100 dark:bg-[#202830]">
                    <img
                        src={project.photo_url}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
                        }}
                    />
                </div>
            ) : (
                <div className="bg-gray-200 dark:bg-[#202830] border-2 border-dashed border-gray-300 dark:border-[#3d444d] rounded-xl w-full h-48 flex items-center justify-center">
                    <div className="text-center">
                        <i className="fas fa-image text-3xl text-gray-400 dark:text-neutral-600 mb-2"></i>
                        <p className="text-gray-500 dark:text-neutral-500 text-sm">Sem imagem</p>
                    </div>
                </div>
            )}

            <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1 truncate">
                    {project.name}
                </h2>

                <div className="flex items-center text-gray-600 dark:text-neutral-400 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm truncate">{project.location}</span>
                </div>

                <div className="mt-3">
                    <span className="inline-block bg-gray-100 dark:bg-[#202830] text-gray-600 dark:text-neutral-400 px-3 py-1 rounded-full text-xs font-medium">
                        {project.usage_type || 'Sem tipo definido'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project }: any) => {
    const navigate = useNavigate();
    const ProjectID = project._id || project.id;

    const handleClick = () => {
        navigate(`/project/${ProjectID}`);
    };

    return (
        <div
            className="bg-white dark:bg-[#27313D] rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={handleClick}
        >
            {project.photo_url ? (
                <div className="h-48 overflow-hidden">
                    <img
                        src={project.photo_url}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                </div>
            ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center">
                    <span className="text-gray-500">Sem imagem</span>
                </div>
            )}

            <div className="p-5">
                {project.is_verified && (
                    <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-500/80" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-blue-600 dark:text-blue-400/80 ml-1">Verificado</span>
                    </div>
                )}

                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1 truncate">
                    {project.name}
                </h2>

                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm truncate">{project.location}</span>
                </div>

                <div className="mt-3">
                    <span className="inline-block bg-gray-100 text-gray-600 dark:bg-[#404040] dark:text-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                        {project.usage_type || 'Sem tipo definido'}
                    </span>
                </div>

            </div>
        </div>
    );
};

export default ProjectCard;
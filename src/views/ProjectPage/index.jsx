import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IconWithPanel from "../../components/Universal/MainHeader";
import ProjectImage from "../../assets/images/project.svg";
import ChartIcon from "../../assets/icons/Project/chart.svg";
import EngineIcon from "../../assets/icons/Project/engine.svg";
import FavoriteIcon from "../../assets/icons/Project/favorite.svg";
import HouseIcon from "../../assets/icons/Project/house.svg";
import MaterialsIcon from "../../assets/icons/Project/materials.svg";
import MountainIcon from "../../assets/icons/Project/mountain.svg";
import PinIcon from "../../assets/icons/Project/pin.svg";
import UserIcon from "../../assets/icons/Project/user.svg";
import VerifyIcon from "../../assets/icons/Project/verify-post.svg";

export default function ProjectPage() {
    const { ProjectID } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchProject = async () => {
            try {
                if (!ProjectID) {
                    throw new Error('ID do projeto não fornecido');
                }
                
                const response = await fetch(`http://localhost:8080/project/${ProjectID}`);
                
                console.log("Response status:", response.status);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Projeto não encontrado');
                    }
                    throw new Error('Erro ao buscar projeto');
                }

                const data = await response.json();
                console.log("Project data:", data);
                setProject(data);
            } catch (err) {
                console.error('Error fetching project:', err);
                setError(err.message);
                
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [ProjectID, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen p-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
                    <h3 className="text-lg font-medium text-red-800">Erro</h3>
                    <p className="text-red-700">{error}</p>
                    <p className="text-sm text-red-600 mt-2">
                        Você será redirecionado para a página inicial em 3 segundos...
                    </p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center h-screen p-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 max-w-md">
                    <h3 className="text-lg font-medium text-blue-800">Projeto não encontrado</h3>
                    <p className="text-blue-700">O projeto solicitado não existe ou foi removido</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Voltar à página inicial
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <IconWithPanel />
            <div className="flex flex-col w-full min-h-[calc(100vh-5rem)]">
                <div className="flex w-full h-12 justify-end items-center px-5 gap-5 lg:gap-10">
                    {project.is_verified && (
                        <div className="flex h-full items-center gap-1">
                            <span className="text-xs lg:text-base">Postagem verificada</span>
                            <div className="w-5 h-5">
                                <img className="w-full h-full object-cover" src={VerifyIcon} alt="Verificado" />
                            </div>
                        </div>
                    )}
                    <div className="flex h-full items-center gap-1">
                        <span className="text-xs lg:text-base">Favorito</span>
                        <div className="w-5 h-5">
                            <img className="w-full h-full object-cover" src={FavoriteIcon} alt="Favorito" />
                        </div>
                    </div>
                </div>

                <div className="min-w-full h-70 md:h-90 lg:h-140">
                    {project.photo_url ? (
                        <img 
                            className="w-full h-full object-cover" 
                            src={project.photo_url} 
                            alt={project.name} 
                        />
                    ) : (
                        <img 
                            className="w-full h-full object-cover" 
                            src={ProjectImage} 
                            alt="Imagem padrão de projeto" 
                        />
                    )}
                </div>

                <div className="flex w-full h-8 justify-end items-center px-5 mb-5 gap-10">
                    <div className="flex h-full items-center gap-1">
                        <div className="w-4 h-4">
                            <img className="w-full h-full object-cover" src={UserIcon} alt="Usuário" />
                        </div>
                        <span className="font-light text-xs lg:text-sm">
                            {project.idUser ? `ID: ${project.idUser}` : 'Usuário desconhecido'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col w-full px-8">
                    <span className="text-4xl font-medium leading-7">{project.name}</span>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs lg:text-base">{project.location}</span>
                        <div className="w-3 h-3">
                            <img className="w-full h-full object-cover" src={PinIcon} alt="Localização" />
                        </div>
                    </div>

                    <span className="text-sm text-[#4f4f4f] mt-10 text-justify md:text-start md:text-lg">
                        {project.description || 'Nenhuma descrição fornecida'}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-y-5 gap-x-8 sm:gap-x-0 px-8 py-15 text-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11">
                            <img className="w-full h-full object-cover" src={MaterialsIcon} alt="Materiais" />
                        </div>
                        <div className="flex flex-col">
                            <span className="leading-4">Materiais</span>
                            <span className="font-light text-xs mt-1 leading-3">
                                {project.materials && project.materials.length > 0 
                                    ? project.materials.join(', ') 
                                    : 'Nenhum material informado'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11">
                            <img className="w-full h-full object-cover" src={ChartIcon} alt="Status" />
                        </div>
                        <div className="flex flex-col">
                            <span className="leading-4">Status</span>
                            <span className="font-light text-xs mt-1 leading-3">
                                {project.status || 'Status não informado'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11">
                            <img className="w-full h-full object-cover" src={EngineIcon} alt="Uso" />
                        </div>
                        <div className="flex flex-col">
                            <span className="leading-4">Uso</span>
                            <span className="font-light text-xs mt-1 leading-3">
                                {project.usage_type || 'Tipo de uso não informado'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11">
                            <img className="w-full h-full object-cover" src={MountainIcon} alt="Área do terreno" />
                        </div>
                        <div className="flex flex-col">
                            <span className="leading-4">Área do terreno</span>
                            <span className="font-light text-xs mt-1 leading-3">
                                {project.terrain_area ? `${project.terrain_area} m²` : 'N/A'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11">
                            <img className="w-full h-full object-cover" src={HouseIcon} alt="Área construída" />
                        </div>
                        <div className="flex flex-col">
                            <span className="leading-4">Área construída</span>
                            <span className="font-light text-xs mt-1 leading-3">
                                {project.build_area ? `${project.build_area} m²` : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {project.gallery && project.gallery.length > 0 && (
                    <div className="flex flex-col px-8 pb-10">
                        <span className="text-3xl font-medium mb-5">Galeria</span>
                        <div className="grid grid-cols-1 sm:grid-rows-2 sm:grid-cols-3 gap-1 lg:grid-rows-3">
                            {project.gallery.map((imageUrl, index) => (
                                <div 
                                    key={index} 
                                    className={`rounded-sm ${
                                        index === 0 ? 'sm:row-span-2 lg:row-span-3' : 
                                        index > 3 ? 'lg:row-span-1' : 'lg:row-span-2'
                                    }`}
                                >
                                    <img 
                                        className="w-full h-full object-cover rounded-sm" 
                                        src={imageUrl} 
                                        alt={`Imagem ${index + 1} da galeria`} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectImage from "../assets/images/project.svg";

export default function ProjectPage() {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const projectId = pathSegments[1];
    const navigate = useNavigate();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [likesCount, setLikesCount] = useState<number>(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageError, setImageError] = useState<boolean>(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (!projectId) {
                    throw new Error('ID do projeto não fornecido');
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/project/${projectId}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Projeto não encontrado');
                    }
                    throw new Error('Erro ao buscar projeto');
                }

                const data = await response.json();
                console.log("Project data:", data);
                setProject(data);
                setLikesCount(data.likes || 0);
                
                const savedLikes = JSON.parse(localStorage.getItem('likedProjects') || '[]');
                const savedBookmarks = JSON.parse(localStorage.getItem('savedProjects') || '[]');
                setIsLiked(savedLikes.includes(projectId));
                setIsSaved(savedBookmarks.includes(projectId));
            } catch (err) {
                console.error('Error fetching project:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, navigate]);

    const handleLike = () => {
        const savedLikes = JSON.parse(localStorage.getItem('likedProjects') || '[]');
        
        if (isLiked) {
            const updated = savedLikes.filter((id: string) => id !== projectId);
            localStorage.setItem('likedProjects', JSON.stringify(updated));
            setIsLiked(false);
            setLikesCount(prev => Math.max(0, prev - 1));
        } else {
            savedLikes.push(projectId);
            localStorage.setItem('likedProjects', JSON.stringify(savedLikes));
            setIsLiked(true);
            setLikesCount(prev => prev + 1);
        }
    };

    const handleSave = () => {
        const savedBookmarks = JSON.parse(localStorage.getItem('savedProjects') || '[]');
        
        if (isSaved) {
            const updated = savedBookmarks.filter((id: string) => id !== projectId);
            localStorage.setItem('savedProjects', JSON.stringify(updated));
            setIsSaved(false);
        } else {
            savedBookmarks.push(projectId);
            localStorage.setItem('savedProjects', JSON.stringify(savedBookmarks));
            setIsSaved(true);
        }
    };

    const openLightbox = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'unset';
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedImage) {
                closeLightbox();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [selectedImage]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-3 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                    <p className="text-gray-600 text-sm font-medium">Carregando projeto...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white p-6">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                        <i className="fas fa-building text-3xl text-gray-300"></i>
                    </div>
                    <h3 className="text-2xl font-medium text-gray-900 mb-3">
                        Projeto não encontrado
                    </h3>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        O projeto que você está procurando não existe ou foi removido.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all active:scale-[0.98]"
                    >
                        <i className="fas fa-arrow-left text-xs"></i>
                        <span>Voltar à galeria</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <link 
                rel="stylesheet" 
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
            />
            
            <div className="min-h-screen bg-white">
                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-22 pb-12">
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 mb-16 text-gray-600 hover:text-gray-900 transition-colors group"
                    >
                        <i className="fas fa-arrow-left text-base group-hover:-translate-x-1 transition-transform"></i>
                        <span className="text-base font-medium">Voltar</span>
                    </button>

                    {/* Hero Section - Side by Side */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16 items-start">
                        {/* Left Column - Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                                    {project.name}
                                </h1>
                                
                                <div className="flex items-center gap-2 text-gray-600 mb-6">
                                    <i className="fas fa-location-dot text-base"></i>
                                    <span className="text-base font-medium">{project.location}</span>
                                </div>

                                <p className="text-gray-700 leading-relaxed text-base">
                                    {project.description || 'Nenhuma descrição fornecida'}
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Hero Image */}
                        <div className="lg:pl-4">
                            <div 
                                className="rounded-3xl overflow-hidden bg-gray-100 aspect-[5/5] cursor-pointer group relative"
                                onClick={() => openLightbox(project.photo_url || ProjectImage)}
                            >
                                <img
                                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                                    src={project.photo_url || ProjectImage}
                                    alt={project.name}
                                    onError={() => setImageError(true)}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                                        <i className="fas fa-expand text-gray-900 text-sm"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Info and Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-16 pb-8 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <i className="fas fa-user text-base text-gray-600"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                                    Autor do projeto
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {project.userId || 'Usuário anônimo'}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={handleLike}
                                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl border transition-all active:scale-[0.98] ${
                                    isLiked 
                                        ? 'border-red-200 bg-red-50 text-red-600' 
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                                }`}
                                aria-label={isLiked ? 'Remover curtida' : 'Curtir'}
                            >
                                <i className={`${isLiked ? 'fas' : 'far'} fa-heart text-base`}></i>
                                <span className="text-sm font-medium">{likesCount}</span>
                            </button>

                            <button
                                onClick={handleSave}
                                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl border transition-all active:scale-[0.98] ${
                                    isSaved 
                                        ? 'border-amber-200 bg-amber-50 text-amber-600' 
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                                }`}
                                aria-label={isSaved ? 'Remover dos salvos' : 'Salvar'}
                            >
                                <i className={`${isSaved ? 'fas' : 'far'} fa-star text-base`}></i>
                                <span className="text-sm font-medium">Salvar</span>
                            </button>
                        </div>
                    </div>

                    {/* Specifications Grid */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-medium text-gray-900 mb-8">Especificações técnicas</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                {
                                    icon: 'fas fa-layer-group',
                                    title: 'Materiais',
                                    value: project.materials && project.materials.length > 0 
                                        ? project.materials.join(', ')
                                        : 'Não informado'
                                },
                                {
                                    icon: 'fas fa-users',
                                    title: 'Realização',
                                    value: project.company || 'Não informado'
                                },
                                {
                                    icon: 'fas fa-location-crosshairs',
                                    title: 'Tipo de uso',
                                    value: project.usage_type || 'Não informado'
                                },
                                {
                                    icon: 'fas fa-mountain',
                                    title: 'Área do terreno',
                                    value: project.terrain_area ? `${project.terrain_area}m²` : 'Não informado'
                                },
                                {
                                    icon: 'fas fa-house',
                                    title: 'Área construída',
                                    value: project.build_area ? `${project.build_area}m²` : 'Não informado'
                                },
                                {
                                    icon: 'fas fa-chart-simple',
                                    title: 'Status',
                                    value: project.status || 'Não informado'
                                }
                            ].map((spec, index) => (
                                <div 
                                    key={index} 
                                    className="group p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <i className={`${spec.icon} text-base text-gray-700`}></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                {spec.title}
                                            </h3>
                                            <p className="text-gray-900 text-sm font-medium leading-relaxed break-words">
                                                {spec.value}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gallery */}
                    {project.gallery && project.gallery.length > 0 && (
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-8">Galeria</h2>
                            
                            {/* Masonry Grid Layout */}
                            <div className="grid grid-cols-12 gap-4">
                                {/* First large image - spans 4 columns and 2 rows */}
                                {project.gallery[0] && (
                                    <div className="col-span-12 md:col-span-4 md:row-span-2">
                                        <div 
                                            className="rounded-2xl overflow-hidden h-full bg-gray-100 cursor-pointer group relative"
                                            onClick={() => openLightbox(project.gallery[0])}
                                        >
                                            <img
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                src={project.gallery[0]}
                                                alt={`${project.name} - Imagem 1`}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <i className="fas fa-expand text-white text-lg drop-shadow-lg"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Second image - top right, spans 4 columns */}
                                {project.gallery[1] && (
                                    <div className="col-span-12 md:col-span-4">
                                        <div 
                                            className="rounded-2xl overflow-hidden aspect-video bg-gray-100 cursor-pointer group relative"
                                            onClick={() => openLightbox(project.gallery[1])}
                                        >
                                            <img
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                src={project.gallery[1]}
                                                alt={`${project.name} - Imagem 2`}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <i className="fas fa-expand text-white text-lg drop-shadow-lg"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Third image - spans 4 columns on right side */}
                                {project.gallery[2] && (
                                    <div className="col-span-12 md:col-span-4 md:row-span-2">
                                        <div 
                                            className="rounded-2xl overflow-hidden h-full bg-gray-100 cursor-pointer group relative"
                                            onClick={() => openLightbox(project.gallery[2])}
                                        >
                                            <img
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                src={project.gallery[2]}
                                                alt={`${project.name} - Imagem 3`}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <i className="fas fa-expand text-white text-lg drop-shadow-lg"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Fourth image - bottom middle */}
                                {project.gallery[3] && (
                                    <div className="col-span-12 md:col-span-4">
                                        <div 
                                            className="rounded-2xl overflow-hidden aspect-video bg-gray-100 cursor-pointer group relative"
                                            onClick={() => openLightbox(project.gallery[3])}
                                        >
                                            <img
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                src={project.gallery[3]}
                                                alt={`${project.name} - Imagem 4`}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <i className="fas fa-expand text-white text-lg drop-shadow-lg"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Fifth image if exists */}
                                {project.gallery[4] && (
                                    <div className="col-span-12 md:col-span-4">
                                        <div 
                                            className="rounded-2xl overflow-hidden aspect-video bg-gray-100 cursor-pointer group relative"
                                            onClick={() => openLightbox(project.gallery[4])}
                                        >
                                            <img
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                src={project.gallery[4]}
                                                alt={`${project.name} - Imagem 5`}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <i className="fas fa-expand text-white text-lg drop-shadow-lg"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Additional images */}
                                {project.gallery.slice(5).map((imageUrl: string, index: number) => (
                                    <div key={index + 5} className="col-span-12 md:col-span-4">
                                        <div 
                                            className="rounded-2xl overflow-hidden aspect-video bg-gray-100 cursor-pointer group relative"
                                            onClick={() => openLightbox(imageUrl)}
                                        >
                                            <img
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                src={imageUrl}
                                                alt={`${project.name} - Imagem ${index + 6}`}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <i className="fas fa-expand text-white text-lg drop-shadow-lg"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
                        aria-label="Fechar"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                    
                    <div className="max-w-7xl w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selectedImage}
                            alt="Visualização ampliada"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                        Pressione ESC ou clique fora para fechar
                    </div>
                </div>
            )}
        </>
    );
}
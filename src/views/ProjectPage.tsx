import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserIdFromToken } from '../utils/jwt';
import axios from 'axios';
import Loading from '../components/Universal/Loading';

export default function ProjectPage() {
    const location = useLocation();
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const projectId = pathSegments[1];
    const navigate = useNavigate();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isFavorited, setIsFavorited] = useState<boolean>(false);
    const [likesCount, setLikesCount] = useState<number>(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [, setImageError] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [imageLoadStates, setImageLoadStates] = useState<{[key: string]: boolean}>({});
    
    const deleteModalRef = useRef<HTMLDivElement>(null);

    const API_URL = import.meta.env.VITE_API_URL;
    
    const getImageUrl = (path: string | null | undefined): string => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_URL}${path}`;
    };

    const currentUserId = getUserIdFromToken();
    const isOwner = project?.userId === currentUserId;

    const allImages = project ? [
        project.photo_url,
        ...(project.gallery || [])
    ].filter(Boolean) : [];

    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (!projectId) {
                    throw new Error('ID do projeto não fornecido');
                }

                const url = currentUserId
                    ? `${API_URL}/projects/${projectId}?userId=${currentUserId}`
                    : `${API_URL}/projects/${projectId}`;
                const response = await axios.get(url);
                const data = response.data;
                setProject(data);
                setLikesCount(data.likes ?? 0);
                setIsLiked(data.isLiked ?? false);
                setIsFavorited(data.isFavorited ?? false);
            } catch (err: any) {
                console.error('Error fetching project:', err);
                if (err.response?.status === 404) {
                    setProject(null);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, currentUserId, API_URL]);

    // Controle de scroll para o modal de delete
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

    // Controle de scroll para o lightbox
    useEffect(() => {
        if (selectedImage) {
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
    }, [selectedImage]);

    const handleLike = async () => {
        if (!currentUserId) return;

        const previousIsLiked = isLiked;
        const previousLikesCount = likesCount;

        try {
            const newIsLiked = !isLiked;
            const newLikesCount = newIsLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
            
            setIsLiked(newIsLiked);
            setLikesCount(newLikesCount);

            if (newIsLiked) {
                await axios.post(`${API_URL}/projects/${projectId}/like`, { userId: currentUserId });
            } else {
                await axios.delete(`${API_URL}/projects/${projectId}/like/${currentUserId}`);
            }

            window.dispatchEvent(new CustomEvent('projectLikeChanged', {
                detail: { projectId, likes: newLikesCount, isLiked: newIsLiked }
            }));

            const response = await axios.get(
                currentUserId
                    ? `${API_URL}/projects/${projectId}?userId=${currentUserId}`
                    : `${API_URL}/projects/${projectId}`
            );
            
            setLikesCount(response.data.likes ?? 0);
            setIsLiked(response.data.isLiked ?? false);

            window.dispatchEvent(new CustomEvent('projectLikeChanged', {
                detail: {
                    projectId,
                    likes: response.data.likes ?? 0,
                    isLiked: response.data.isLiked ?? false
                }
            }));

        } catch (err) {
            console.error('Error toggling like:', err);
            setIsLiked(previousIsLiked);
            setLikesCount(previousLikesCount);
            
            window.dispatchEvent(new CustomEvent('projectLikeChanged', {
                detail: { projectId, likes: previousLikesCount, isLiked: previousIsLiked }
            }));
        }
    };

    const handleFavorite = async () => {
        if (!currentUserId) return;

        try {
            if (isFavorited) {
                await axios.delete(`${API_URL}/projects/${projectId}/favorite/${currentUserId}`);
                setIsFavorited(false);
            } else {
                await axios.post(`${API_URL}/projects/${projectId}/favorite`, { userId: currentUserId });
                setIsFavorited(true);
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
        }
    };

    const handleDeleteProject = async () => {
        try {
            const response = await axios.delete(`${API_URL}/projects/${projectId}`);

            if (response.status === 204 || response.status === 200) {
                setShowDeleteModal(false);
                navigate('/gallery');
            }
        } catch (error: any) {
            console.error('Error deleting project:', error);
        }
    };

    const handleDeleteModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (deleteModalRef.current && !deleteModalRef.current.contains(e.target as Node)) {
            setShowDeleteModal(false);
        }
    };

    const openLightbox = (imageUrl: string, index: number) => {
        setSelectedImage(imageUrl);
        setCurrentImageIndex(index);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    const navigateImage = (direction: 'prev' | 'next') => {
        const newIndex = direction === 'next' 
            ? (currentImageIndex + 1) % allImages.length
            : (currentImageIndex - 1 + allImages.length) % allImages.length;
        
        setCurrentImageIndex(newIndex);
        setSelectedImage(getImageUrl(allImages[newIndex]));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedImage) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateImage('prev');
            } else if (e.key === 'ArrowRight') {
                navigateImage('next');
            }
        };

        const handleEscapeModal = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showDeleteModal) {
                setShowDeleteModal(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keydown', handleEscapeModal);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keydown', handleEscapeModal);
        };
    }, [selectedImage, showDeleteModal, currentImageIndex, allImages.length]);

    if (loading) {
        return <Loading />;
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#151B23] p-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gray-100 dark:bg-[#202830] flex items-center justify-center">
                        <i className="fas fa-building text-2xl text-gray-400 dark:text-neutral-600"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Projeto não encontrado
                    </h3>
                    <p className="text-gray-500 dark:text-neutral-400 text-sm mb-6">
                        O projeto que você está procurando não existe ou foi removido.
                    </p>
                    <button
                        onClick={() => navigate('/gallery')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-neutral-200 transition-all active:scale-95 cursor-pointer"
                    >
                        <i className="fas fa-arrow-left text-xs"></i>
                        <span>Voltar à galeria</span>
                    </button>
                </div>
            </div>
        );
    }

    const specs = [
        {
            icon: 'fas fa-layer-group',
            title: 'Materiais',
            value: project.materials && project.materials.length > 0 
                ? project.materials.join(', ')
                : null,
            show: project.materials && project.materials.length > 0
        },
        {
            icon: 'fas fa-users',
            title: 'Realização',
            value: project.author,
            show: project.author && project.author.trim() !== ''
        },
        {
            icon: 'fas fa-location-crosshairs',
            title: 'Tipo de uso',
            value: project.usage_type,
            show: project.usage_type && project.usage_type.trim() !== ''
        },
        {
            icon: 'fas fa-mountain',
            title: 'Área do terreno',
            value: project.terrain_area ? `${project.terrain_area}m²` : null,
            show: project.terrain_area && project.terrain_area > 0
        },
        {
            icon: 'fas fa-house',
            title: 'Área construída',
            value: project.build_area ? `${project.build_area}m²` : null,
            show: project.build_area && project.build_area > 0
        },
        {
            icon: 'fas fa-chart-simple',
            title: 'Status',
            value: project.status,
            show: project.status && project.status.trim() !== ''
        }
    ].filter(spec => spec.show);

    return (
        <>  
            <div className="min-h-screen bg-white dark:bg-[#151B23]">
                <div className="w-full px-4 sm:px-6 md:px-8 xl:px-16 2xl:px-24 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-12">
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center cursor-pointer gap-2 mb-6 text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
                    >
                        <i className="fas fa-arrow-left text-sm group-hover:-translate-x-0.5 transition-transform"></i>
                        <span className="text-sm font-medium">Voltar</span>
                    </button>

                    {/* Hero Section */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-10">
                        {/* Left - Info */}
                        <div className="space-y-5">
                            <div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
                                    {project.name}
                                </h1>
                                
                                <div className="flex items-center gap-2 text-gray-600 dark:text-neutral-400 mb-4">
                                    <i className="fas fa-location-dot text-sm"></i>
                                    <span className="text-sm font-medium">{project.location}</span>
                                </div>

                                <p className="text-gray-600 dark:text-neutral-400 leading-relaxed text-sm">
                                    {project.description || 'Nenhuma descrição fornecida'}
                                </p>
                            </div>

                            {/* User Info */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-[#2a3139]">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#202830] dark:to-[#151B23] flex items-center justify-center">
                                    <i className="fas fa-user text-sm text-gray-600 dark:text-neutral-400"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-neutral-500 font-medium">
                                        Autor do projeto
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {project.author || 'Não informado'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right - Hero Image */}
                        <div>
                            <div 
                                className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#202830] aspect-[4/3] cursor-pointer group relative shadow-lg hover:shadow-xl transition-all duration-300"
                                onClick={() => project.photo_url && openLightbox(getImageUrl(project.photo_url), 0)}
                            >
                                {project.photo_url ? (
                                    <>
                                        {!imageLoadStates[project.photo_url] && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-8 h-8 border-3 border-gray-300 dark:border-neutral-600 border-t-gray-600 dark:border-t-neutral-400 rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                        <img
                                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                                            src={getImageUrl(project.photo_url)}
                                            alt={project.name}
                                            loading="eager"
                                            decoding="async"
                                            onLoad={() => setImageLoadStates(prev => ({...prev, [project.photo_url]: true}))}
                                            onError={() => setImageError(true)}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white/90 dark:bg-[#202830]/90 backdrop-blur-sm px-3 py-2 rounded-full">
                                                <i className="fas fa-expand text-gray-900 dark:text-neutral-400 text-sm"></i>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <i className="fas fa-image text-3xl text-gray-300 dark:text-neutral-600"></i>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mb-10 pb-8 border-b border-gray-100 dark:border-[#2a3139] flex-wrap">
                        <button
                            onClick={handleLike}
                            className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg border transition-all active:scale-95 ${
                                isLiked 
                                    ? 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                                    : 'border-gray-200 dark:border-[#2a3139] hover:bg-gray-50 dark:hover:bg-[#202830] text-gray-700 dark:text-neutral-400'
                            }`}
                        >
                            <i className={`${isLiked ? 'fas' : 'far'} fa-heart text-sm`}></i>
                            <span className="text-sm font-medium">{likesCount}</span>
                        </button>

                        <button
                            onClick={handleFavorite}
                            className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg border transition-all active:scale-95 ${
                                isFavorited 
                                    ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' 
                                    : 'border-gray-200 dark:border-[#2a3139] hover:bg-gray-50 dark:hover:bg-[#202830] text-gray-700 dark:text-neutral-400'
                            }`}
                        >
                            <i className={`${isFavorited ? 'fas' : 'far'} fa-star text-sm`}></i>
                            <span className="text-sm font-medium">Favoritar</span>
                        </button>

                        {isOwner && (
                            <>
                                <button
                                    onClick={() => navigate(`/edit-project/${projectId}`)}
                                    className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all active:scale-95"
                                >
                                    <i className="fas fa-edit text-sm"></i>
                                    <span className="text-sm font-medium">Editar</span>
                                </button>

                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-95"
                                >
                                    <i className="fas fa-trash text-sm"></i>
                                    <span className="text-sm font-medium">Deletar</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Specifications */}
                    {specs.length > 0 && (
                        <div className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">Especificações técnicas</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {specs.map((spec, index) => (
                                    <div 
                                        key={index} 
                                        className="group p-4 rounded-xl border border-gray-100 dark:border-[#2a3139] hover:border-gray-200 dark:hover:border-[#3d444d] hover:shadow-sm transition-all bg-white dark:bg-[#151B23]"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-50 dark:bg-[#202830] flex items-center justify-center group-hover:scale-105 transition-transform">
                                                <i className={`${spec.icon} text-sm text-gray-700 dark:text-neutral-400`}></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase tracking-wide mb-1">
                                                    {spec.title}
                                                </h3>
                                                <p className="text-gray-900 dark:text-white text-sm font-medium leading-snug break-words">
                                                    {spec.value}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Gallery */}
                    {project.gallery && project.gallery.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">Galeria de imagens</h2>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {project.gallery.map((imageUrl: string, index: number) => (
                                    <div 
                                        key={index}
                                        className="rounded-xl overflow-hidden bg-gray-100 dark:bg-[#202830] aspect-square cursor-pointer group relative shadow-md hover:shadow-lg transition-all duration-300"
                                        onClick={() => openLightbox(getImageUrl(imageUrl), index + 1)}
                                    >
                                        {!imageLoadStates[imageUrl] && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-gray-300 dark:border-neutral-600 border-t-gray-600 dark:border-t-neutral-400 rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                        <img
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            src={getImageUrl(imageUrl)}
                                            alt={`${project.name} - Imagem ${index + 1}`}
                                            loading="lazy"
                                            decoding="async"
                                            onLoad={() => setImageLoadStates(prev => ({...prev, [imageUrl]: true}))}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-[#202830]/90 backdrop-blur-sm p-2 rounded-full">
                                                <i className="fas fa-expand text-gray-900 dark:text-neutral-400 text-xs"></i>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleDeleteModalClick}
                >
                    <div 
                        ref={deleteModalRef}
                        className="bg-white dark:bg-[#202830] rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-11 h-11 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-trash text-red-600 dark:text-red-400 text-lg"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Deletar Projeto?
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-neutral-500">
                                    Esta ação não pode ser desfeita
                                </p>
                            </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-neutral-400 mb-6 text-sm">
                            Você está prestes a deletar <strong className="text-gray-900 dark:text-white">{project.name}</strong>. 
                            Todos os dados do projeto serão perdidos permanentemente.
                        </p>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-[#3d444d] text-gray-700 dark:text-neutral-400 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-[#151B23] transition-colors cursor-pointer text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteProject}
                                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors cursor-pointer text-sm"
                            >
                                Sim, Deletar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10 cursor-pointer"
                        aria-label="Fechar"
                    >
                        <i className="fas fa-times text-lg"></i>
                    </button>

                    {/* Navigation Buttons */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateImage('prev');
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
                                aria-label="Imagem anterior"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateImage('next');
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
                                aria-label="Próxima imagem"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </>
                    )}
                    
                    {/* Image Container */}
                    <div className="max-w-7xl w-full h-full flex items-center justify-center p-4">
                        <img
                            src={selectedImage}
                            alt="Visualização ampliada"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                            loading="eager"
                            decoding="async"
                        />
                    </div>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-white/90 text-sm font-medium">
                            {currentImageIndex + 1} / {allImages.length}
                        </span>
                    </div>

                    {/* Instructions */}
                    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 text-white/50 text-xs">
                        Use as setas do teclado ou clique nos botões para navegar
                    </div>
                </div>
            )}
        </>
    );
}
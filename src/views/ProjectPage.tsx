import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserIdFromToken } from '../utils/jwt';
import axios from 'axios';

export default function ProjectPage() {
    const location = useLocation();
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
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    // ✅ Helper para URLs de imagem
    const API_URL = import.meta.env.VITE_API_URL;
    
    const getImageUrl = (path: string | null | undefined): string => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_URL}${path}`;
    };

    // ✅ Verificar se é o dono do projeto
    const currentUserId = getUserIdFromToken();
    const isOwner = project?.userId === currentUserId;

    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (!projectId) {
                    throw new Error('ID do projeto não fornecido');
                }

                const response = await fetch(`${API_URL}/projects/${projectId}`);

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

    // ✅ FUNÇÃO DE DELETAR PROJETO
    const handleDeleteProject = async () => {
        try {
            console.log('🗑️ Deletando projeto:', projectId);
            
            // ✅ CORRIGIDO - Usar /projects/:projectId (não /projects/:id)
            const response = await axios.delete(`${API_URL}/projects/${projectId}`);

            if (response.status === 204 || response.status === 200) {
                console.log('✅ Projeto deletado com sucesso');
                setShowDeleteModal(false);
                
                // Mostrar mensagem de sucesso
                alert('Projeto deletado com sucesso!');
                
                // Redirecionar para galeria
                navigate('/gallery');
            }
        } catch (error: any) {
            console.error('❌ Erro ao deletar projeto:', error);
            console.error('❌ Resposta do servidor:', error.response?.data);
            
            if (error.response?.status === 400) {
                alert('ID do projeto inválido');
            } else if (error.response?.status === 404) {
                alert('Projeto não encontrado');
            } else {
                alert('Erro ao deletar projeto: ' + (error.response?.data?.error || 'Erro desconhecido'));
            }
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
            if (e.key === 'Escape' && showDeleteModal) {
                setShowDeleteModal(false);
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [selectedImage, showDeleteModal]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#151B23]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-3 border-gray-200 dark:border-[#3d444d] border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-neutral-400 text-sm font-medium">Carregando projeto...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#151B23] p-6">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gray-50 dark:bg-[#202830] flex items-center justify-center border border-gray-100 dark:border-[#3d444d]">
                        <i className="fas fa-building text-3xl text-gray-300 dark:text-neutral-600"></i>
                    </div>
                    <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">
                        Projeto não encontrado
                    </h3>
                    <p className="text-gray-500 dark:text-neutral-400 text-sm mb-8 leading-relaxed">
                        O projeto que você está procurando não existe ou foi removido.
                    </p>
                    <button
                        onClick={() => navigate('/gallery')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-neutral-200 transition-all active:scale-[0.98]"
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
            
            <div className="min-h-screen bg-white dark:bg-[#151B23]">
                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-22 pb-12">
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center cursor-pointer gap-2 mb-16 text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
                    >
                        <i className="fas fa-arrow-left text-base group-hover:-translate-x-1 transition-transform"></i>
                        <span className="text-base font-medium">Voltar</span>
                    </button>

                    {/* Hero Section - Side by Side */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16 items-start">
                        {/* Left Column - Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                                    {project.name}
                                </h1>
                                
                                <div className="flex items-center gap-2 text-gray-600 dark:text-neutral-400 mb-6">
                                    <i className="fas fa-location-dot text-base"></i>
                                    <span className="text-base font-medium">{project.location}</span>
                                </div>

                                <p className="text-gray-700 dark:text-neutral-400 leading-relaxed text-base">
                                    {project.description || 'Nenhuma descrição fornecida'}
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Hero Image */}
                        <div className="lg:pl-4">
                            <div 
                                className="rounded-3xl overflow-hidden bg-gray-100 dark:bg-[#202830] aspect-[5/5] cursor-pointer group relative"
                                onClick={() => project.photo_url && openLightbox(getImageUrl(project.photo_url))}
                            >
                                {project.photo_url ? (
                                    <>
                                        <img
                                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                                            src={getImageUrl(project.photo_url)}
                                            alt={project.name}
                                            onError={() => setImageError(true)}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-[#202830]/90 backdrop-blur-sm px-4 py-2 rounded-full">
                                                <i className="fas fa-expand text-gray-900 dark:text-neutral-400 text-sm"></i>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <i className="fas fa-image text-4xl text-gray-300 dark:text-neutral-600"></i>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Info and Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-16 pb-8 border-b border-gray-100 dark:border-[#3d444d]">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-[#202830] dark:to-[#151B23] flex items-center justify-center">
                                <i className="fas fa-user text-base text-gray-600 dark:text-neutral-400"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-neutral-500 uppercase tracking-wider font-medium">
                                    Autor do projeto
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {project.author || 'Não informado'}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                            <button
                                onClick={handleLike}
                                className={`flex-1 sm:flex-initial cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-xl border transition-all active:scale-[0.98] ${
                                    isLiked 
                                        ? 'border-red-200 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                                        : 'border-gray-200 dark:border-[#3d444d] hover:border-gray-300 dark:hover:border-[#3d444d] hover:bg-gray-50 dark:hover:bg-[#202830] text-gray-700 dark:text-neutral-400'
                                }`}
                                aria-label={isLiked ? 'Remover curtida' : 'Curtir'}
                            >
                                <i className={`${isLiked ? 'fas' : 'far'} fa-heart text-base`}></i>
                                <span className="text-sm font-medium">{likesCount}</span>
                            </button>

                            <button
                                onClick={handleSave}
                                className={`flex-1 sm:flex-initial flex items-center cursor-pointer justify-center gap-2 px-6 py-3 rounded-xl border transition-all active:scale-[0.98] ${
                                    isSaved 
                                        ? 'border-amber-200 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' 
                                        : 'border-gray-200 dark:border-[#3d444d] hover:border-gray-300 dark:hover:border-[#3d444d] hover:bg-gray-50 dark:hover:bg-[#202830] text-gray-700 dark:text-neutral-400'
                                }`}
                                aria-label={isSaved ? 'Remover dos salvos' : 'Salvar'}
                            >
                                <i className={`${isSaved ? 'fas' : 'far'} fa-star text-base`}></i>
                                <span className="text-sm font-medium">Salvar</span>
                            </button>

                            {/* ✅ BOTÃO DE DELETAR - SÓ APARECE SE FOR O DONO */}
                            {isOwner && (
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="flex-1 sm:flex-initial flex items-center cursor-pointer justify-center gap-2 px-6 py-3 rounded-xl border border-red-200 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-[0.98]"
                                    aria-label="Deletar projeto"
                                >
                                    <i className="fas fa-trash text-base"></i>
                                    <span className="text-sm font-medium">Deletar</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Specifications Grid */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-8">Especificações técnicas</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
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
                            ]
                            .filter(spec => spec.show) // ✅ Filtrar apenas os que têm valor
                            .map((spec, index) => (
                                <div 
                                    key={index} 
                                    className="group p-5 rounded-xl border border-gray-100 dark:border-[#3d444d] hover:border-gray-200 dark:hover:border-[#3d444d] hover:shadow-sm transition-all bg-white dark:bg-[#151B23]"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#202830] dark:to-[#151B23] flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <i className={`${spec.icon} text-base text-gray-700 dark:text-neutral-400`}></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase tracking-wider mb-2">
                                                {spec.title}
                                            </h3>
                                            <p className="text-gray-900 dark:text-white text-sm font-medium leading-relaxed break-words">
                                                {spec.value}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* ✅ Mensagem se não houver especificações */}
                        {[
                            project.materials && project.materials.length > 0,
                            project.author && project.author.trim() !== '',
                            project.usage_type && project.usage_type.trim() !== '',
                            project.terrain_area && project.terrain_area > 0,
                            project.build_area && project.build_area > 0,
                            project.status && project.status.trim() !== ''
                        ].every(val => !val) && (
                            <div className="text-center py-12 text-gray-500 dark:text-neutral-500">
                                <i className="fas fa-info-circle text-2xl mb-2"></i>
                                <p className="text-sm">Nenhuma especificação técnica informada</p>
                            </div>
                        )}
                    </div>

                    {/* Gallery */}
                    {project.gallery && project.gallery.length > 0 && (
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Galeria</h2>
                            
                            {/* Masonry Grid Layout */}
                            <div className="grid grid-cols-12 gap-4">
                                {/* First large image - spans 4 columns and 2 rows */}
                                {project.gallery[0] && (
                                    <div className="col-span-12 md:col-span-4 md:row-span-2">
                                        <div 
                                            className="rounded-2xl overflow-hidden h-full bg-gray-100 dark:bg-[#202830] cursor-pointer group relative"
                                            onClick={() => openLightbox(getImageUrl(project.gallery[0]))}
                                        >
                                            <img
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                src={getImageUrl(project.gallery[0])}
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
                                            className="rounded-2xl overflow-hidden aspect-video bg-gray-100 dark:bg-[#202830] cursor-pointer group relative"
                                            onClick={() => openLightbox(getImageUrl(project.gallery[1]))}
                                        >
                                            <img
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                src={getImageUrl(project.gallery[1])}
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
                                            className="rounded-2xl overflow-hidden h-full bg-gray-100 dark:bg-[#202830] cursor-pointer group relative"
                                            onClick={() => openLightbox(getImageUrl(project.gallery[2]))}
                                        >
                                            <img
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                src={getImageUrl(project.gallery[2])}
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
                                            className="rounded-2xl overflow-hidden aspect-video bg-gray-100 dark:bg-[#202830] cursor-pointer group relative"
                                            onClick={() => openLightbox(getImageUrl(project.gallery[3]))}
                                        >
                                            <img
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                src={getImageUrl(project.gallery[3])}
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
                                            className="rounded-2xl overflow-hidden aspect-video bg-gray-100 dark:bg-[#202830] cursor-pointer group relative"
                                            onClick={() => openLightbox(getImageUrl(project.gallery[4]))}
                                        >
                                            <img
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                src={getImageUrl(project.gallery[4])}
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
                                            className="rounded-2xl overflow-hidden aspect-video bg-gray-100 dark:bg-[#202830] cursor-pointer group relative"
                                            onClick={() => openLightbox(getImageUrl(imageUrl))}
                                        >
                                            <img
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                src={getImageUrl(imageUrl)}
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

            {/* ✅ MODAL DE CONFIRMAÇÃO DE DELETE */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-[#202830] rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
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
                            Você está prestes a deletar <strong className="text-gray-900 dark:text-white">{project.name}</strong>. 
                            Todos os dados do projeto, incluindo imagens, serão perdidos permanentemente.
                        </p>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-[#3d444d] text-gray-700 dark:text-neutral-400 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-[#151B23] transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteProject}
                                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
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
                    
                    <div className="max-w-7xl w-full h-full flex items-center justify-center">
                        <img
                            src={selectedImage}
                            alt="Visualização ampliada"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
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
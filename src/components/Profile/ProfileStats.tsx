import { useState, useEffect, useRef } from "react";
import axios from "axios";
import EditProfileModal from "./EditProfileModal";
import { getUserIdFromToken } from "../../utils/jwt";

export default function ProfileStats(props: any) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [seguidoresCount, setSeguidoresCount] = useState(props.seguidores || 0);
    const [seguindoCount, setSeguindoCount] = useState(0);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [isSeguidoresModalOpen, setIsSeguidoresModalOpen] = useState(false);
    const [isSeguindoModalOpen, setIsSeguindoModalOpen] = useState(false);
    const [seguidoresList, setSeguidoresList] = useState<any[]>([]);
    const [seguindoList, setSeguindoList] = useState<any[]>([]);
    const [showLoginToast, setShowLoginToast] = useState(false);
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    
    const currentUserId = getUserIdFromToken();
    const seguidoresModalRef = useRef<HTMLDivElement>(null);
    const seguindoModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isSeguidoresModalOpen) {
                setIsSeguidoresModalOpen(false);
            }
            if (e.key === 'Escape' && isSeguindoModalOpen) {
                setIsSeguindoModalOpen(false);
            }
        };
        
        axios.get(`${import.meta.env.VITE_API_URL}/followers/${props.userId}`)
            .then((res: any) => setSeguidoresCount(res.data.followers));

        axios.get(`${import.meta.env.VITE_API_URL}/following/${props.userId}`)
            .then((res: any) => setSeguindoCount(res.data.following || 0))
            .catch(() => setSeguindoCount(0));

        if (currentUserId && currentUserId !== props.userId) {
            axios.get<any>(`${import.meta.env.VITE_API_URL}/is-following/${currentUserId}/${props.userId}`)
                .then((res: any) => setIsFollowing(res.data.isFollowing))
        }

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isSeguidoresModalOpen, isSeguindoModalOpen, props.userId, currentUserId]);

    useEffect(() => {
        if (isSeguidoresModalOpen || isSeguindoModalOpen || isEditProfileModalOpen) {
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
    }, [isSeguidoresModalOpen, isSeguindoModalOpen, isEditProfileModalOpen]);

    const handleSeguidoresModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (seguidoresModalRef.current && !seguidoresModalRef.current.contains(e.target as Node)) {
            setIsSeguidoresModalOpen(false);
        }
    };

    const handleSeguindoModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (seguindoModalRef.current && !seguindoModalRef.current.contains(e.target as Node)) {
            setIsSeguindoModalOpen(false);
        }
    };

    const handleOpenSeguidores = async () => {
        setIsSeguidoresModalOpen(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/followers-list/${props.userId}`);
            setSeguidoresList(response.data.followers || []);
        } catch (error) {
            console.error('Erro ao buscar seguidores:', error);
            setSeguidoresList([]);
        }
    };

    const handleOpenSeguindo = async () => {
        setIsSeguindoModalOpen(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/following-list/${props.userId}`);
            setSeguindoList(response.data.following || []);
        } catch (error) {
            console.error('Erro ao buscar seguindo:', error);
            setSeguindoList([]);
        }
    };

    const handleFollowToggle = () => {
        if (!currentUserId) {
            setShowLoginToast(true);
            setTimeout(() => {
                setShowLoginToast(false);
            }, 3000);
            return;
        }

        if (isFollowLoading) return;
        
        setIsFollowLoading(true);
        const newFollowingState = !isFollowing;
        
        setIsFollowing(newFollowingState);
        setSeguidoresCount((prev: number) => newFollowingState ? (prev || 0) + 1 : Math.max(0, (prev || 0) - 1));
        
        const request = isFollowing
            ? axios.delete(`${import.meta.env.VITE_API_URL}/follow/${currentUserId}/${props.userId}`)
            : axios.post(`${import.meta.env.VITE_API_URL}/follow`, {
                origin_id: currentUserId,
                destiny_id: props.userId,
            });
        
        request
            .then(() => {
                setIsFollowLoading(false);
            })
            .catch((err) => {
                console.error('Erro ao seguir/deseguir:', err);
                setIsFollowing(isFollowing);
                setSeguidoresCount((prev: number) => isFollowing ? (prev || 0) + 1 : Math.max(0, (prev || 0) - 1));
                setIsFollowLoading(false);
            });
    };

    const handleProfileUpdate = (updatedData: any) => {
        if (props.onProfileUpdate) {
            props.onProfileUpdate(updatedData);
        }
    };

    return (
        <>
            {/* Toast de Login Necessário */}
            {showLoginToast && (
                <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-4 max-w-sm border border-gray-200 dark:border-gray-800">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                    Login Necessário
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Você precisa estar cadastrado para seguir outros usuários.
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowLoginToast(false)}
                                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header do Perfil */}
            <div className="w-full bg-white pt-20 dark:bg-[#131B24]">
                <div className="py-6 sm:py-8 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                        {/* Informações do Usuário */}
                        <div className="flex-1 lg:pt-10">
                            <div className="flex items-start justify-between sm:block">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 mb-1 dark:text-gray-100">
                                        {props.nickname}
                                    </h1>
                                    <p className="text-base sm:text-lg text-gray-500">
                                        @{props.name}
                                    </p>
                                </div>
                                
                                {/* Botão Edit/Follow Mobile */}
                                {props.ownProfile ? (
                                    <button 
                                        onClick={() => setIsEditProfileModalOpen(true)}
                                        className="sm:hidden p-2 hover:bg-gray-100 dark:bg-[#27313D] dark:hover:bg-gray-500 rounded-full transition-colors"
                                        aria-label="Editar perfil"
                                    >
                                        <svg 
                                            className="h-5 w-5 text-gray-700 dark:text-white" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                                            />
                                        </svg>
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleFollowToggle}
                                        className={`sm:hidden px-4 py-2 rounded-lg transition-colors text-sm font-medium w-[110px] flex items-center justify-center ${
                                            isFollowing 
                                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                                                : 'bg-gray-900 text-white hover:bg-gray-800'
                                        }`}
                                    >
                                        {isFollowing ? 'Seguindo' : 'Seguir'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Estatísticas */}
                        <div className="flex items-center gap-6 sm:gap-8 lg:gap-12">
                            <div className="text-center">
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {props.projetos}
                                </p>
                                <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
                                    {props.projetos === 1 ? 'Projeto' : 'Projetos'}
                                </p>
                            </div>
                            
                            <div 
                                className="text-center cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={handleOpenSeguidores}
                            >
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {seguidoresCount}
                                </p>
                                <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
                                    Seguidores
                                </p>
                            </div>
                            
                            <div 
                                className="text-center cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={handleOpenSeguindo}
                            >
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {seguindoCount}
                                </p>
                                <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
                                    Seguindo
                                </p>
                            </div>

                            {/* Botão Edit/Follow Desktop */}
                            {props.ownProfile ? (
                                <button 
                                    onClick={() => setIsEditProfileModalOpen(true)}
                                    className="cursor-pointer hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-[#27313D] dark:hover:bg-gray-500/50 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                                >
                                  <i className="fa-solid fa-pen"></i>
                                    Editar Perfil
                                </button>
                            ) : (
                                <button 
                                    onClick={handleFollowToggle}
                                    className={`cursor-pointer hidden sm:flex items-center justify-center gap-2 rounded-lg transition-colors text-sm font-medium w-[145px] h-[40px] ${
                                        isFollowing 
                                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                    }`}
                                >
                                    {isFollowing ? (
                                        <>
                                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Seguindo
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Seguir
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Seguidores */}
            {isSeguidoresModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    onClick={handleSeguidoresModalClick}
                >
                    <div 
                        ref={seguidoresModalRef}
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Seguidores
                            </h2>
                            <button 
                                onClick={() => setIsSeguidoresModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Lista de Seguidores */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {seguidoresList.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                    Nenhum seguidor ainda
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {seguidoresList.map((seguidor) => (
                                        <div 
                                            key={seguidor.id} 
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                                            onClick={() => window.location.href = `/perfil/${seguidor.name}`}
                                        >
                                            <img 
                                                src={seguidor.photo_url || '/default-avatar.png'} 
                                                alt={seguidor.nickname}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 dark:text-white truncate">
                                                    {seguidor.nickname}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    @{seguidor.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Seguindo */}
            {isSeguindoModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    onClick={handleSeguindoModalClick}
                >
                    <div 
                        ref={seguindoModalRef}
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Seguindo
                            </h2>
                            <button 
                                onClick={() => setIsSeguindoModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Lista de Seguindo */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {seguindoList.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                    Não está seguindo ninguém ainda
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {seguindoList.map((seguindo) => (
                                        <div 
                                            key={seguindo.id} 
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                                            onClick={() => window.location.href = `/perfil/${seguindo.name}`}
                                        >
                                            <img 
                                                src={seguindo.photo_url || '/default-avatar.png'} 
                                                alt={seguindo.nickname}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 dark:text-white truncate">
                                                    {seguindo.nickname}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    @{seguindo.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Editar Perfil */}
            <EditProfileModal
                isOpen={isEditProfileModalOpen}
                onClose={() => setIsEditProfileModalOpen(false)}
                userData={{
                    userId: props.userId,
                    nickname: props.nickname || '',
                    name: props.name || '',
                    bio: props.bio || '',
                    profession: props.profession || '',
                    phone: props.phone || '',
                    email: props.email || '',
                    photoUrl: props.photoUrl,
                    coverPhotoUrl: props.coverPhotoUrl
                }}
                onProfileUpdate={handleProfileUpdate}
            />
        </>
    );
}
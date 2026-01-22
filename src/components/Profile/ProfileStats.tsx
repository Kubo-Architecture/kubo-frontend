import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function ProfileStats(props: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [seguidoresCount, setSeguidoresCount] = useState(props.seguidores || 0);
    const [seguindoCount, setSeguindoCount] = useState(0);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [isSeguidoresModalOpen, setIsSeguidoresModalOpen] = useState(false);
    const [isSeguindoModalOpen, setIsSeguindoModalOpen] = useState(false);
    const [seguidoresList, setSeguidoresList] = useState<any[]>([]);
    const [seguindoList, setSeguindoList] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        nickname: props.nickname || "",
        name: props.name || "",
        profissao: props.profissao || "",
        descricao: props.descricao || "",
        telefone: props.telefone || "",
        email: props.email || "",
        instagram: props.instagram || "",
        linkedin: props.linkedin || ""
    });
    const currentUserId = window.localStorage.getItem('userId');
    const modalContentRef = useRef<HTMLDivElement>(null);
    const seguidoresModalRef = useRef<HTMLDivElement>(null);
    const seguindoModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isModalOpen) {
                setIsModalOpen(false);
            }
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

        if (currentUserId !== props.userId) {
            axios.get<any>(`${import.meta.env.VITE_API_URL}/is-following/${currentUserId}/${props.userId}`)
                .then((res: any) => setIsFollowing(res.data.isFollowing))
        }

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isModalOpen, isSeguidoresModalOpen, isSeguindoModalOpen, props.userId, currentUserId]);

    // Bloquear scroll do body quando o modal estiver aberto
    useEffect(() => {
        if (isModalOpen || isSeguidoresModalOpen || isSeguindoModalOpen) {
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen, isSeguidoresModalOpen, isSeguindoModalOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        console.log("Dados atualizados:", formData);
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setFormData({
            nickname: props.nickname || "",
            name: props.name || "",
            profissao: props.profissao || "",
            descricao: props.descricao || "",
            telefone: props.telefone || "",
            email: props.email || "",
            instagram: props.instagram || "",
            linkedin: props.linkedin || ""
        });
        setIsModalOpen(false);
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
            handleCancel();
        }
    };

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

    return (
        <>
            {/* Header do Perfil */}
            <div className="w-full bg-white pt-20 dark:bg-[#131B24]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
                                        onClick={() => setIsModalOpen(true)}
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
                                        className={`sm:hidden px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
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
                                    onClick={() => setIsModalOpen(true)}
                                    className="cursor-pointer hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-[#27313D] dark:hover:bg-gray-500/50 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                                >
                                  <i className="fa-solid fa-pen"></i>

                                    Editar Perfil
                                </button>
                            ) : (
                                <button 
                                    onClick={handleFollowToggle}
                                    className={`cursor-pointer hidden sm:flex items-center gap-2 px-6 py-2 rounded-lg transition-colors text-sm font-medium ${
                                        isFollowing 
                                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                    }`}
                                >
                                    {isFollowing ? (
                                        <>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Seguindo
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Modal de Edição */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleOverlayClick}
                >
                    <div
                        ref={modalContentRef}
                        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header do Modal */}
                        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Editar Perfil
                            </h2>
                            <button
                                onClick={handleCancel}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Fechar modal"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Conteúdo do Modal */}
                        <div className="px-6 py-6 overflow-y-auto flex-1">
                            {/* Informações Básicas */}
                            <div className="space-y-5">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Informações Básicas
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Nome de exibição
                                                </label>
                                                <input
                                                    type="text"
                                                    id="nickname"
                                                    name="nickname"
                                                    value={formData.nickname}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400"
                                                    placeholder="Seu nome completo"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Nome de usuário
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400"
                                                    placeholder="seunome"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="profissao" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Profissão
                                            </label>
                                            <input
                                                type="text"
                                                id="profissao"
                                                name="profissao"
                                                value={formData.profissao}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400"
                                                placeholder="Ex: Arquiteto(a) Urbanista"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Descrição
                                            </label>
                                            <textarea
                                                id="descricao"
                                                name="descricao"
                                                value={formData.descricao}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow resize-none text-gray-900 placeholder:text-gray-400"
                                                placeholder="Conte um pouco sobre você, sua experiência e áreas de atuação..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contato e Redes Sociais */}
                                <div className="pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Contato e Redes Sociais
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Telefone
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="telefone"
                                                    name="telefone"
                                                    value={formData.telefone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400"
                                                    placeholder="(00) 00000-0000"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    E-mail
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400"
                                                    placeholder="seu@email.com"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Instagram
                                                </label>
                                                <input
                                                    type="text"
                                                    id="instagram"
                                                    name="instagram"
                                                    value={formData.instagram}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400"
                                                    placeholder="@seuperfil"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    LinkedIn
                                                </label>
                                                <input
                                                    type="text"
                                                    id="linkedin"
                                                    name="linkedin"
                                                    value={formData.linkedin}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400"
                                                    placeholder="linkedin.com/in/seuperfil"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer do Modal */}
                        <div className="px-6 py-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end flex-shrink-0 bg-gray-50">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-sm"
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Seguidores */}
            {isSeguidoresModalOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleSeguidoresModalClick}
                >
                    <div
                        ref={seguidoresModalRef}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[80vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                            <h2 className="text-xl font-bold text-gray-900">
                                Seguidores
                            </h2>
                            <button
                                onClick={() => setIsSeguidoresModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Fechar"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Lista */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {seguidoresList.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Nenhum seguidor ainda</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {seguidoresList.map((seguidor: any) => (
                                        <div
                                            key={seguidor.id}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <div 
                                                className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                                                style={{ 
                                                    backgroundImage: `url(${seguidor.photoUrl || '/default-avatar.png'})` 
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">
                                                    {seguidor.nickname || seguidor.name}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
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
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleSeguindoModalClick}
                >
                    <div
                        ref={seguindoModalRef}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[80vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                            <h2 className="text-xl font-bold text-gray-900">
                                Seguindo
                            </h2>
                            <button
                                onClick={() => setIsSeguindoModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Fechar"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Lista */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {seguindoList.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Não está seguindo ninguém</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {seguindoList.map((seguindo: any) => (
                                        <div
                                            key={seguindo.id}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <div 
                                                className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                                                style={{ 
                                                    backgroundImage: `url(${seguindo.photoUrl || '/default-avatar.png'})` 
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">
                                                    {seguindo.nickname || seguindo.name}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
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
        </>
    );
}
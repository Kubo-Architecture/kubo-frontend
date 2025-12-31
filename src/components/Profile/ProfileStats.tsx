import { useState, useEffect } from "react";
import PenIcon from "../../assets/Profile/pen.svg";

export default function ProfileStats(props: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    // Fechar modal com ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isModalOpen) {
                setIsModalOpen(false);
            }
        };
        
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isModalOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        // Aqui você pode adicionar a lógica para salvar as alterações
        console.log("Dados atualizados:", formData);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="h-[220px] min-w-[380px] w-full bg-white flex pt-[8px] px-[20px] md:px-[30px] lg:px-[40px] xl:px-[70px] md:mt-[10px] lg:mt-[18px]">
                <div className="flex-grow h-full flex flex-col lg:flex-row">
                    <div className="w-full lg:w-[400px] xl:w-[500px] h-3/4 xl:h-full flex flex-col lg:whitespace-nowrap justify-end items-start">
                        <h3 className="font-normal text-[30px] font-montserrat">{props.nickname}</h3>
                        <p className="text-[#4d4d4d]">@{props.name}</p>
                    </div>
                    <div className="w-full lg:w-2/4 h-1/4 flex items-center gap-5 lg:gap-10">
                        <p className="text-[18px] lg:text-[23px]"><strong className="text-[21px] lg:text-[25px] pr-1">{props.projetos}</strong>{props.projetos > 1 ? 'Projetos' : 'Projeto'}</p>
                        <p className="text-[18px] lg:text-[23px]"><strong className="text-[21px] lg:text-[25px] pr-1">{props.likes}</strong> Likes</p>
                        <p className="text-[18px] lg:text-[23px]"> <strong className="text-[21px] lg:text-[25px] pr-1">{props.seguidores}</strong> Seguidores</p>
                    </div>
                </div>
                {props.ownProfile && (
                    <div className="w-10 h-full flex justify-end items-start">
                        <button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
                            <img className="h-[20px] lg:h-[25px]" src={PenIcon} alt="Edit profile icon" />
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="relative max-w-3xl w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-lg overflow-hidden max-h-[85vh] flex flex-col">
                            <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0 flex items-center justify-between">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Editar Perfil</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="p-4 sm:p-6 overflow-y-auto">
                                {/* Informações Básicas */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Informações Básicas
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                                                Nome de exibição
                                            </label>
                                            <input
                                                type="text"
                                                id="nickname"
                                                name="nickname"
                                                value={formData.nickname}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                                                placeholder="Seu nome"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Nome de usuário
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                                                placeholder="@seunome"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label htmlFor="profissao" className="block text-sm font-medium text-gray-700 mb-2">
                                            Profissão
                                        </label>
                                        <input
                                            type="text"
                                            id="profissao"
                                            name="profissao"
                                            value={formData.profissao}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                                            placeholder="Ex: Arquiteto-Urbanista"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                                            Descrição
                                        </label>
                                        <textarea
                                            id="descricao"
                                            name="descricao"
                                            value={formData.descricao}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow resize-none"
                                            placeholder="Conte um pouco sobre você, sua experiência e áreas de atuação..."
                                        />
                                    </div>
                                </div>

                                {/* Redes Sociais e Contato */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Redes Sociais e Contato
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                                                Telefone
                                            </label>
                                            <input
                                                type="tel"
                                                id="telefone"
                                                name="telefone"
                                                value={formData.telefone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                                                placeholder="(00) 00000-0000"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                E-mail
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                                                placeholder="seu@email.com"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                                                Instagram
                                            </label>
                                            <input
                                                type="text"
                                                id="instagram"
                                                name="instagram"
                                                value={formData.instagram}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                                                placeholder="@seuperfil"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                                                LinkedIn
                                            </label>
                                            <input
                                                type="text"
                                                id="linkedin"
                                                name="linkedin"
                                                value={formData.linkedin}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                                                placeholder="linkedin.com/in/seuperfil"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Botões de ação */}
                                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base font-medium"
                                    >
                                        Salvar Alterações
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
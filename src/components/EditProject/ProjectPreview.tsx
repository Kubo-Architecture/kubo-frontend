import React from 'react';

interface ProjectPreviewProps {
    name: string;
    location: string;
    description: string;
    usageTypes: string[];
    customUsageType: string;
    mainImagePreview: string;
    isAuthor: boolean;
    author: string;
    materials: string[];
    terrainArea: string;
    buildArea: string;
    status: string;
    galleryPreviews: string[];
}

export default function ProjectPreview({
    name,
    location,
    description,
    usageTypes,
    customUsageType,
    mainImagePreview,
    isAuthor,
    author,
    materials,
    terrainArea,
    buildArea,
    status,
    galleryPreviews,
}: ProjectPreviewProps) {
    const userName = localStorage.getItem('name') || 
                     localStorage.getItem('username') || 
                     'Você';

    return (
        <div className="lg:pl-4 lg:sticky lg:top-20 lg:self-start">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Preview do Projeto
                    </h2>
                    <p className="text-gray-600 dark:text-neutral-400 text-sm">
                        Visualização em tempo real
                    </p>
                </div>

                <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-gray-200 dark:border-[#3d444d] overflow-hidden shadow-lg">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                            {name || 'Nome do Projeto'}
                        </h1>
                        
                        <div className="flex items-center gap-2 text-gray-600 dark:text-neutral-400 mb-4">
                            <i className="fas fa-location-dot text-sm"></i>
                            <span className="text-sm font-medium">
                                {location || 'Localização não informada'}
                            </span>
                        </div>

                        <p className="text-gray-700 dark:text-neutral-400 leading-relaxed text-sm mb-4">
                            {description || 'Nenhuma descrição fornecida'}
                        </p>

                        {usageTypes.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {usageTypes.map((type, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 dark:bg-[#202830] text-gray-700 dark:text-neutral-300 rounded-full text-xs font-medium border border-gray-200 dark:border-[#3d444d]"
                                    >
                                        {type === 'Outro' ? customUsageType : type}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="px-6 pb-4">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 dark:bg-[#202830] flex items-center justify-center">
                            {mainImagePreview ? (
                                <img
                                    src={mainImagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center">
                                    <i className="fas fa-image text-4xl text-gray-300 dark:text-neutral-600 mb-2"></i>
                                    <p className="text-sm text-gray-400 dark:text-neutral-500">
                                        Nenhuma imagem selecionada
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="px-6 pb-4 border-b border-gray-200 dark:border-[#3d444d]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-[#202830] dark:to-[#151B23] flex items-center justify-center">
                                <i className="fas fa-user text-xs text-gray-600 dark:text-neutral-400"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-neutral-500 uppercase tracking-wider font-medium">
                                    Autor do projeto
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {isAuthor ? userName : (author || 'Não informado')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {(materials.filter(m => m.trim()).length > 0 || terrainArea || buildArea || status) && (
                        <div className="p-6">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                                Especificações técnicas
                            </h3>

                            <div className="space-y-3">
                                {materials.filter(m => m.trim()).length > 0 && (
                                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#202830] border border-gray-200 dark:border-[#3d444d]">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase tracking-wider mb-1">
                                            Materiais
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {materials.filter(m => m.trim()).join(', ')}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    {terrainArea && (
                                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#202830] border border-gray-200 dark:border-[#3d444d]">
                                            <p className="text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase tracking-wider mb-1">
                                                Área terreno
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {terrainArea}m²
                                            </p>
                                        </div>
                                    )}

                                    {buildArea && (
                                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#202830] border border-gray-200 dark:border-[#3d444d]">
                                            <p className="text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase tracking-wider mb-1">
                                                Área construída
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {buildArea}m²
                                            </p>
                                        </div>
                                    )}

                                    {status && (
                                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#202830] border border-gray-200 dark:border-[#3d444d] col-span-2">
                                            <p className="text-xs font-semibold text-gray-500 dark:text-neutral-500 uppercase tracking-wider mb-1">
                                                Status
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {status}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {galleryPreviews.length > 0 && (
                        <div className="px-6 pb-6">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                                Galeria ({galleryPreviews.length})
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {galleryPreviews.slice(0, 6).map((preview, index) => (
                                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                                        <img
                                            src={preview}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            {galleryPreviews.length > 6 && (
                                <p className="text-xs text-gray-500 dark:text-neutral-500 mt-2 text-center">
                                    +{galleryPreviews.length - 6} imagens
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
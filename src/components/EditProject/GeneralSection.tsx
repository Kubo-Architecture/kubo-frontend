import React from 'react';

interface GeneralSectionProps {
    name: string;
    setName: (value: string) => void;
    location: string;
    setLocation: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    author: string;
    setAuthor: (value: string) => void;
    isAuthor: boolean;
    setIsAuthor: (value: boolean) => void;
    startDate: string;
    setStartDate: (value: string) => void;
    endDate: string;
    setEndDate: (value: string) => void;
    isOngoing: boolean;
    setIsOngoing: (value: boolean) => void;
    // Props para imagens
    mainImagePreview: string;
    galleryPreviews: string[];
    handleMainImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleGalleryImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeMainImage: () => void;
    removeGalleryImage: (index: number) => void;
    // Props para especificações técnicas
    usageTypes: string[];
    usageTypeOptions: string[];
    handleUsageTypeToggle: (type: string) => void;
    showCustomUsageType: boolean;
    customUsageType: string;
    setCustomUsageType: (value: string) => void;
    status: string;
    setStatus: (value: string) => void;
    terrainArea: string;
    setTerrainArea: (value: string) => void;
    buildArea: string;
    setBuildArea: (value: string) => void;
    // Props para materiais
    materials: string[];
    handleMaterialChange: (index: number, value: string) => void;
    addMaterialField: () => void;
    removeMaterialField: (index: number) => void;
}

export default function GeneralSection({
    name,
    setName,
    location,
    setLocation,
    description,
    setDescription,
    author,
    setAuthor,
    isAuthor,
    setIsAuthor,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isOngoing,
    setIsOngoing,
    mainImagePreview,
    galleryPreviews,
    handleMainImageChange,
    handleGalleryImagesChange,
    removeMainImage,
    removeGalleryImage,
    usageTypes,
    usageTypeOptions,
    handleUsageTypeToggle,
    showCustomUsageType,
    customUsageType,
    setCustomUsageType,
    status,
    setStatus,
    terrainArea,
    setTerrainArea,
    buildArea,
    setBuildArea,
    materials,
    handleMaterialChange,
    addMaterialField,
    removeMaterialField,
}: GeneralSectionProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Editar Projeto
                </h1>
                <p className="text-gray-600 dark:text-neutral-400">
                    Configure seu projeto
                </p>
            </div>

            {/* Informações Básicas */}
            <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-gray-200 dark:border-[#3d444d] p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Informações Básicas
                </h2>
                <p className="text-sm text-gray-500 dark:text-neutral-500 mb-6">
                    Dados principais do projeto
                </p>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                Nome do projeto *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#3d444d] bg-white dark:bg-[#202830] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                                placeholder="Casa Moderna em São Paulo"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                Localização *
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#3d444d] bg-white dark:bg-[#202830] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                                placeholder="São Paulo, SP"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                            Descrição *
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#3d444d] bg-white dark:bg-[#202830] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all resize-none text-sm"
                            placeholder="Descreva os conceitos, inspirações e características principais..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-3">
                            Autor da obra (Realização)
                        </label>
                        
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            disabled={isAuthor}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#3d444d] bg-white dark:bg-[#202830] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all text-sm disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-[#151B23] mb-3"
                            placeholder="Nome do arquiteto ou escritório"
                        />

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isAuthor"
                                checked={isAuthor}
                                onChange={(e) => {
                                    setIsAuthor(e.target.checked);
                                    if (e.target.checked) {
                                        setAuthor('');
                                    }
                                }}
                                className="w-4 h-4 rounded border-gray-300 dark:border-[#3d444d] text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                            />
                            <label htmlFor="isAuthor" className="text-sm text-gray-700 dark:text-neutral-300">
                                Eu sou o autor
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                Data de início
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#3d444d] bg-white dark:bg-[#202830] text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                Data de término
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                disabled={isOngoing}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#3d444d] bg-white dark:bg-[#202830] text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all text-sm disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-[#151B23]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isOngoing"
                            checked={isOngoing}
                            onChange={(e) => {
                                setIsOngoing(e.target.checked);
                                if (e.target.checked) {
                                    setEndDate('');
                                }
                            }}
                            className="w-4 h-4 rounded border-gray-300 dark:border-[#3d444d] text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                        />
                        <label htmlFor="isOngoing" className="text-sm text-gray-700 dark:text-neutral-300">
                            Projeto em andamento
                        </label>
                    </div>
                </div>
            </div>

            {/* Fotos e Mídia */}
            <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-gray-200 dark:border-[#3d444d] p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Fotos e Mídia
                </h2>
                <p className="text-sm text-gray-500 dark:text-neutral-500 mb-6">
                    Imagens do projeto
                </p>

                <div className="grid grid-cols-2 gap-6">
                    {/* Foto Principal */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                            Foto Principal *
                        </label>
                        <input
                            type="file"
                            id="mainPhotoGeral"
                            className="hidden"
                            accept="image/*"
                            onChange={handleMainImageChange}
                        />
                        <label
                            htmlFor="mainPhotoGeral"
                            className="relative block h-48 w-full cursor-pointer rounded-xl border-2 border-dashed border-gray-300 dark:border-[#3d444d] bg-gray-50 dark:bg-[#202830] hover:bg-gray-100 dark:hover:bg-[#151B23] transition overflow-hidden"
                        >
                            {mainImagePreview ? (
                                <div className="relative w-full h-full group">
                                    <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                removeMainImage();
                                            }}
                                            className="bg-white text-gray-900 px-3 py-2 rounded-lg font-medium text-xs hover:bg-gray-100"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <i className="fas fa-camera text-3xl text-gray-400 dark:text-neutral-500 mb-2"></i>
                                    <span className="text-xs text-gray-600 dark:text-neutral-400">Clique para adicionar</span>
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Galeria */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                            Galeria
                        </label>
                        <input
                            type="file"
                            id="galleryGeral"
                            multiple
                            className="hidden"
                            accept="image/*"
                            onChange={handleGalleryImagesChange}
                        />
                        <label
                            htmlFor="galleryGeral"
                            className="relative block h-48 w-full cursor-pointer rounded-xl border-2 border-dashed border-gray-300 dark:border-[#3d444d] bg-gray-50 dark:bg-[#202830] hover:bg-gray-100 dark:hover:bg-[#151B23] transition"
                        >
                            <div className="flex flex-col items-center justify-center h-full">
                                <i className="fas fa-images text-3xl text-gray-400 dark:text-neutral-500 mb-2"></i>
                                <span className="text-xs text-gray-600 dark:text-neutral-400">
                                    {galleryPreviews.length > 0 ? `${galleryPreviews.length} imagens` : 'Adicionar imagens'}
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-6 gap-2 mt-4">
                        {galleryPreviews.map((img, i) => (
                            <div key={i} className="relative group aspect-square">
                                <img src={img} alt={`${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                                <button
                                    type="button"
                                    onClick={() => removeGalleryImage(i)}
                                    className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 flex items-center justify-center"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Especificações Técnicas */}
            <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-gray-200 dark:border-[#3d444d] p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Especificações Técnicas
                </h2>
                <p className="text-sm text-gray-500 dark:text-neutral-500 mb-6">
                    Detalhes técnicos
                </p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-3">
                            Tipo de uso * <span className="text-xs text-gray-500 dark:text-neutral-400">(Até 3)</span>
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {usageTypeOptions.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleUsageTypeToggle(type)}
                                    disabled={!usageTypes.includes(type) && usageTypes.length >= 3}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border-2 ${
                                        usageTypes.includes(type)
                                            ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black dark:border-white'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 dark:bg-[#202830] dark:text-neutral-300 dark:border-[#3d444d]'
                                    } ${
                                        !usageTypes.includes(type) && usageTypes.length >= 3
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {showCustomUsageType && (
                        <div>
                            <label htmlFor="custom_usage_type_geral" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                Especifique "Outro" *
                            </label>
                            <input
                                type="text"
                                id="custom_usage_type_geral"
                                value={customUsageType}
                                onChange={(e) => setCustomUsageType(e.target.value)}
                                placeholder="Digite o tipo personalizado"
                                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-gray-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white text-sm text-gray-900 dark:text-white"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                Status *
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-gray-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white text-sm text-gray-900 dark:text-white"
                            >
                                <option value="">Selecione</option>
                                <option value="Em construção">Em construção</option>
                                <option value="Concluído">Concluído</option>
                                <option value="Em projeto">Em projeto</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="build_area" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                Área construída (m²)
                            </label>
                            <input
                                type="number"
                                id="build_area"
                                value={buildArea}
                                onChange={(e) => setBuildArea(e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-gray-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white text-sm text-gray-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="terrain_area" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                Área do terreno (m²)
                            </label>
                            <input
                                type="number"
                                id="terrain_area"
                                value={terrainArea}
                                onChange={(e) => setTerrainArea(e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-gray-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white text-sm text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Materiais */}
            <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-gray-200 dark:border-[#3d444d] p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Materiais Utilizados
                </h2>
                <p className="text-sm text-gray-500 dark:text-neutral-500 mb-6">
                    Lista de materiais
                </p>

                <div className="space-y-3">
                    {materials.map((material: string, index: number) => (
                        <div key={index} className="flex gap-3 items-center group">
                            <input
                                type="text"
                                value={material}
                                onChange={(e) => handleMaterialChange(index, e.target.value)}
                                placeholder={`Material ${index + 1}`}
                                className="flex-1 px-4 py-3 bg-white dark:bg-[#202830] border border-gray-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white text-sm text-gray-900 dark:text-white"
                            />
                            {materials.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeMaterialField(index)}
                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addMaterialField}
                        className="text-sm text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white font-medium flex items-center"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Adicionar material
                    </button>
                </div>
            </div>
        </div>
    );
}
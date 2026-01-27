import React from 'react';

interface TechnicalSectionProps {
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
}

export default function TechnicalSection({
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
}: TechnicalSectionProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Especificações Técnicas
                </h1>
                <p className="text-gray-600 dark:text-neutral-400">
                    Detalhes técnicos do projeto
                </p>
            </div>

            <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-gray-200 dark:border-[#3d444d] p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Tipo de Uso *
                </h2>
                <p className="text-sm text-gray-500 dark:text-neutral-500 mb-6">
                    Selecione até 3 tipos
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    {usageTypeOptions.map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => handleUsageTypeToggle(type)}
                            className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                                usageTypes.includes(type)
                                    ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-black'
                                    : 'border-gray-300 dark:border-[#3d444d] text-gray-700 dark:text-neutral-300 hover:border-gray-400 dark:hover:border-gray-500'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {showCustomUsageType && (
                    <input
                        type="text"
                        value={customUsageType}
                        onChange={(e) => setCustomUsageType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#3d444d] bg-white dark:bg-[#202830] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                        placeholder="Especifique o tipo de uso"
                    />
                )}
            </div>

            <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-gray-200 dark:border-[#3d444d] p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                            Status *
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#3d444d] bg-white dark:bg-[#202830] text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                            required
                        >
                            <option value="">Selecione o status</option>
                            <option value="Em construção">Em construção</option>
                            <option value="Concluído">Concluído</option>
                            <option value="Em projeto">Em projeto</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                Área do Terreno (m²)
                            </label>
                            <input
                                type="number"
                                value={terrainArea}
                                onChange={(e) => setTerrainArea(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#3d444d] bg-white dark:bg-[#202830] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                                placeholder="500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                Área Construída (m²)
                            </label>
                            <input
                                type="number"
                                value={buildArea}
                                onChange={(e) => setBuildArea(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#3d444d] bg-white dark:bg-[#202830] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                                placeholder="300"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
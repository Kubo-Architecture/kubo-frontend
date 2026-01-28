import React from 'react';

interface MaterialsSectionProps {
    materials: string[];
    handleMaterialChange: (index: number, value: string) => void;
    addMaterialField: () => void;
    removeMaterialField: (index: number) => void;
}

export default function MaterialsSection({
    materials,
    handleMaterialChange,
    addMaterialField,
    removeMaterialField,
}: MaterialsSectionProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Materiais
                </h1>
                <p className="text-gray-600 dark:text-neutral-400">
                    Materiais utilizados no projeto
                </p>
            </div>

            <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-gray-200 dark:border-[#3d444d] p-6">
                <div className="space-y-3">
                    {materials.map((material, index) => (
                        <div key={index} className="flex gap-3">
                            <input
                                type="text"
                                value={material}
                                onChange={(e) => handleMaterialChange(index, e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-[#3d444d] bg-white dark:bg-[#202830] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                                placeholder="Ex: Concreto, Vidro, Madeira..."
                            />
                            {materials.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeMaterialField(index)}
                                    className="px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addMaterialField}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-[#3d444d] text-gray-600 dark:text-neutral-400 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-all text-sm font-medium"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Adicionar Material
                    </button>
                </div>
            </div>
        </div>
    );
}
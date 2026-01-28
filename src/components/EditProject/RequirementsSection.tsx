import React from 'react';

interface RequirementsSectionProps {
    name: string;
    location: string;
    description: string;
    mainImagePreview: string;
    usageTypes: string[];
    status: string;
}

export default function RequirementsSection({
    name,
    location,
    description,
    mainImagePreview,
    usageTypes,
    status,
}: RequirementsSectionProps) {
    const requirements = [
        {
            label: 'Nome do Projeto',
            completed: name.trim() !== '',
            description: 'Campo obrigatório',
        },
        {
            label: 'Localização',
            completed: location.trim() !== '',
            description: 'Campo obrigatório',
        },
        {
            label: 'Descrição',
            completed: description.trim() !== '',
            description: 'Campo obrigatório',
        },
        {
            label: 'Imagem Principal',
            completed: mainImagePreview !== '',
            description: 'Campo obrigatório',
        },
        {
            label: 'Tipo de Uso',
            completed: usageTypes.length > 0,
            description: 'Campo obrigatório',
        },
        {
            label: 'Status',
            completed: status !== '',
            description: 'Campo obrigatório',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Requisitos
                </h1>
                <p className="text-gray-600 dark:text-neutral-400">
                    Verifique os campos obrigatórios
                </p>
            </div>

            <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-gray-200 dark:border-[#3d444d] p-6">
                <div className="space-y-4">
                    {requirements.map((requirement, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <i 
                                className={`fas ${
                                    requirement.completed 
                                        ? 'fa-check-circle text-green-500' 
                                        : 'fa-circle text-gray-300 dark:text-neutral-600'
                                } text-xl mt-0.5`}
                            />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {requirement.label}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-neutral-500">
                                    {requirement.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
import React from 'react';

interface RequiredFieldsSectionProps {
  formData: {
    name: string;
    location: string;
    description: string;
    usage_types: string[];
    custom_usage_type: string;
    status: string;
  };
  photo: File | null;
  showCustomUsageType: boolean;
}

export default function RequiredFieldsSection({
  formData,
  photo,
  showCustomUsageType,
}: RequiredFieldsSectionProps) {
  const requirements = [
    {
      label: 'Nome do projeto',
      completed: formData.name.trim() !== '',
      section: 'Geral'
    },
    {
      label: 'Localização',
      completed: formData.location.trim() !== '',
      section: 'Geral'
    },
    {
      label: 'Descrição',
      completed: formData.description.trim() !== '',
      section: 'Geral'
    },
    {
      label: 'Foto principal',
      completed: photo !== null,
      section: 'Fotos e Mídia'
    },
    {
      label: 'Tipo de uso (mínimo 1)',
      completed: formData.usage_types.length > 0,
      section: 'Especificações Técnicas'
    },
    {
      label: 'Especificar "Outro"',
      completed: !showCustomUsageType || formData.custom_usage_type.trim() !== '',
      section: 'Especificações Técnicas',
      conditional: showCustomUsageType
    },
    {
      label: 'Status do projeto',
      completed: formData.status !== '',
      section: 'Especificações Técnicas'
    },
  ];

  const activeRequirements = requirements.filter(req => !req.conditional || req.conditional);
  const completedCount = activeRequirements.filter(req => req.completed).length;
  const totalCount = activeRequirements.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
          Campos Obrigatórios
        </h2>
        <p className="text-sm text-zinc-500 dark:text-neutral-400">
          Progresso do preenchimento do projeto
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-600 dark:text-neutral-400">Progresso</span>
          <span className="font-bold text-zinc-900 dark:text-white">
            {completedCount}/{totalCount} campos
          </span>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-[#202830] rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-black dark:bg-white transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-zinc-600 dark:text-neutral-400 text-right">
          {progressPercentage.toFixed(0)}% concluído
        </p>
      </div>

      {/* Requirements List */}
      <div className="space-y-3">
        {activeRequirements.map((requirement, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              requirement.completed
                ? 'bg-zinc-50 dark:bg-[#202830] border-zinc-200 dark:border-[#3d444d]'
                : 'bg-white dark:bg-[#151B23] border-zinc-300 dark:border-[#3d444d] border-dashed'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                requirement.completed
                  ? 'bg-black dark:bg-white'
                  : 'bg-zinc-200 dark:bg-[#202830] border-2 border-zinc-300 dark:border-[#3d444d]'
              }`}
            >
              {requirement.completed && (
                <i className="fas fa-check text-white dark:text-black text-xs"></i>
              )}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  requirement.completed
                    ? 'text-zinc-900 dark:text-white'
                    : 'text-zinc-600 dark:text-neutral-400'
                }`}
              >
                {requirement.label}
              </p>
              <p className="text-xs text-zinc-500 dark:text-neutral-500">
                Seção: {requirement.section}
              </p>
            </div>
            {!requirement.completed && (
              <span className="text-xs px-2 py-1 bg-zinc-200 dark:bg-[#202830] text-zinc-700 dark:text-neutral-300 rounded-full font-medium">
                Pendente
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      {completedCount === totalCount ? (
        <div className="p-4 bg-black dark:bg-white rounded-xl border-2 border-black dark:border-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-black rounded-lg flex items-center justify-center">
              <i className="fas fa-check-circle text-black dark:text-white text-xl"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white dark:text-black">
                Todos os campos obrigatórios preenchidos!
              </p>
              <p className="text-xs text-white/80 dark:text-black/80">
                Você já pode cadastrar o projeto
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-zinc-50 dark:bg-[#202830] rounded-xl border border-zinc-200 dark:border-[#3d444d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center">
              <i className="fas fa-exclamation text-white dark:text-black"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-zinc-900 dark:text-white">
                {totalCount - completedCount} {totalCount - completedCount === 1 ? 'campo pendente' : 'campos pendentes'}
              </p>
              <p className="text-xs text-zinc-600 dark:text-neutral-400">
                Preencha os campos marcados como pendente
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
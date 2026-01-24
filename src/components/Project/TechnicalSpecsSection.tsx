import React from 'react';

interface TechnicalSpecsSectionProps {
  formData: {
    status: string;
    build_area: string;
    terrain_area: string;
    usage_types: string[];
    custom_usage_type: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleUsageTypeToggle: (type: string) => void;
  showCustomUsageType: boolean;
  usageTypeOptions: string[];
}

export default function TechnicalSpecsSection({
  formData,
  handleChange,
  handleUsageTypeToggle,
  showCustomUsageType,
  usageTypeOptions,
}: TechnicalSpecsSectionProps) {
  return (
    <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
          <i className="fas fa-cog mr-2"></i>
          Especificações Técnicas
        </h2>
        <p className="text-sm text-zinc-500 dark:text-neutral-400">Detalhes técnicos do projeto</p>
      </div>

      <div className="space-y-8">
        {/* Tipo de Uso */}
        <div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-3">
            Tipo de uso * <span className="text-sm font-normal text-zinc-500">(Selecione até 3)</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {usageTypeOptions.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleUsageTypeToggle(type)}
                disabled={!formData.usage_types.includes(type) && formData.usage_types.length >= 3}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border-2 ${
                  formData.usage_types.includes(type)
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                    : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400 dark:bg-[#202830] dark:text-neutral-300 dark:border-[#3d444d] dark:hover:border-[#4a5360]'
                } ${
                  !formData.usage_types.includes(type) && formData.usage_types.length >= 3
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 dark:text-neutral-500 mt-2">
            Selecionados: {formData.usage_types.length}/3
          </p>
        </div>

        {showCustomUsageType && (
          <div>
            <label htmlFor="custom_usage_type" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Especifique "Outro" *
            </label>
            <input
              type="text"
              id="custom_usage_type"
              name="custom_usage_type"
              placeholder="Digite o tipo personalizado de uso"
              value={formData.custom_usage_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm text-zinc-900 dark:text-white"
            />
          </div>
        )}

        {/* Status e Áreas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="status_technical" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Status do projeto *
            </label>
            <select
              id="status_technical"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm text-zinc-900 dark:text-white"
            >
              <option value="">Selecione o status</option>
              <option value="Em planejamento">Em planejamento</option>
              <option value="Em construção">Em construção</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>

          <div>
            <label htmlFor="build_area_technical" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Área construída (m²)
            </label>
            <input
              type="number"
              id="build_area_technical"
              name="build_area"
              value={formData.build_area}
              onChange={handleChange}
              placeholder="Ex: 120.50"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm text-zinc-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="terrain_area_technical" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Área do terreno (m²)
            </label>
            <input
              type="number"
              id="terrain_area_technical"
              name="terrain_area"
              value={formData.terrain_area}
              onChange={handleChange}
              placeholder="Ex: 250.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm text-zinc-900 dark:text-white"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-[#3d444d]">
          <p className="text-sm text-zinc-600 dark:text-neutral-400">
            <i className="fas fa-info-circle mr-2"></i>
            Campos marcados com * são obrigatórios
          </p>
        </div>
      </div>
    </div>
  );
}
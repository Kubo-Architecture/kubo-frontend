import React from 'react';

interface TechnicalSpecsSectionProps {
  formData: {
    status: string;
    build_area: string;
    terrain_area: string;
    usage_types: string[];
    custom_usage_type: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleUsageTypeToggle: (type: string) => void;
  showCustomUsageType: boolean;
  usageTypeOptions: string[];
}

export default function TechnicalSpecsSection({
  formData,
  setFormData,
  handleChange,
  handleUsageTypeToggle,
  showCustomUsageType,
  usageTypeOptions,
}: TechnicalSpecsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Tipo de Uso */}
      <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Tipo de Uso *
          </h2>
          <p className="text-sm text-zinc-500 dark:text-neutral-400">Selecione até 3 tipos de uso para o projeto</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {usageTypeOptions.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleUsageTypeToggle(type)}
                disabled={!formData.usage_types.includes(type) && formData.usage_types.length >= 3}
                className={`px-4 py-3.5 rounded-xl text-sm font-medium transition-all border-2 ${
                  formData.usage_types.includes(type)
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md'
                    : 'bg-white text-zinc-700 border-zinc-300 hover:border-black hover:shadow-sm dark:bg-[#202830] dark:text-neutral-300 dark:border-[#3d444d] dark:hover:border-white'
                } ${
                  !formData.usage_types.includes(type) && formData.usage_types.length >= 3
                    ? 'opacity-40 cursor-not-allowed'
                    : ''
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-[#202830] rounded-lg">
            <span className="text-sm text-zinc-600 dark:text-neutral-400">
              Selecionados
            </span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
              {formData.usage_types.length}/3
            </span>
          </div>
        </div>

        {showCustomUsageType && (
          <div className="pt-4 border-t border-zinc-200 dark:border-[#3d444d]">
            <label htmlFor="custom_usage_type" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Especifique "Outro" *
            </label>
            <input
              type="text"
              id="custom_usage_type"
              name="custom_usage_type"
              placeholder="Ex: Misto (Residencial + Comercial)"
              value={formData.custom_usage_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-neutral-500"
            />
          </div>
        )}
      </div>

      {/* Status do Projeto */}
      <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Status do Projeto *
          </h2>
          <p className="text-sm text-zinc-500 dark:text-neutral-400">Estágio atual do projeto</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { value: 'Em planejamento', icon: 'fa-lightbulb' },
            { value: 'Em construção', icon: 'fa-hammer' },
            { value: 'Concluído', icon: 'fa-circle-check' }
          ].map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => {
                setFormData((prev: any) => ({
                  ...prev,
                  status: prev.status === status.value ? '' : status.value
                }));
              }}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.status === status.value
                  ? 'border-black dark:border-white bg-black dark:bg-white shadow-md'
                  : 'border-zinc-300 dark:border-[#3d444d] bg-white dark:bg-[#202830] hover:border-black dark:hover:border-white hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  formData.status === status.value
                    ? 'bg-white dark:bg-black'
                    : 'bg-zinc-100 dark:bg-[#151B23]'
                }`}>
                  <i className={`fas ${status.icon} text-lg ${
                    formData.status === status.value
                      ? 'text-black dark:text-white'
                      : 'text-zinc-600 dark:text-neutral-400'
                  }`}></i>
                </div>
                <h3 className={`text-sm font-semibold ${
                  formData.status === status.value
                    ? 'text-white dark:text-black'
                    : 'text-zinc-900 dark:text-white'
                }`}>
                  {status.value}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Áreas */}
      <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Medidas do Projeto
          </h2>
          <p className="text-sm text-zinc-500 dark:text-neutral-400">Áreas em metros quadrados (m²)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Área Construída */}
          <div className="space-y-3">
            <label htmlFor="build_area_technical" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300">
              <i className="fas fa-house mr-2 text-zinc-500 dark:text-neutral-500"></i>
              Área construída
            </label>
            <div className="relative">
              <input
                type="number"
                id="build_area_technical"
                name="build_area"
                value={formData.build_area}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-4 pr-12 py-3.5 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-neutral-500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500 dark:text-neutral-500 font-medium">
                m²
              </span>
            </div>
            {formData.build_area && (
              <p className="text-xs text-zinc-600 dark:text-neutral-400">
                {parseFloat(formData.build_area).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m² de área construída
              </p>
            )}
          </div>

          {/* Área do Terreno */}
          <div className="space-y-3">
            <label htmlFor="terrain_area_technical" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300">
              <i className="fas fa-mountain mr-2 text-zinc-500 dark:text-neutral-500"></i>
              Área do terreno
            </label>
            <div className="relative">
              <input
                type="number"
                id="terrain_area_technical"
                name="terrain_area"
                value={formData.terrain_area}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-4 pr-12 py-3.5 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-neutral-500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500 dark:text-neutral-500 font-medium">
                m²
              </span>
            </div>
            {formData.terrain_area && (
              <p className="text-xs text-zinc-600 dark:text-neutral-400">
                {parseFloat(formData.terrain_area).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m² de terreno
              </p>
            )}
          </div>
        </div>

        {/* Taxa de Ocupação */}
        {formData.build_area && formData.terrain_area && parseFloat(formData.terrain_area) > 0 && (
          <div className="pt-4 border-t border-zinc-200 dark:border-[#3d444d]">
            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-[#202830] rounded-xl border border-zinc-200 dark:border-[#3d444d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                  <i className="fas fa-calculator text-white dark:text-black"></i>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 dark:text-neutral-400 font-medium uppercase tracking-wider">
                    Taxa de ocupação
                  </p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {((parseFloat(formData.build_area) / parseFloat(formData.terrain_area)) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-600 dark:text-neutral-400">Área construída / Área do terreno</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Validação - Campos Faltando */}
      {(formData.usage_types.length === 0 || !formData.status || (showCustomUsageType && !formData.custom_usage_type.trim())) && (
        <div className="bg-white dark:bg-[#151B23] rounded-2xl border-2 border-zinc-900 dark:border-white p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-black dark:bg-white flex items-center justify-center flex-shrink-0">
              <i className="fas fa-exclamation text-white dark:text-black text-lg"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                Campos obrigatórios pendentes
              </h3>
              <p className="text-sm text-zinc-600 dark:text-neutral-400">
                Preencha os seguintes campos para continuar:
              </p>
            </div>
          </div>

          <ul className="space-y-2">
            {formData.usage_types.length === 0 && (
              <li className="flex items-center gap-2 text-sm text-zinc-700 dark:text-neutral-300">
                <i className="fas fa-circle text-[6px] text-zinc-600 dark:text-neutral-400"></i>
                <span>Selecione pelo menos um <strong>Tipo de Uso</strong></span>
              </li>
            )}
            {!formData.status && (
              <li className="flex items-center gap-2 text-sm text-zinc-700 dark:text-neutral-300">
                <i className="fas fa-circle text-[6px] text-zinc-600 dark:text-neutral-400"></i>
                <span>Selecione o <strong>Status do Projeto</strong></span>
              </li>
            )}
            {showCustomUsageType && !formData.custom_usage_type.trim() && (
              <li className="flex items-center gap-2 text-sm text-zinc-700 dark:text-neutral-300">
                <i className="fas fa-circle text-[6px] text-zinc-600 dark:text-neutral-400"></i>
                <span>Especifique o tipo de uso <strong>"Outro"</strong></span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
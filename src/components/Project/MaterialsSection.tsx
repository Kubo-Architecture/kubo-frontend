
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
    <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
          <i className="fas fa-layer-group mr-2"></i>
          Materiais Utilizados
        </h2>
        <p className="text-sm text-zinc-500 dark:text-neutral-400">Lista de materiais principais utilizados no projeto</p>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-50 dark:bg-[#202830] rounded-xl p-4">
          <div className="flex items-center gap-3 text-zinc-700 dark:text-neutral-300 mb-3">
            <i className="fas fa-info-circle text-black"></i>
            <span className="text-sm">Adicione os materiais principais utilizados na construção</span>
          </div>
        </div>

        <div className="space-y-4">
          {materials.map((material, index) => (
            <div key={index} className="flex gap-3 items-center group">
              <div className="flex-1">
                <label htmlFor={`material-${index}`} className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                  Material {index + 1}
                </label>
                <input
                  type="text"
                  id={`material-${index}`}
                  value={material}
                  onChange={(e) => handleMaterialChange(index, e.target.value)}
                  placeholder="Ex: Concreto aparente, Madeira de reflorestamento, Vidro temperado..."
                  className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm text-zinc-900 dark:text-white"
                />
              </div>
              {materials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMaterialField(index)}
                  className="mt-6 w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Remover material"
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addMaterialField}
            className="w-full px-4 py-3 border-2 border-dashed border-zinc-300 dark:border-[#3d444d] rounded-xl hover:border-zinc-400 dark:hover:border-[#4a5360] hover:bg-zinc-50 dark:hover:bg-[#202830] transition-colors"
          >
            <div className="flex items-center justify-center gap-2 text-zinc-600 dark:text-neutral-400 hover:text-black dark:hover:text-white">
              <i className="fas fa-plus"></i>
              <span className="text-sm font-medium">Adicionar novo material</span>
            </div>
          </button>
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-[#3d444d]">
          <p className="text-sm text-zinc-600 dark:text-neutral-400">
            <i className="fas fa-lightbulb mr-2"></i>
            Dica: Liste os materiais mais relevantes ou característicos do projeto
          </p>
        </div>
      </div>
    </div>
  );
}
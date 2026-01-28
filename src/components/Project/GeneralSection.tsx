import React from 'react';

interface GeneralSectionProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleUsageTypeToggle: (type: string) => void;
  mainImagePreview: string | null;
  galleryPreviews: string[];
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeMainImage: () => void;
  removeGalleryImage: (index: number) => void;
  handleMaterialChange: (index: number, value: string) => void;
  addMaterialField: () => void;
  removeMaterialField: (index: number) => void;
  showCustomUsageType: boolean;
  usageTypeOptions: string[];
}

export default function GeneralSection({
  formData,
  handleChange,
  handleUsageTypeToggle,
  mainImagePreview,
  galleryPreviews,
  handlePhotoChange,
  handleGalleryChange,
  removeMainImage,
  removeGalleryImage,
  handleMaterialChange,
  addMaterialField,
  removeMaterialField,
  showCustomUsageType,
  usageTypeOptions,
}: GeneralSectionProps) {
  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Novo Projeto</h1>
          <p className="text-sm text-zinc-500 dark:text-neutral-400 mb-4">Configure seu projeto</p>
          
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 mt-6">
            Informações Básicas
          </h2>
          <p className="text-sm text-zinc-500 dark:text-neutral-400">Dados principais do projeto</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                Nome do projeto *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Casa Moderna em São Paulo"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                Localização *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="São Paulo, SP"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Descrição *
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Descreva os conceitos, inspirações e características principais..."
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm resize-none text-zinc-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Autor da obra (Realização)
            </label>
            <input
              type="text"
              id="author"
              name="author"
              placeholder="Nome do arquiteto ou escritório"
              value={formData.author}
              onChange={handleChange}
              disabled={formData.isAuthor}
              className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm disabled:bg-zinc-50 dark:disabled:bg-[#151B23] disabled:text-zinc-500 dark:disabled:text-neutral-500 text-zinc-900 dark:text-white"
            />
            <label htmlFor="isAuthor" className="flex items-center mt-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  id="isAuthor"
                  name="isAuthor"
                  checked={formData.isAuthor}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                  formData.isAuthor
                    ? 'bg-black dark:bg-white border-black dark:border-white'
                    : 'bg-white dark:bg-[#202830] border-zinc-300 dark:border-[#3d444d] group-hover:border-black dark:group-hover:border-white'
                }`}>
                  {formData.isAuthor && (
                    <i className="fas fa-check text-white dark:text-black text-xs"></i>
                  )}
                </div>
              </div>
              <span className="ml-2 text-sm text-zinc-600 dark:text-neutral-400">Eu sou o autor</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                Data de início
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                Data de término
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.isOngoing}
                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm disabled:bg-zinc-50 dark:disabled:bg-[#151B23] disabled:text-zinc-500 dark:disabled:text-neutral-500 text-zinc-900 dark:text-white"
              />
              <label htmlFor="isOngoing" className="flex items-center mt-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="isOngoing"
                    name="isOngoing"
                    checked={formData.isOngoing}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                    formData.isOngoing
                      ? 'bg-black dark:bg-white border-black dark:border-white'
                      : 'bg-white dark:bg-[#202830] border-zinc-300 dark:border-[#3d444d] group-hover:border-black dark:group-hover:border-white'
                  }`}>
                    {formData.isOngoing && (
                      <i className="fas fa-check text-white dark:text-black text-xs"></i>
                    )}
                  </div>
                </div>
                <span className="ml-2 text-sm text-zinc-600 dark:text-neutral-400">Projeto ainda em andamento</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Fotos */}
      <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Fotos e Mídia
          </h2>
          <p className="text-sm text-zinc-500 dark:text-neutral-400">Imagens do projeto</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Foto Principal */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Foto Principal *
            </label>
            <input
              type="file"
              id="mainPhotoGeral"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              required
            />
            <label
              htmlFor="mainPhotoGeral"
              className="relative block h-48 w-full cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 dark:border-[#3d444d] bg-zinc-50 dark:bg-[#202830] hover:bg-zinc-100 dark:hover:bg-[#151B23] transition overflow-hidden"
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
                      className="bg-white text-zinc-900 px-3 py-2 rounded-lg font-medium text-xs hover:bg-zinc-100"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <i className="fa-solid fa-camera text-3xl text-zinc-400 dark:text-neutral-500 mb-2"></i>
                  <span className="text-xs text-zinc-600 dark:text-neutral-400">Clique para adicionar</span>
                </div>
              )}
            </label>
          </div>

          {/* Galeria */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Galeria
            </label>
            <input
              type="file"
              id="galleryGeral"
              multiple
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleGalleryChange}
            />
            <label
              htmlFor="galleryGeral"
              className="relative block h-48 w-full cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 dark:border-[#3d444d] bg-zinc-50 dark:bg-[#202830] hover:bg-zinc-100 dark:hover:bg-[#151B23] transition"
            >
              <div className="flex flex-col items-center justify-center h-full">
                <i className="fa-solid fa-images text-3xl text-zinc-400 dark:text-neutral-500 mb-2"></i>
                <span className="text-xs text-zinc-600 dark:text-neutral-400">
                  {galleryPreviews.length > 0 ? `${galleryPreviews.length} imagens` : 'Adicionar imagens'}
                </span>
              </div>
            </label>
          </div>
        </div>

        {galleryPreviews.length > 0 && (
          <div className="grid grid-cols-6 gap-2">
            {galleryPreviews.map((img, i) => (
              <div key={i} className="relative group aspect-square">
                <img src={img} alt={`${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 flex items-center justify-center"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Especificações Técnicas */}
      <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Especificações Técnicas
          </h2>
          <p className="text-sm text-zinc-500 dark:text-neutral-400">Detalhes técnicos</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-3">
              Tipo de uso * <span className="text-xs text-zinc-500 dark:text-neutral-400">(Até 3)</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {usageTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleUsageTypeToggle(type)}
                  disabled={!formData.usage_types.includes(type) && formData.usage_types.length >= 3}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border-2 ${
                    formData.usage_types.includes(type)
                      ? 'bg-black text-white border-black dark:bg-white dark:text-black'
                      : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400 dark:bg-[#202830] dark:text-neutral-300 dark:border-[#3d444d]'
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
          </div>

          {showCustomUsageType && (
            <div>
              <label htmlFor="custom_usage_type_geral" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                Especifique "Outro" *
              </label>
              <input
                type="text"
                id="custom_usage_type_geral"
                name="custom_usage_type"
                placeholder="Digite o tipo personalizado"
                value={formData.custom_usage_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm text-zinc-900 dark:text-white"
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm text-zinc-900 dark:text-white"
              >
                <option value="">Selecione</option>
                <option value="Em planejamento">Em planejamento</option>
                <option value="Em construção">Em construção</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>

            <div>
              <label htmlFor="build_area" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                Área construída (m²)
              </label>
              <input
                type="number"
                id="build_area"
                name="build_area"
                value={formData.build_area}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="terrain_area" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                Área do terreno (m²)
              </label>
              <input
                type="number"
                id="terrain_area"
                name="terrain_area"
                value={formData.terrain_area}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm text-zinc-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Materiais */}
      <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Materiais Utilizados
          </h2>
          <p className="text-sm text-zinc-500 dark:text-neutral-400">Lista de materiais</p>
        </div>

        <div className="space-y-3">
          {formData.materials.map((material: string, index: number) => (
            <div key={index} className="flex gap-3 items-center group">
              <input
                type="text"
                value={material}
                onChange={(e) => handleMaterialChange(index, e.target.value)}
                placeholder={`Material ${index + 1}`}
                className="flex-1 px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm text-zinc-900 dark:text-white"
              />
              {formData.materials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMaterialField(index)}
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addMaterialField}
            className="text-sm text-zinc-600 dark:text-neutral-400 hover:text-black dark:hover:text-white font-medium flex items-center"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Adicionar material
          </button>
        </div>
      </div>
    </div>
  );
}
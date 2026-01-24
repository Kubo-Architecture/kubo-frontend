import React from 'react';

interface BasicInfoSectionProps {
  formData: {
    name: string;
    location: string;
    description: string;
    author: string;
    isAuthor: boolean;
    startDate: string;
    endDate: string;
    isOngoing: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function BasicInfoSection({ formData, handleChange }: BasicInfoSectionProps) {
  return (
    <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
          <i className="fas fa-info-circle mr-2"></i>
          Informações Básicas
        </h2>
        <p className="text-sm text-zinc-500 dark:text-neutral-400">Nome, local e descrição do projeto</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name_basic" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Nome do projeto *
            </label>
            <input
              type="text"
              id="name_basic"
              name="name"
              placeholder="Casa Moderna em São Paulo"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm text-zinc-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="location_basic" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Localização *
            </label>
            <input
              type="text"
              id="location_basic"
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
          <label htmlFor="description_basic" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
            Descrição
          </label>
          <textarea
            id="description_basic"
            name="description"
            placeholder="Descreva os conceitos, inspirações e características principais..."
            rows={6}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm resize-none text-zinc-900 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="author_basic" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
            Autor da obra (Realização)
          </label>
          <input
            type="text"
            id="author_basic"
            name="author"
            placeholder="Nome do arquiteto ou escritório"
            value={formData.author}
            onChange={handleChange}
            disabled={formData.isAuthor}
            className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm disabled:bg-zinc-50 dark:disabled:bg-[#151B23] disabled:text-zinc-500 dark:disabled:text-neutral-500 text-zinc-900 dark:text-white"
          />
          <label className="flex items-center mt-3 cursor-pointer">
            <input
              type="checkbox"
              name="isAuthor"
              checked={formData.isAuthor}
              onChange={handleChange}
              className="w-4 h-4 rounded border-zinc-300 dark:border-[#3d444d] text-black dark:text-white focus:ring-black dark:focus:ring-white"
            />
            <span className="ml-2 text-sm text-zinc-600 dark:text-neutral-400">Eu sou o autor</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate_basic" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Data de início
            </label>
            <input
              type="date"
              id="startDate_basic"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm text-zinc-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="endDate_basic" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Data de término
            </label>
            <input
              type="date"
              id="endDate_basic"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              disabled={formData.isOngoing}
              className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm disabled:bg-zinc-50 dark:disabled:bg-[#151B23] disabled:text-zinc-500 dark:disabled:text-neutral-500 text-zinc-900 dark:text-white"
            />
            <label className="flex items-center mt-3 cursor-pointer">
              <input
                type="checkbox"
                name="isOngoing"
                checked={formData.isOngoing}
                onChange={handleChange}
                className="w-4 h-4 rounded border-zinc-300 dark:border-[#3d444d] text-black dark:text-white focus:ring-black dark:focus:ring-white"
              />
              <span className="ml-2 text-sm text-zinc-600 dark:text-neutral-400">Projeto ainda em andamento</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
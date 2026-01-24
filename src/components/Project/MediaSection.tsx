import React from 'react';

interface MediaSectionProps {
  mainImagePreview: string | null;
  galleryPreviews: string[];
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeMainImage: () => void;
  removeGalleryImage: (index: number) => void;
}

export default function MediaSection({
  mainImagePreview,
  galleryPreviews,
  handlePhotoChange,
  handleGalleryChange,
  removeMainImage,
  removeGalleryImage,
}: MediaSectionProps) {
  return (
    <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
          <i className="fas fa-images mr-2"></i>
          Fotos e Mídia
        </h2>
        <p className="text-sm text-zinc-500 dark:text-neutral-400">Imagens do projeto</p>
      </div>

      <div className="space-y-8">
        {/* Foto Principal */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Foto Principal</h3>
              <p className="text-sm text-zinc-500 dark:text-neutral-400">Imagem principal que será exibida como capa</p>
            </div>
            {mainImagePreview && (
              <button
                type="button"
                onClick={removeMainImage}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 font-medium"
              >
                Remover
              </button>
            )}
          </div>
          
          <input
            type="file"
            id="mainPhoto"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            required
          />
          <label
            htmlFor="mainPhoto"
            className="relative block h-64 w-full cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 dark:border-[#3d444d] bg-zinc-50 dark:bg-[#202830] hover:bg-zinc-100 dark:hover:bg-[#151B23] transition overflow-hidden"
          >
            {mainImagePreview ? (
              <div className="relative w-full h-full">
                <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6">
                <i className="fas fa-camera text-4xl text-zinc-400 dark:text-neutral-500 mb-4"></i>
                <span className="text-sm font-medium text-zinc-600 dark:text-neutral-400 mb-1">Clique para adicionar foto principal</span>
                <span className="text-xs text-zinc-500 dark:text-neutral-500">JPEG, PNG ou WebP • Máx. 10MB</span>
              </div>
            )}
          </label>
        </div>

        {/* Galeria */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Galeria</h3>
              <p className="text-sm text-zinc-500 dark:text-neutral-400">
                Imagens adicionais para mostrar diferentes ângulos e detalhes
              </p>
            </div>
            {galleryPreviews.length > 0 && (
              <div className="text-sm text-zinc-600 dark:text-neutral-400">
                {galleryPreviews.length} de 20 imagens
              </div>
            )}
          </div>
          
          <input
            type="file"
            id="gallery"
            multiple
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleGalleryChange}
          />
          <label
            htmlFor="gallery"
            className="relative block h-48 w-full cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 dark:border-[#3d444d] bg-zinc-50 dark:bg-[#202830] hover:bg-zinc-100 dark:hover:bg-[#151B23] transition mb-6"
          >
            <div className="flex flex-col items-center justify-center h-full p-6">
              <i className="fas fa-images text-4xl text-zinc-400 dark:text-neutral-500 mb-4"></i>
              <span className="text-sm font-medium text-zinc-600 dark:text-neutral-400 mb-1">Adicionar imagens à galeria</span>
              <span className="text-xs text-zinc-500 dark:text-neutral-500">Máx. 20 imagens • 50MB no total</span>
            </div>
          </label>

          {galleryPreviews.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-3">Imagens adicionadas</h4>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {galleryPreviews.map((img, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden">
                    <img src={img} alt={`Galeria ${i + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="bg-white text-zinc-900 px-3 py-1.5 rounded-md font-medium text-xs hover:bg-zinc-100"
                      >
                        Remover
                      </button>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
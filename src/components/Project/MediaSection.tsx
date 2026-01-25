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
    <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 flex flex-col max-h-[500px]">
      <div className="flex-shrink-0">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
          <i className="fas fa-images mr-2"></i>
          Fotos e Mídia
        </h2>
        <p className="text-sm text-zinc-500 dark:text-neutral-400">Imagens do projeto</p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6 mt-6 overflow-auto min-h-0">
        {/* Foto Principal */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Foto Principal</h3>
              <p className="text-sm text-zinc-500 dark:text-neutral-400">Imagem principal que será exibida como capa</p>
            </div>
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
            className="relative flex-1 cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 dark:border-[#3d444d] bg-zinc-50 dark:bg-[#202830] hover:bg-zinc-100 dark:hover:bg-[#151B23] transition overflow-hidden min-h-[250px] group"
          >
            {mainImagePreview ? (
              <div className="relative w-full h-full">
                <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeMainImage();
                    }}
                    className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-50 flex items-center gap-2"
                  >
                    <i className="fas fa-trash"></i>
                    Remover
                  </button>
                </div>
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
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
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
          
          {galleryPreviews.length === 0 ? (
            <>
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
                className="relative flex-1 cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 dark:border-[#3d444d] bg-zinc-50 dark:bg-[#202830] hover:bg-zinc-100 dark:hover:bg-[#151B23] transition min-h-[250px]"
              >
                <div className="flex flex-col items-center justify-center h-full p-6">
                  <i className="fas fa-images text-4xl text-zinc-400 dark:text-neutral-500 mb-4"></i>
                  <span className="text-sm font-medium text-zinc-600 dark:text-neutral-400 mb-1">Adicionar imagens à galeria</span>
                  <span className="text-xs text-zinc-500 dark:text-neutral-500">Máx. 20 imagens • 50MB no total</span>
                </div>
              </label>
            </>
          ) : (
            <div className="flex-1 overflow-auto min-h-0">
              <input
                type="file"
                id="gallery"
                multiple
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleGalleryChange}
              />
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pb-2">
                <label
                  htmlFor="gallery"
                  className="aspect-square cursor-pointer rounded-lg border-2 border-dashed border-zinc-300 dark:border-[#3d444d] bg-zinc-50 dark:bg-[#202830] hover:bg-zinc-100 dark:hover:bg-[#151B23] transition flex items-center justify-center"
                >
                  <i className="fas fa-plus text-2xl text-zinc-400 dark:text-neutral-500"></i>
                </label>
                {galleryPreviews.map((img, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden">
                    <img src={img} alt={`Galeria ${i + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="bg-white text-red-600 p-2 rounded-lg hover:bg-red-50"
                      >
                        <i className="fas fa-trash text-lg"></i>
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
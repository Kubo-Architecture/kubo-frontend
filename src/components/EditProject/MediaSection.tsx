import React from 'react';

interface MediaSectionProps {
    mainImagePreview: string;
    galleryPreviews: string[];
    handleMainImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleGalleryImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeMainImage: () => void;
    removeGalleryImage: (index: number) => void;
}

export default function MediaSection({
    mainImagePreview,
    galleryPreviews,
    handleMainImageChange,
    handleGalleryImagesChange,
    removeMainImage,
    removeGalleryImage,
}: MediaSectionProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Fotos e Mídia
                </h1>
                <p className="text-gray-600 dark:text-neutral-400">
                    Adicione imagens do seu projeto
                </p>
            </div>

            <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-gray-200 dark:border-[#3d444d] p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Imagem Principal *
                </h2>

                {mainImagePreview && (
                    <div className="relative mb-4 aspect-video rounded-xl overflow-hidden">
                        <img
                            src={mainImagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={removeMainImage}
                            className="absolute top-3 right-3 w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                )}

                <label className="block cursor-pointer">
                    <div className="w-full px-6 py-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-[#3d444d] hover:border-gray-400 dark:hover:border-gray-500 transition-colors text-center bg-gray-50 dark:bg-[#202830]">
                        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                        <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                            Clique para escolher a imagem principal
                        </p>
                        <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
                            PNG, JPG até 10MB
                        </p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="hidden"
                    />
                </label>
            </div>

            <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-gray-200 dark:border-[#3d444d] p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Galeria de Imagens
                </h2>
                <p className="text-sm text-gray-500 dark:text-neutral-500 mb-6">
                    {galleryPreviews.length}/20 imagens
                </p>

                {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                        {galleryPreviews.map((preview, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                <img
                                    src={preview}
                                    alt={`Gallery ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeGalleryImage(index)}
                                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                                >
                                    <i className="fas fa-times text-sm"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <label className="block cursor-pointer">
                    <div className="w-full px-6 py-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-[#3d444d] hover:border-gray-400 dark:hover:border-gray-500 transition-colors text-center bg-gray-50 dark:bg-[#202830]">
                        <i className="fas fa-images text-4xl text-gray-400 mb-3"></i>
                        <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                            Adicionar mais imagens à galeria
                        </p>
                        <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
                            Até 20 imagens, 50MB total
                        </p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryImagesChange}
                        className="hidden"
                    />
                </label>
            </div>
        </div>
    );
}
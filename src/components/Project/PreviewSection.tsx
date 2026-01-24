import React from 'react';

interface PreviewSectionProps {
  formData: {
    name: string;
    location: string;
    description: string;
    status: string;
    usage_types: string[];
    build_area: string;
    terrain_area: string;
    materials: string[];
  };
  mainImagePreview: string | null;
  galleryPreviews: string[];
}

export default function PreviewSection({ formData, mainImagePreview, galleryPreviews }: PreviewSectionProps) {
  return (
    <div className="space-y-6">
      {/* Resumo do Projeto */}
      <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
          <i className="fas fa-eye mr-2"></i>
          Preview do Projeto
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-50 dark:bg-[#202830] rounded-xl">
              <div className="text-sm text-zinc-500 dark:text-neutral-400 mb-1">Nome</div>
              <div className="font-medium text-zinc-900 dark:text-white">
                {formData.name || 'Não informado'}
              </div>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-[#202830] rounded-xl">
              <div className="text-sm text-zinc-500 dark:text-neutral-400 mb-1">Localização</div>
              <div className="font-medium text-zinc-900 dark:text-white">
                {formData.location || 'Não informado'}
              </div>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-[#202830] rounded-xl">
              <div className="text-sm text-zinc-500 dark:text-neutral-400 mb-1">Status</div>
              <div className="font-medium text-zinc-900 dark:text-white">
                {formData.status || 'Não informado'}
              </div>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-[#202830] rounded-xl">
              <div className="text-sm text-zinc-500 dark:text-neutral-400 mb-1">Tipo de Uso</div>
              <div className="font-medium text-zinc-900 dark:text-white">
                {formData.usage_types.length > 0 ? formData.usage_types.join(', ') : 'Não informado'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview das Fotos */}
      <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Fotos</h2>
        <div className="grid grid-cols-2 gap-4">
          {mainImagePreview ? (
            <div className="col-span-2">
              <div className="text-sm text-zinc-500 dark:text-neutral-400 mb-2">Foto Principal</div>
              <img src={mainImagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
            </div>
          ) : (
            <div className="col-span-2 p-8 border-2 border-dashed border-zinc-300 dark:border-[#3d444d] rounded-xl text-center">
              <i className="fas fa-camera text-3xl text-zinc-400 dark:text-neutral-500 mb-2"></i>
              <p className="text-sm text-zinc-500 dark:text-neutral-400">Nenhuma foto principal adicionada</p>
            </div>
          )}
          {galleryPreviews.length > 0 && (
            <div className="col-span-2">
              <div className="text-sm text-zinc-500 dark:text-neutral-400 mb-2">
                Galeria ({galleryPreviews.length} {galleryPreviews.length === 1 ? 'imagem' : 'imagens'})
              </div>
              <div className="grid grid-cols-4 gap-2">
                {galleryPreviews.slice(0, 4).map((img, i) => (
                  <img key={i} src={img} alt={`Preview ${i + 1}`} className="w-full h-24 object-cover rounded-lg" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Informações Técnicas */}
      <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Informações Técnicas</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-50 dark:bg-[#202830] rounded-xl">
            <div className="text-sm text-zinc-500 dark:text-neutral-400 mb-1">Área Construída</div>
            <div className="font-medium text-zinc-900 dark:text-white">
              {formData.build_area ? `${formData.build_area} m²` : 'Não informado'}
            </div>
          </div>
          <div className="p-4 bg-zinc-50 dark:bg-[#202830] rounded-xl">
            <div className="text-sm text-zinc-500 dark:text-neutral-400 mb-1">Área do Terreno</div>
            <div className="font-medium text-zinc-900 dark:text-white">
              {formData.terrain_area ? `${formData.terrain_area} m²` : 'Não informado'}
            </div>
          </div>
          <div className="col-span-2 p-4 bg-zinc-50 dark:bg-[#202830] rounded-xl">
            <div className="text-sm text-zinc-500 dark:text-neutral-400 mb-1">Materiais</div>
            <div className="font-medium text-zinc-900 dark:text-white">
              {formData.materials.filter(m => m.trim()).length > 0 
                ? formData.materials.filter(m => m.trim()).join(', ') 
                : 'Não informado'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
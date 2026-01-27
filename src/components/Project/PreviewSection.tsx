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
    author: string;
    isAuthor: boolean;
  };
  mainImagePreview: string | null;
  galleryPreviews: string[];
}

export default function PreviewSection({ formData, mainImagePreview, galleryPreviews }: PreviewSectionProps) {
  return (
    <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
        Preview do Projeto
      </h2>

      <div className="space-y-8">
        {/* Hero Section - Side by Side */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white leading-tight mb-3">
                {formData.name || 'Nome do Projeto'}
              </h1>
              
              <div className="flex items-center gap-2 text-zinc-600 dark:text-neutral-400 mb-4">
                <i className="fas fa-location-dot text-sm"></i>
                <span className="text-sm font-medium">{formData.location || 'Localização não informada'}</span>
              </div>

              <p className="text-zinc-700 dark:text-neutral-400 leading-relaxed text-sm">
                {formData.description || 'Nenhuma descrição fornecida'}
              </p>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div>
            {mainImagePreview ? (
              <div className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-[#202830] aspect-square">
                <img
                  className="w-full h-full object-cover"
                  src={mainImagePreview}
                  alt="Preview principal"
                />
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-[#202830] aspect-square flex items-center justify-center">
                <i className="fas fa-image text-4xl text-zinc-300 dark:text-neutral-600"></i>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 pb-6 border-b border-zinc-100 dark:border-[#3d444d]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-[#202830] dark:to-[#151B23] flex items-center justify-center">
            <i className="fas fa-user text-sm text-zinc-600 dark:text-neutral-400"></i>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-neutral-500 uppercase tracking-wider font-medium">
              Autor do projeto
            </p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {formData.isAuthor ? (localStorage.getItem('name') || 'Você') : (formData.author || 'Não informado')}
            </p>
          </div>
        </div>

        {/* Specifications Grid */}
        <div>
          <h2 className="text-xl font-medium text-zinc-900 dark:text-white mb-4">Especificações técnicas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: 'fas fa-layer-group',
                title: 'Materiais',
                value: formData.materials.filter(m => m.trim()).length > 0 
                  ? formData.materials.filter(m => m.trim()).join(', ')
                  : 'Não informado'
              },
              {
                icon: 'fas fa-location-crosshairs',
                title: 'Tipo de uso',
                value: formData.usage_types.length > 0 
                  ? formData.usage_types.join(', ') 
                  : 'Não informado'
              },
              {
                icon: 'fas fa-mountain',
                title: 'Área do terreno',
                value: formData.terrain_area ? `${formData.terrain_area}m²` : 'Não informado'
              },
              {
                icon: 'fas fa-house',
                title: 'Área construída',
                value: formData.build_area ? `${formData.build_area}m²` : 'Não informado'
              },
              {
                icon: 'fas fa-chart-simple',
                title: 'Status',
                value: formData.status || 'Não informado'
              }
            ].map((spec, index) => (
              <div 
                key={index} 
                className="p-4 rounded-xl border border-zinc-100 dark:border-[#3d444d] bg-white dark:bg-[#151B23]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-[#202830] dark:to-[#151B23] flex items-center justify-center">
                    <i className={`${spec.icon} text-sm text-zinc-700 dark:text-neutral-400`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-zinc-500 dark:text-neutral-500 uppercase tracking-wider mb-1">
                      {spec.title}
                    </h3>
                    <p className="text-zinc-900 dark:text-white text-sm font-medium leading-relaxed break-words">
                      {spec.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        {galleryPreviews.length > 0 && (
          <div>
            <h2 className="text-xl font-medium text-zinc-900 dark:text-white mb-4">
              Galeria ({galleryPreviews.length} {galleryPreviews.length === 1 ? 'imagem' : 'imagens'})
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {galleryPreviews.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden bg-zinc-100 dark:bg-[#202830] aspect-video">
                  <img 
                    src={img} 
                    alt={`Preview ${i + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
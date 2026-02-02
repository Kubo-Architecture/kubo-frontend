import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Kuboadd from "../../assets/icons/Universal/Kubo-add.svg"
import { getUserIdFromToken } from "../../utils/jwt";

interface BannerSettingsProps {
  onClose: () => void;
  onBannerUpdated?: (newBanner: string) => void;
}

export default function BannerSettings({ onClose, onBannerUpdated }: BannerSettingsProps) {
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [selectedColorBanner, setSelectedColorBanner] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const colorSelectorRef = useRef<HTMLDivElement>(null);

  const predefinedBanners: string[] = [
    "https://res.cloudinary.com/dqx7ti5ld/image/upload/v1769889026/default-banner_leklmj.png", 
    "https://res.cloudinary.com/dqx7ti5ld/image/upload/v1769889026/default-banner-yellow_qvhxia.png",
    "https://res.cloudinary.com/dqx7ti5ld/image/upload/v1769889026/default-banner-blue_iepk2y.png",
    "https://res.cloudinary.com/dqx7ti5ld/image/upload/v1769889026/default-banner-red_ehljjy.png",
    "https://res.cloudinary.com/dqx7ti5ld/image/upload/v1769889713/ChatGPT_Image_31_de_jan._de_2026_16_56_16_dnrhe3.png",
  ];

  const quickColors = [
    "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
    "#3b82f6", "#8b5cf6", "#ec4899", "#64748b", "#000000",
  ];

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  useEffect(() => {
    const scrollY = window.scrollY;
    const originalBodyOverflow = document.body.style.overflow || '';
    const originalBodyPosition = document.body.style.position || '';
    const originalBodyTop = document.body.style.top || '';
    const originalBodyWidth = document.body.style.width || '';
    const originalHtmlOverflow = document.documentElement.style.overflow || '';
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.documentElement.style.overflow = 'hidden';
    
    const header = document.getElementById('main-header');
    if (header) header.style.display = 'none';
    
    return () => {
      if (originalBodyOverflow) {
        document.body.style.overflow = originalBodyOverflow;
      } else {
        document.body.style.removeProperty('overflow');
      }
      
      if (originalBodyPosition) {
        document.body.style.position = originalBodyPosition;
      } else {
        document.body.style.removeProperty('position');
      }
      
      if (originalBodyTop) {
        document.body.style.top = originalBodyTop;
      } else {
        document.body.style.removeProperty('top');
      }
      
      if (originalBodyWidth) {
        document.body.style.width = originalBodyWidth;
      } else {
        document.body.style.removeProperty('width');
      }
      
      if (originalHtmlOverflow) {
        document.documentElement.style.overflow = originalHtmlOverflow;
      } else {
        document.documentElement.style.removeProperty('overflow');
      }
      
      window.scrollTo(0, scrollY);
      if (header) header.style.display = '';
    };
  }, []);

  const processFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return;

    setSelectedFile(file);
    setSelectedBanner(null);
    setSelectedColorBanner(null);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFile(event.target.files?.[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleCustomBannerClick = () => {
    fileInputRef.current?.click();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setSelectedColorBanner(color);
    setSelectedBanner(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    
    // Scroll automático para mostrar o seletor de cores
    setTimeout(() => {
      colorSelectorRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest',
        inline: 'nearest'
      });
    }, 100);
  };

  const handleSave = async () => {
    if (!selectedBanner && !selectedFile && !selectedColorBanner) return;

    setIsLoading(true);
    try {
      const userId = getUserIdFromToken();
      if (!userId) return;

      const formData = new FormData();
      formData.append("userId", userId);

      if (selectedFile) {
        formData.append("banner", selectedFile);
      } else if (selectedColorBanner) {
        formData.append("path", `color:${selectedColorBanner}`);
      } else if (selectedBanner) {
        formData.append("path", selectedBanner);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/banner`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        onBannerUpdated?.(
          selectedFile ? response.data.bannerUrl :
          selectedColorBanner ? `color:${selectedColorBanner}` :
          selectedBanner!
        );
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao salvar banner:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 dark:bg-black/95 z-[100] flex items-end sm:items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalContentRef}
        className="relative w-full sm:max-w-3xl sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white dark:bg-[#151B23] rounded-t-3xl sm:rounded-lg overflow-hidden max-h-[92vh] sm:max-h-[85vh] flex flex-col border-t border-gray-200 dark:border-[#3d444d] sm:border">
          {/* Header */}
          <div className="px-4 pt-5 pb-4 sm:p-6 border-b border-gray-200 dark:border-[#3d444d] flex-shrink-0 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Escolha seu banner
            </h2>
            <button
              onClick={handleCloseClick}
              className="text-gray-400 hover:text-gray-600 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors text-xl sm:text-2xl cursor-pointer -mr-1 p-2"
              type="button"
              aria-label="Fechar"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="p-3 sm:p-6">
              {/* Grid de banners - 2 colunas sempre */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {/* Banners Pré-definidos */}
                {predefinedBanners.map((banner, index) => (
                  <div
                    key={index}
                    className={`relative rounded-xl sm:rounded-2xl shadow-sm border-2 overflow-hidden cursor-pointer transition-all duration-200 active:scale-[0.97] ${
                      selectedBanner === banner
                        ? 'border-black dark:border-white ring-2 ring-black dark:ring-white ring-offset-0'
                        : 'border-gray-200 dark:border-[#3d444d] hover:border-gray-300 dark:hover:border-[#4a5159]'
                    }`}
                    onClick={() => {
                      setSelectedBanner(banner);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setSelectedColorBanner(null);
                    }}
                  >
                    <div
                      className="aspect-[2.5/1] w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${banner})` }}
                    />
                    {selectedBanner === banner && (
                      <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3">
                        <div className="bg-black dark:bg-white text-white dark:text-black rounded-full p-1 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Seletor de Cor Personalizada */}
                <div
                  className={`relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 active:scale-[0.97] border-2 ${
                    selectedColorBanner
                      ? 'border-black dark:border-white ring-2 ring-black dark:ring-white ring-offset-0'
                      : 'border-gray-200 dark:border-[#3d444d] hover:border-gray-300 dark:hover:border-[#4a5159]'
                  }`}
                  onClick={() => handleColorSelect(selectedColor)}
                >
                  <div
                    className="aspect-[2.5/1] w-full"
                    style={{ backgroundColor: selectedColorBanner || selectedColor }}
                  />
                  {selectedColorBanner ? (
                    <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3">
                      <div className="bg-white dark:bg-black text-black dark:text-white rounded-full p-1 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-xs sm:text-sm font-semibold bg-black/60 dark:bg-black/70 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                        Cor personalizada
                      </div>
                    </div>
                  )}
                </div>

                {/* Banner Personalizado */}
                {(previewUrl || selectedFile) ? (
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border-2 border-black dark:border-white ring-2 ring-black dark:ring-white ring-offset-0">
                    <div className="aspect-[2.5/1] w-full">
                      <img
                        src={previewUrl || URL.createObjectURL(selectedFile!)}
                        alt="Preview do banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3">
                      <div className="bg-black dark:bg-white text-white dark:text-black rounded-full p-1 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 bg-red-500 text-white rounded-full p-1.5 sm:p-1 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-red-600 active:bg-red-700 transition-colors cursor-pointer"
                      type="button"
                      aria-label="Remover imagem"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    className={`relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 active:scale-[0.97] border-2 ${
                      isDragging
                        ? 'border-blue-400 dark:border-blue-500 ring-2 ring-blue-400 dark:ring-blue-500 ring-offset-0'
                        : 'border-gray-200 dark:border-[#3d444d] hover:border-gray-300 dark:hover:border-[#4a5159]'
                    }`}
                    onClick={handleCustomBannerClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="absolute inset-0 bg-gray-700 dark:bg-[#202830]"></div>
                    <div className="relative aspect-[2.5/1] w-full flex flex-col items-center justify-center p-3 sm:p-4 gap-1 sm:gap-2">
                      <div>
                        <img
                          src={Kuboadd}
                          alt="Adicionar banner"
                          className="w-10 h-10 sm:w-16 sm:h-16 opacity-80"
                        />
                      </div>
                      <p className="text-white text-xs sm:text-sm font-semibold text-center leading-tight">
                        Adicione seu próprio banner
                      </p>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Seletor de Cores */}
              {selectedColorBanner && (
                <div 
                  ref={colorSelectorRef}
                  className="mt-3 sm:mt-6 p-3 sm:p-4 bg-gray-50 dark:bg-[#202830] rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-neutral-300">
                      Escolha uma cor
                    </label>
                    <button
                      onClick={() => setSelectedColorBanner(null)}
                      className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 font-medium"
                      type="button"
                    >
                      Cancelar
                    </button>
                  </div>
                  
                  {/* Cores rápidas */}
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {quickColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`w-full aspect-square rounded-lg cursor-pointer transition-all active:scale-95 ${
                          selectedColor === color ? 'ring-2 ring-offset-2 ring-black dark:ring-white scale-105' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        type="button"
                        aria-label={`Selecionar cor ${color}`}
                      />
                    ))}
                  </div>

                  {/* Seletor de cor customizado */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => handleColorSelect(e.target.value)}
                      className="w-12 h-12 sm:w-12 sm:h-12 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-[#3d444d]"
                      aria-label="Seletor de cor"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={selectedColor}
                        onChange={(e) => handleColorSelect(e.target.value)}
                        className="w-full px-3 py-2.5 sm:py-2 bg-white dark:bg-[#151B23] border-2 border-gray-300 dark:border-[#3d444d] rounded-lg text-sm text-gray-700 dark:text-neutral-300 font-mono"
                        placeholder="#000000"
                        maxLength={7}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="flex-shrink-0 p-3 sm:p-6 border-t border-gray-200 dark:border-[#3d444d] bg-white dark:bg-[#151B23]">
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
              <button 
                onClick={handleCloseClick}
                type="button"
                className="w-full sm:w-auto px-6 py-3 sm:py-2 border-2 border-gray-300 dark:border-[#3d444d] text-gray-700 dark:text-neutral-300 rounded-xl sm:rounded-lg hover:bg-gray-50 dark:hover:bg-[#202830] active:bg-gray-100 dark:active:bg-[#1a2029] transition-colors text-base sm:text-sm font-semibold cursor-pointer"
              >
                Cancelar
              </button>
             
              <button
                type="button"
                onClick={handleSave}
                disabled={(!selectedBanner && !selectedFile && !selectedColorBanner) || isLoading}
                className={`w-full sm:w-auto px-6 py-3 sm:py-2 rounded-xl sm:rounded-lg transition-all text-base sm:text-sm font-semibold ${
                  (!selectedBanner && !selectedFile && !selectedColorBanner) || isLoading
                    ? 'bg-gray-300 dark:bg-neutral-700 cursor-not-allowed text-gray-500 dark:text-neutral-500'
                    : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-neutral-200 active:scale-[0.98] cursor-pointer shadow-lg'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white dark:text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Salvando...
                  </div>
                ) : (
                  "Salvar banner"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const isBannerColor = (banner: string | null | undefined): boolean => {
  return banner ? banner.startsWith('color:') : false;
};

export const extractColor = (banner: string): string => {
  return banner.replace('color:', '');
};
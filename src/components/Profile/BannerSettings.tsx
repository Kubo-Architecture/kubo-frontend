import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Kuboadd from "../../assets/icons/Universal/Kubo-add.svg"
import BannerBlue from "../../assets/Profile/Banners/blue.png"
import BannerGreen from "../../assets/Profile/Banners/green.png"
import BannerBlack from "../../assets/Profile/Banners/black.png"
import BannerOrange from "../../assets/Profile/Banners/orange.png"

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const predefinedBanners: string[] = [
    BannerBlue,
    BannerGreen,
    BannerBlack,
    BannerOrange,
  ];

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        if (typeof onClose === 'function') {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
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

    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Por favor, selecione apenas arquivos de imagem.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB.");
      return;
    }

    setSelectedFile(file);
    setSelectedBanner(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleCustomBannerClick = () => {
    fileInputRef.current?.click();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
      if (typeof onClose === 'function') {
        onClose();
      }
    }
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const handleSave = async () => {
    if (!selectedBanner && !selectedFile) {
      alert("Por favor, selecione um banner ou faça upload de uma imagem.");
      return;
    }

    setIsLoading(true);
    try {
      const idUser = localStorage.getItem("idUser");
      if (!idUser) {
        alert("Usuário não autenticado.");
        return;
      }

      const formData = new FormData();
      formData.append("idUser", idUser);

      if (selectedFile) {
        formData.append("image", selectedFile);
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/user/custom-banner`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );

        if (response.status === 200) {
          onBannerUpdated?.(response.data.bannerUrl);
          window.location.reload();
        }
      } else if (selectedBanner) {
        formData.append("path", selectedBanner);
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/user/banner`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );

        if (response.status === 200) {
          onBannerUpdated?.(selectedBanner);
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Erro ao salvar banner:", error);
      alert("Erro ao salvar banner. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={handleOverlayClick}
      >
        {/* Modal Content */}
        <div
          ref={modalContentRef}
          className="relative max-w-3xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-lg overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0 flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Escolha seu banner</h2>
              <button
                onClick={handleCloseClick}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                type="button"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto">
              {/* Grid unificado com todos os banners */}
              <div className="grid grid-cols-2 gap-4">
                {/* Banners Pré-definidos */}
                {predefinedBanners.map((banner, index) => (
                  <div
                    key={index}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ${selectedBanner === banner
                      ? 'ring-4 ring-black ring-offset-0'
                      : 'hover:opacity-90'
                      }`}
                    onClick={() => {
                      setSelectedBanner(banner);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    <div
                      className="aspect-[2.5/1] w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${banner})` }}
                    />
                    {selectedBanner === banner && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-black text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Banner Personalizado */}
                {(previewUrl || selectedFile) ? (
                  <div className="relative rounded-2xl overflow-hidden ring-4 ring-black ring-offset-0">
                    <div className="aspect-[2.5/1] w-full">
                      <img
                        src={previewUrl || URL.createObjectURL(selectedFile!)}
                        alt="Preview do banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-black text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
                      className="absolute top-3 left-3 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      type="button"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ${isDragging
                      ? 'ring-4 ring-blue-400'
                      : 'hover:opacity-90'
                      }`}
                    onClick={handleCustomBannerClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="absolute inset-0 bg-gray-700"></div>

                    <div className="relative aspect-[2.5/1] w-full flex flex-col items-center justify-center p-4">
                      <div className="mb-2">
                        <img
                          src={Kuboadd}
                          alt="Adicionar banner"
                          className="w-16 h-16 opacity-80"
                        />
                      </div>

                      <p className="text-white text-sm font-medium">
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

              {/* Botões de ação */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                <button 
                  onClick={handleCloseClick}
                  type="button"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
                >
                  Cancelar
                </button>
               
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={(!selectedBanner && !selectedFile) || isLoading}
                  className={`px-6 py-2 rounded-lg transition-colors text-sm sm:text-base font-medium ${(!selectedBanner && !selectedFile) || isLoading
                    ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                    : 'bg-black text-white hover:bg-gray-800'
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
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
    </>
  );
}
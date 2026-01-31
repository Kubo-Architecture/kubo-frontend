import { useState, useRef, useEffect } from "react";
import axios from "axios";
import DefaultProfile from "../../assets/Profile/defaultProfile.svg";
import { getUserIdFromToken } from "../../utils/jwt";

interface PhotoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl?: string;
  onPhotoUpdate: () => void;
}

export default function PhotoEditorModal({
  isOpen,
  onClose,
  currentPhotoUrl,
  onPhotoUpdate,
}: PhotoEditorModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState<number>(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingCurrentPhoto, setIsEditingCurrentPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
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
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const header = document.getElementById('main-header');
      if (header) {
        header.style.display = 'none';
      }
      
      return () => {
        const header = document.getElementById('main-header');
        if (header) {
          header.style.display = '';
        }
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDeleteConfirm && confirmModalRef.current?.contains(event.target as Node)) {
        return;
      }
      
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (!showDeleteConfirm) {
          handleClose();
        }
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else if (previewUrl) {
          handleCancelEdit();
        } else {
          handleClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, showDeleteConfirm, previewUrl]);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'A imagem deve ter no máximo 5MB.' });
      return;
    }

    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      setMessage({ type: 'error', text: 'Por favor, selecione uma imagem PNG ou JPEG.' });
      return;
    }

    setSelectedFile(file);
    setIsEditingCurrentPhoto(false);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleClickCurrentPhoto = async () => {
    if (!currentPhotoUrl || currentPhotoUrl.includes('defaultProfile')) {
      fileInputRef.current?.click();
      return;
    }

    setIsEditingCurrentPhoto(true);
    setPreviewUrl(currentPhotoUrl);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleCancelEdit = () => {
    setPreviewUrl("");
    setSelectedFile(null);
    setIsEditingCurrentPhoto(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setMessage(null);
  };

  const handleImageLoad = () => {
    if (!imageRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    const circleSize = 280;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    
    let displayWidth, displayHeight;
    
    if (imgAspect > 1) {
      displayHeight = circleSize;
      displayWidth = circleSize * imgAspect;
    } else {
      displayWidth = circleSize;
      displayHeight = circleSize / imgAspect;
    }

    const centerX = (containerWidth - displayWidth) / 2;
    const centerY = (containerHeight - displayHeight) / 2;

    setPosition({ x: centerX, y: centerY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const getCroppedImage = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!imageRef.current || !canvasRef.current || !containerRef.current) {
        reject(new Error("Image or canvas not ready"));
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      const outputSize = 400;
      canvas.width = outputSize;
      canvas.height = outputSize;

      const img = imageRef.current;
      const container = containerRef.current;
      
      const circleSize = 280;
      const circleRadius = circleSize / 2;
      
      const containerCenterX = container.offsetWidth / 2;
      const containerCenterY = container.offsetHeight / 2;
      
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let displayWidth, displayHeight;
      
      if (imgAspect > 1) {
        displayHeight = circleSize;
        displayWidth = circleSize * imgAspect;
      } else {
        displayWidth = circleSize;
        displayHeight = circleSize / imgAspect;
      }
      
      displayWidth *= zoom;
      displayHeight *= zoom;
      
      const scaleX = img.naturalWidth / displayWidth;
      const scaleY = img.naturalHeight / displayHeight;
      
      const cropStartX = containerCenterX - circleRadius - position.x;
      const cropStartY = containerCenterY - circleRadius - position.y;
      
      const sourceX = cropStartX * scaleX;
      const sourceY = cropStartY * scaleY;
      const sourceSize = circleSize * scaleX;

      ctx.clearRect(0, 0, outputSize, outputSize);
      
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        outputSize,
        outputSize
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleSave = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setMessage({ type: 'error', text: 'Usuário não identificado. Por favor, faça login novamente.' });
      return;
    }

    if (isEditingCurrentPhoto && !selectedFile) {
      setIsLoading(true);
      try {
        const response = await fetch(currentPhotoUrl!);
        const blob = await response.blob();
        const file = new File([blob], 'current-photo.jpg', { type: 'image/jpeg' });
        setSelectedFile(file);
        
        await uploadPhoto(userId, file);
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
        setMessage({ 
          type: 'error', 
          text: 'Erro ao processar imagem.' 
        });
        setIsLoading(false);
      }
      return;
    }

    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Por favor, selecione uma imagem.' });
      return;
    }

    await uploadPhoto(userId, selectedFile);
  };

  const uploadPhoto = async (userId: string, file: File) => {
    setIsLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/users/photo`;
      const formData = new FormData();

      const croppedBlob = await getCroppedImage();
      const croppedFile = new File([croppedBlob], file.name, {
        type: "image/jpeg",
      });

      formData.append("image", croppedFile);
      formData.append("userId", userId);

      const response = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setMessage({ type: 'success', text: 'Foto atualizada com sucesso!' });
        setTimeout(() => {
          onPhotoUpdate();
          handleClose();
        }, 1500);
      }
    } catch (error: any) {
      console.error("Erro ao enviar imagem:", error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Erro ao enviar imagem.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setMessage({ type: 'error', text: 'Usuário não identificado. Por favor, faça login novamente.' });
      setShowDeleteConfirm(false);
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/users/photo`;
      
      const response = await axios.delete(apiUrl, {
        data: { userId },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setShowDeleteConfirm(false);
        setMessage({ type: 'success', text: 'Foto removida com sucesso!' });
        setTimeout(() => {
          onPhotoUpdate();
          handleClose();
        }, 1500);
      }
    } catch (error: any) {
      console.error("Erro ao remover imagem:", error);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Erro ao remover imagem. Tente novamente.';
      
      setShowDeleteConfirm(false);
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChooseNewPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setMessage(null);
    setShowDeleteConfirm(false);
    setIsEditingCurrentPhoto(false);
    onClose();
  };

  const getImageDimensions = () => {
    if (!imageRef.current) return { width: 0, height: 0 };
    
    const img = imageRef.current;
    const circleSize = 280;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    
    let displayWidth, displayHeight;
    
    if (imgAspect > 1) {
      displayHeight = circleSize;
      displayWidth = circleSize * imgAspect;
    } else {
      displayWidth = circleSize;
      displayHeight = circleSize / imgAspect;
    }
    
    return {
      width: displayWidth * zoom,
      height: displayHeight * zoom,
    };
  };

  const dimensions = getImageDimensions();

  const displayPhotoUrl = currentPhotoUrl?.trim()
    ? currentPhotoUrl.replace(/=s\d+(-c)?$/, "=s400-c")
    : DefaultProfile;
  
  const hasRealPhoto = currentPhotoUrl && 
                       currentPhotoUrl.trim() && 
                       !currentPhotoUrl.includes('defaultProfile') &&
                       !currentPhotoUrl.includes('defaultUserPhoto');

  return (
    <>
      <div className="fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative w-full max-w-lg bg-white dark:bg-[#151B23] rounded-xl shadow-2xl border border-gray-200 dark:border-[#3d444d] flex flex-col"
          style={{ maxHeight: '90vh' }}
        >
          {/* Header */}
          <div className="flex-shrink-0 bg-white dark:bg-[#151B23] border-b border-gray-200 dark:border-[#3d444d] px-6 py-4 rounded-t-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Editar foto
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-[#202830] rounded-lg cursor-pointer"
                disabled={isLoading}
                aria-label="Fechar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {message && (
            <div className={`mx-6 mt-4 p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className={`text-sm font-medium ${
                  message.type === 'success' 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {message.text}
                </span>
              </div>
            </div>
          )}

          {/* Conteúdo */}
          <div className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto bg-white dark:bg-[#151B23]">
            {previewUrl ? (
              <div className="space-y-4">
                <div 
                  ref={containerRef}
                  className="relative w-full h-[280px] sm:h-[350px] bg-black rounded-lg overflow-hidden flex items-center justify-center"
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-[280px] h-[280px] border-2 border-white/50 rounded-full"></div>
                  </div>

                  <div className="absolute inset-0 pointer-events-none z-[5]">
                    <svg className="w-full h-full">
                      <defs>
                        <mask id="circleMask">
                          <rect width="100%" height="100%" fill="white" />
                          <circle cx="50%" cy="50%" r="140" fill="black" />
                        </mask>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill="black"
                        opacity="0.6"
                        mask="url(#circleMask)"
                      />
                    </svg>
                  </div>

                  <div
                    className="absolute cursor-move select-none touch-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{
                      left: position.x,
                      top: position.y,
                      width: dimensions.width,
                      height: dimensions.height,
                    }}
                  >
                    <img
                      ref={imageRef}
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onLoad={handleImageLoad}
                      draggable={false}
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>

                {/* Zoom Control */}
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-gray-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                  </svg>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-gray-200 dark:bg-[#3d444d] rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                  />
                  <svg className="w-5 h-5 text-gray-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </div>

                <canvas ref={canvasRef} className="hidden" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div 
                    className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] rounded-full bg-cover bg-center border-4 border-gray-200 dark:border-[#3d444d] cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundImage: `url(${displayPhotoUrl})` }}
                    onClick={handleClickCurrentPhoto}
                  />
                </div>

                <div 
                  className="border-2 border-dashed border-gray-300 dark:border-[#3d444d] rounded-lg p-6 sm:p-12 text-center cursor-pointer hover:border-black dark:hover:border-white transition-colors"
                  onClick={handleChooseNewPhoto}
                >
                  <svg
                    className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 dark:text-neutral-500 mb-2 sm:mb-3"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">
                    Clique para escolher uma foto
                  </p>
                  <p className="text-xs text-gray-400 dark:text-neutral-500">
                    PNG ou JPEG até 5MB
                  </p>
                </div>
              </div>
            )}

            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 bg-white dark:bg-[#151B23] border-t border-gray-200 dark:border-[#3d444d] px-4 sm:px-6 py-4 rounded-b-xl">
            <div className="flex gap-2">
              {!previewUrl && (
                <>
                  {hasRealPhoto && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowDeleteConfirm(true);
                      }}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                      type="button"
                    >
                      {isLoading ? "Removendo..." : "Remover foto"}
                    </button>
                  )}
                  
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:text-black dark:hover:text-white border border-gray-300 dark:border-[#3d444d] hover:border-gray-400 dark:hover:border-[#3d444d] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    disabled={isLoading}
                    type="button"
                  >
                    Cancelar
                  </button>
                </>
              )}
              
              {previewUrl && (
                <>
                  <button
                    onClick={handleChooseNewPhoto}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:text-black dark:hover:text-white border border-gray-300 dark:border-[#3d444d] hover:border-gray-400 dark:hover:border-[#3d444d] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    disabled={isLoading}
                    type="button"
                  >
                    Trocar
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    type="button"
                  >
                    {isLoading ? "Salvando..." : "Salvar"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteConfirm(false);
            }
          }}
        >
          <div 
            ref={confirmModalRef}
            className="bg-white dark:bg-[#151B23] rounded-xl shadow-2xl border border-gray-200 dark:border-[#3d444d] max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Remover foto de perfil
                </h3>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-6">
                  Tem certeza que deseja remover sua foto de perfil? Esta ação não pode ser desfeita.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowDeleteConfirm(false);
                    }}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:text-black dark:hover:text-white border border-gray-300 dark:border-[#3d444d] hover:border-gray-400 dark:hover:border-[#3d444d] rounded-lg transition-colors cursor-pointer"
                    disabled={isLoading}
                    type="button"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemovePhoto();
                    }}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    type="button"
                  >
                    {isLoading ? "Removendo..." : "Remover"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
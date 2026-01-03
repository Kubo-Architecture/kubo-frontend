import { useState, useRef } from "react";
import axios from "axios";
import DefaultProfile from "../../assets/Profile/defaultProfile.svg";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB.");
      return;
    }

    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      alert("Por favor, selecione uma imagem PNG ou JPEG.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleImageLoad = () => {
    if (!imageRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    // Calcular escala para cobrir o círculo (280px)
    const circleSize = 280;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    
    let displayWidth, displayHeight;
    
    if (imgAspect > 1) {
      // Imagem horizontal
      displayHeight = circleSize;
      displayWidth = circleSize * imgAspect;
    } else {
      // Imagem vertical ou quadrada
      displayWidth = circleSize;
      displayHeight = circleSize / imgAspect;
    }

    // Centralizar
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
      
      // Dimensões do círculo de crop
      const circleSize = 280;
      const circleRadius = circleSize / 2;
      
      // Centro do container
      const containerCenterX = container.offsetWidth / 2;
      const containerCenterY = container.offsetHeight / 2;
      
      // Calcular dimensões da imagem com zoom
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
      
      // Calcular a escala entre a imagem exibida e a original
      const scaleX = img.naturalWidth / displayWidth;
      const scaleY = img.naturalHeight / displayHeight;
      
      // Calcular o ponto de início do crop na imagem EXIBIDA
      const cropStartX = containerCenterX - circleRadius - position.x;
      const cropStartY = containerCenterY - circleRadius - position.y;
      
      // Converter para coordenadas da imagem ORIGINAL
      const sourceX = cropStartX * scaleX;
      const sourceY = cropStartY * scaleY;
      const sourceSize = circleSize * scaleX;

      ctx.clearRect(0, 0, outputSize, outputSize);
      
      // Criar clipping circular
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Desenhar a imagem cropada
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
    const idUser = localStorage.getItem("idUser");
    if (!idUser) {
      alert("Usuário não identificado. Por favor, faça login novamente.");
      return;
    }

    if (!selectedFile) {
      alert("Por favor, selecione uma imagem.");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/user/photo`;
      const formData = new FormData();

      const croppedBlob = await getCroppedImage();
      const croppedFile = new File([croppedBlob], selectedFile.name, {
        type: "image/jpeg",
      });

      formData.append("image", croppedFile);
      formData.append("idUser", idUser);

      const response = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        onPhotoUpdate();
        handleClose();
      }
    } catch (error: any) {
      console.error("Erro ao enviar imagem:", error);
      alert(error.response?.data?.error || "Erro ao enviar imagem.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    const idUser = localStorage.getItem("idUser");
    if (!idUser) {
      alert("Usuário não identificado. Por favor, faça login novamente.");
      return;
    }

    const confirmDelete = window.confirm(
      "Tem certeza que deseja remover sua foto de perfil?"
    );
    if (!confirmDelete) return;

    setIsLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/user/photo`;
      
      // Tentar primeiro com idUser no body como JSON
      let response;
      try {
        response = await axios.delete(apiUrl, {
          data: { idUser },
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (bodyError: any) {
        // Se falhar com 400/404, tentar como query parameter
        if (bodyError.response?.status === 400 || bodyError.response?.status === 404) {
          response = await axios.delete(`${apiUrl}?idUser=${idUser}`);
        } else {
          throw bodyError;
        }
      }

      if (response && (response.status === 200 || response.status === 204)) {
        alert("Foto removida com sucesso!");
        onPhotoUpdate();
        handleClose();
      }
    } catch (error: any) {
      console.error("Erro ao remover imagem:", error);
      
      let errorMessage = "Erro ao remover imagem. Tente novamente.";
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 
                       error.response.data?.error || 
                       error.response.data?.msg;
        
        if (status === 401) {
          errorMessage = "Usuário não autenticado. Faça login novamente.";
        } else if (status === 404) {
          errorMessage = "Foto não encontrada ou já foi removida.";
        } else if (status === 400) {
          errorMessage = message || "Dados inválidos. Verifique se você está logado.";
        } else if (status === 500) {
          errorMessage = "Erro no servidor. Tente novamente mais tarde.";
        } else if (message) {
          errorMessage = message;
        } else {
          errorMessage = `Erro ${status}: Não foi possível remover a foto.`;
        }
      } else if (error.request) {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
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
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Calcular dimensões da imagem com zoom
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

  // URL da foto atual ou default
  const displayPhotoUrl = currentPhotoUrl?.trim()
    ? currentPhotoUrl.replace(/=s\d+(-c)?$/, "=s400-c")
    : DefaultProfile;
  
  // Verificar se há uma foto real (não a foto padrão)
  const hasRealPhoto = currentPhotoUrl && 
                       currentPhotoUrl.trim() && 
                       !currentPhotoUrl.includes('defaultProfile') &&
                       !currentPhotoUrl.includes('defaultUserPhoto');

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-black">
            Editar foto
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-black transition-colors"
            disabled={isLoading}
            aria-label="Fechar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {previewUrl ? (
            <div className="space-y-4">
              {/* Preview Area */}
              <div 
                ref={containerRef}
                className="relative w-full h-[350px] bg-black rounded-lg overflow-hidden flex items-center justify-center"
              >
                {/* Círculo de preview */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-[280px] h-[280px] border-2 border-white/50 rounded-full"></div>
                </div>

                {/* Overlay */}
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

                {/* Imagem */}
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
                  />
                </div>
              </div>

              {/* Zoom Control */}
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>

              <canvas ref={canvasRef} className="hidden" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview da foto atual */}
              <div className="flex justify-center">
                <div 
                  className="w-[280px] h-[280px] rounded-full bg-cover bg-center border-4 border-gray-200"
                  style={{ backgroundImage: `url(${displayPhotoUrl})` }}
                />
              </div>

              {/* Área de upload */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-black transition-colors"
                onClick={handleChooseNewPhoto}
              >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-3"
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
                <p className="text-sm text-gray-600 mb-1">
                  Clique para escolher uma foto
                </p>
                <p className="text-xs text-gray-400">
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
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-2">
          {!previewUrl && (
            <>
              {/* Botão de remover foto - aparece quando há foto atual */}
              {hasRealPhoto && (
                <button
                  onClick={handleRemovePhoto}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  type="button"
                >
                  {isLoading ? "Removendo..." : "Remover foto"}
                </button>
              )}
              
              {/* Botão de cancelar quando não há preview */}
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-black border border-gray-300 hover:border-gray-400 rounded-lg transition-colors disabled:opacity-50"
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
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-black border border-gray-300 hover:border-gray-400 rounded-lg transition-colors disabled:opacity-50"
                disabled={isLoading}
                type="button"
              >
                Trocar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}
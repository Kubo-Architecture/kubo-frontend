/**
 * Redimensiona e comprime uma imagem no navegador para reduzir o tamanho do upload.
 * Mantém proporção; limita a maior aresta a maxWidth/maxHeight e o tamanho em bytes.
 */

const DEFAULT_MAX_DIMENSION = 1920;
const DEFAULT_MAX_SIZE_BYTES = 1.5 * 1024 * 1024; // 1,5 MB por imagem
const DEFAULT_QUALITY = 0.85;
const MIN_QUALITY = 0.5;

export type CompressOptions = {
  maxWidth?: number;
  maxHeight?: number;
  maxSizeBytes?: number;
  quality?: number;
};

function getOutputFileName(originalName: string): string {
  const base = originalName.replace(/\.[^.]+$/, '') || 'image';
  return `${base}.jpg`;
}

/**
 * Comprime um arquivo de imagem e retorna um novo File (JPEG).
 * Se o arquivo não for imagem (ex.: não é image/*), retorna o arquivo original.
 */
export function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxWidth = DEFAULT_MAX_DIMENSION,
    maxHeight = DEFAULT_MAX_DIMENSION,
    maxSizeBytes = DEFAULT_MAX_SIZE_BYTES,
    quality = DEFAULT_QUALITY,
  } = options;

  if (!file.type.startsWith('image/')) {
    return Promise.resolve(file);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let width = img.naturalWidth;
      let height = img.naturalHeight;

      if (width <= maxWidth && height <= maxHeight && file.size <= maxSizeBytes && file.type === 'image/jpeg') {
        resolve(file);
        return;
      }

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2d não disponível'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      let currentQuality = quality;
      const tryBlob = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Falha ao gerar imagem'));
              return;
            }
            if (blob.size <= maxSizeBytes || currentQuality <= MIN_QUALITY) {
              const outFile = new File([blob], getOutputFileName(file.name), {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(outFile);
              return;
            }
            currentQuality = Math.max(MIN_QUALITY, currentQuality - 0.15);
            tryBlob();
          },
          'image/jpeg',
          currentQuality
        );
      };
      tryBlob();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Falha ao carregar imagem'));
    };

    img.src = url;
  });
}

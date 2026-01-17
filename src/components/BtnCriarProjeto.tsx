import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Kuboadd from "../assets/icons/Universal/Kubo-add.svg";

export default function Btncriarprojeto({ onProjectCreated }: any) {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({
    name: '',
    location: '',
    description: '',
    materials: [''],
    status: '',
    build_area: '',
    terrain_area: '',
    usage_type: '',
  });
  const [photo, setPhoto] = useState<any>(null);
  const [gallery, setGallery] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState<any>({});

  const modalRef = useRef<any>(null);
  const contentRef = useRef<any>(null);
  const [mainImagePreview, setMainImagePreview] = useState<any>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<any>([]);

  // Fechar modal ao clicar fora ou pressionar ESC
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowCreateModal(false);
        resetForm();
      }
    };

    const handleEscKey = (event: any) => {
      if (event.key === 'Escape') {
        setShowCreateModal(false);
        resetForm();
      }
    };

    if (showCreateModal) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';

      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [showCreateModal]);

  // Handlers do formulário
  const handleBlur = (field: any) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMaterialChange = (index: number, value: any) => {
    const newMaterials = [...formData.materials];
    newMaterials[index] = value;
    setFormData((prev: any) => ({
      ...prev,
      materials: newMaterials
    }));
  };

  const addMaterialField = () => {
    setFormData((prev: any) => ({
      ...prev,
      materials: [...prev.materials, '']
    }));
  };

  const removeMaterialField = (index: number) => {
    if (formData.materials.length === 1) return;
    const newMaterials = formData.materials.filter((_: any, i: any) => i !== index);
    setFormData((prev: any) => ({
      ...prev,
      materials: newMaterials
    }));
  };

  const handlePhotoChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('A foto principal deve ter no máximo 10MB');
        return;
      }
      setPhoto(file);

      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setError('');
    }
  };

  const handleGalleryChange = (e: any) => {
    const newFiles = Array.from(e.target.files);

    const totalSize = [...gallery, ...newFiles].reduce((acc, file: any) => acc + file.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      setError('A galeria não pode exceder 50MB no total');
      return;
    }

    if (gallery.length + newFiles.length > 20) {
      setError('Máximo de 20 imagens na galeria');
      return;
    }

    setGallery((prevGallery: any) => {
      const allFiles = [...prevGallery, ...newFiles];
      const uniqueMap = new Map();
      allFiles.forEach((file: any) => {
        uniqueMap.set(file.name + file.size, file);
      });
      const uniqueFiles = Array.from(uniqueMap.values());

      // Criar previews
      newFiles.forEach((file: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryPreviews((prev: any) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });

      return uniqueFiles;
    });
    setError('');
  };

  const removeGalleryImage = (index: any) => {
    setGallery((prevGallery: any) => prevGallery.filter((_: any, i: any) => i !== index));
    setGalleryPreviews((prevPreviews: any) => prevPreviews.filter((_: any, i: any) => i !== index));
  };

  const removeMainImage = () => {
    setPhoto(null);
    setMainImagePreview(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Usuário não autenticado');
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('location', formData.location);
    data.append('description', formData.description);
    data.append('status', formData.status);
    data.append('build_area', formData.build_area);
    data.append('terrain_area', formData.terrain_area);
    data.append('usage_type', formData.usage_type);
    data.append('userId', userId);

    formData.materials.forEach((material: string, index: number) => {
      if (material.trim()) {
        data.append(`materials[${index}]`, material);
      }
    });

    if (photo) {
      data.append('photo', photo);
    }

    gallery.forEach((file: any) => {
      data.append('gallery', file);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/`, {
        method: 'POST',
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao cadastrar projeto');
      }

      const result = await response.json();
      console.log('Projeto criado:', result);

      setError('success: Projeto cadastrado com sucesso!');

      // Chamar callback IMEDIATAMENTE com os dados do projeto
      if (onProjectCreated) {
        onProjectCreated(result);
      }

      setTimeout(() => {
        setShowCreateModal(false);
        resetForm();
        
        // Navegar para o perfil se não estiver lá
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/profile/')) {
          const nickname = localStorage.getItem('nickname');
          if (nickname) {
            navigate(`/profile/${nickname}`);
          }
        }
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      description: '',
      materials: [''],
      status: '',
      build_area: '',
      terrain_area: '',
      usage_type: '',
    });
    setPhoto(null);
    setGallery([]);
    setMainImagePreview(null);
    setGalleryPreviews([]);
    setError('');
    setTouched({});
    setIsSubmitting(false);
  };

  return (
    <>
      <button
        onClick={() => setShowCreateModal(true)}
        className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
        title="Criar projeto"
      >
        <img src={Kuboadd} alt="Adicionar" className="w-10 h-10 sm:w-14 sm:h-14" />
      </button>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-8 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Novo Projeto</h2>
                  <p className="text-gray-500 text-sm mt-1">Cadastre as informações do seu projeto arquitetônico</p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  aria-label="Fechar"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {/* Conteúdo com scroll */}
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto px-8 py-4"
            >
              {/* Mensagens de feedback */}
              {error && (
                <div className={`mb-6 p-4 rounded-lg ${error.startsWith('success:')
                  ? 'bg-green-50 border border-green-100'
                  : 'bg-red-50 border border-red-100'
                  }`}>
                  <div className="flex items-center">
                    {error.startsWith('success:') ? (
                      <i className="fas fa-check-circle text-green-600 mr-3"></i>
                    ) : (
                      <i className="fas fa-exclamation-circle text-red-600 mr-3"></i>
                    )}
                    <span className="text-sm">{error.replace('success: ', '')}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Seção 1: Informações básicas */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">
                    Informações Básicas
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Nome do Projeto *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-sm ${touched.name && !formData.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                        placeholder="Casa Moderna em São Paulo"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Localização *
                      </label>
                      <input
                        type="text"
                        name="location"
                        id='location'
                        value={formData.location}
                        onChange={handleChange}
                        onBlur={() => handleBlur('location')}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-sm ${touched.location && !formData.location ? 'border-red-300' : 'border-gray-300'
                          }`}
                        placeholder="São Paulo, SP"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Descrição
                      </label>
                      <textarea
                        name="description"
                        id='description'
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-sm resize-none"
                        placeholder="Descreva os conceitos, inspirações e características principais..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Seção 2: Detalhes técnicos */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">
                    Detalhes Técnicos
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Status *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-sm appearance-none bg-white"
                      >
                        <option value="">Selecione o status</option>
                        <option value="Em planejamento">Em planejamento</option>
                        <option value="Em construção">Em construção</option>
                        <option value="Concluído">Concluído</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Tipo de Uso *
                      </label>
                      <select
                        name="usage_type"
                        value={formData.usage_type}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-sm appearance-none bg-white"
                      >
                        <option value="">Selecione o tipo de uso</option>
                        <option value="Residencial">Residencial</option>
                        <option value="Comercial">Comercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Religioso">Religioso</option>
                        <option value="Público">Público</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Área Construída (m²)
                      </label>
                      <input
                        type="number"
                        name="build_area"
                        value={formData.build_area}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-sm"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Área do Terreno (m²)
                      </label>
                      <input
                        type="number"
                        name="terrain_area"
                        value={formData.terrain_area}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-sm"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Materiais */}
                    <div className="md:col-span-2 space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Materiais Utilizados
                      </label>
                      <div className="space-y-3">
                        {formData.materials.map((material: any, index: number) => (
                          <div key={index} className="flex items-center space-x-3 group">
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                value={material}
                                onChange={(e) => handleMaterialChange(index, e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-sm"
                                placeholder={`Material ${index + 1}`}
                              />
                              {formData.materials.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeMaterialField(index)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-black"
                                >
                                  <i className="fas fa-times text-sm"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addMaterialField}
                          className="text-sm text-gray-600 hover:text-black transition-colors flex items-center"
                        >
                          <img src={Kuboadd} alt="Adicionar" className="w-4 h-4 mr-2" />
                          Adicionar material
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seção 3: Mídia */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">
                    Fotos e Mídia
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Foto Principal */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Foto Principal *
                        </label>
                        <p className="text-xs text-gray-500">Imagem de capa do projeto</p>
                      </div>

                      <input
                        type="file"
                        id="mainPhoto"
                        className="hidden"
                        onChange={handlePhotoChange}
                        required
                        accept="image/jpeg,image/png,image/webp"
                      />

                      <label
                        htmlFor="mainPhoto"
                        className={`
                          flex flex-col items-center justify-center w-full h-56
                          border border-dashed rounded-lg cursor-pointer
                          transition-all duration-200
                          ${mainImagePreview ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
                        `}
                      >
                        {mainImagePreview ? (
                          <div className="w-full h-full relative">
                            <img
                              src={mainImagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  removeMainImage();
                                }}
                                className="bg-black/80 text-white p-2 rounded-full hover:bg-black transition-colors"
                                title="Remover imagem"
                              >
                                <i className="fas fa-times text-sm"></i>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-8 text-center">
                            <i className="fas fa-camera text-3xl text-gray-400 mb-3"></i>
                            <p className="text-sm text-gray-600 font-medium mb-1">Selecionar arquivo</p>
                            <p className="text-xs text-gray-500">PNG, JPG (Max. 10MB)</p>
                          </div>
                        )}
                      </label>

                      {photo && (
                        <p className="text-xs text-gray-500 truncate px-1">
                          {photo.name}
                        </p>
                      )}
                    </div>

                    {/* Galeria */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Galeria de Fotos
                        </label>
                        <p className="text-xs text-gray-500">Até 20 imagens (50MB total)</p>
                      </div>

                      <input
                        type="file"
                        id="gallery"
                        className="hidden"
                        onChange={handleGalleryChange}
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                      />

                      <label
                        htmlFor="gallery"
                        className="flex flex-col items-center justify-center w-full h-56 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                      >
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <i className="fas fa-images text-3xl text-gray-400 mb-3"></i>
                          <p className="text-sm text-gray-600 font-medium mb-1">Adicionar imagens</p>
                          <p className="text-xs text-gray-500">Clique para selecionar múltiplas imagens</p>
                        </div>
                      </label>

                      {galleryPreviews.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-700">
                              {galleryPreviews.length} {galleryPreviews.length === 1 ? 'imagem' : 'imagens'}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setGallery([]);
                                setGalleryPreviews([]);
                              }}
                              className="text-sm text-gray-500 hover:text-black transition-colors"
                            >
                              Limpar todas
                            </button>
                          </div>

                          <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto p-1">
                            {galleryPreviews.map((preview: any, index: number) => (
                              <div key={index} className="relative group">
                                <div className="aspect-square bg-gray-100 rounded border border-gray-200 overflow-hidden">
                                  <img
                                    src={preview}
                                    alt={`Preview ${index}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeGalleryImage(index)}
                                  className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer com botões */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 px-8 py-5">
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`
                    px-8 py-3 rounded-lg text-white font-medium text-sm
                    transition-colors
                    ${isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Criando...
                    </span>
                  ) : (
                    'Criar Projeto'
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Campos marcados com * são obrigatórios
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
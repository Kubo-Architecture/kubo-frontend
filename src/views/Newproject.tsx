import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicInfoSection from '../components/Project/BasicInfoSection';
import MediaSection from '../components/Project/MediaSection';
import TechnicalSpecsSection from '../components/Project/TechnicalSpecsSection';
import MaterialsSection from '../components/Project/MaterialsSection';
import GeneralSection from '../components/Project/GeneralSection';
import PreviewSection from '../components/Project/PreviewSection';
import ActionButtons from '../components/Project/ActionButtons';

export default function Newproject() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('geral');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    author: '',
    isAuthor: true,
    startDate: '',
    endDate: '',
    isOngoing: false,
    materials: [''],
    status: '',
    build_area: '',
    terrain_area: '',
    usage_types: [] as string[],
    custom_usage_type: '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [showCustomUsageType, setShowCustomUsageType] = useState(false);

  const usageTypeOptions = [
    'Residencial',
    'Comercial',
    'Industrial',
    'Público',
    'Religioso',
    'Cultural',
    'Educacional',
    'Outro'
  ];

  const menuSections = [
    { id: 'geral', label: 'Geral', icon: 'fa-solid fa-list-check', description: 'Todas as configurações' },
    { id: 'preview', label: 'Visualizar Projeto', icon: 'fa-solid fa-eye', description: 'Preview do resultado' },
    { id: 'basic', label: 'Informações Básicas', icon: 'fa-solid fa-info-circle', description: 'Nome, local e descrição' },
    { id: 'media', label: 'Fotos e Mídia', icon: 'fa-solid fa-images', description: 'Imagens do projeto' },
    { id: 'technical', label: 'Especificações Técnicas', icon: 'fa-solid fa-cog', description: 'Detalhes técnicos' },
    { id: 'materials', label: 'Materiais', icon: 'fa-solid fa-layer-group', description: 'Lista de materiais' },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleUsageTypeToggle = (type: string) => {
    setFormData((prev) => {
      const currentTypes = prev.usage_types;
      
      if (currentTypes.includes(type)) {
        const newTypes = currentTypes.filter(t => t !== type);
        
        if (type === 'Outro') {
          setShowCustomUsageType(false);
          return {
            ...prev,
            usage_types: newTypes,
            custom_usage_type: ''
          };
        }
        
        return {
          ...prev,
          usage_types: newTypes
        };
      } else {
        if (currentTypes.length < 3) {
          const newTypes = [...currentTypes, type];
          
          if (type === 'Outro') {
            setShowCustomUsageType(true);
          }
          
          return {
            ...prev,
            usage_types: newTypes
          };
        }
        return prev;
      }
    });
  };

  const handleMaterialChange = (index: number, value: string) => {
    const newMaterials = [...formData.materials];
    newMaterials[index] = value;
    setFormData((prev) => ({
      ...prev,
      materials: newMaterials
    }));
  };

  const addMaterialField = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [...prev.materials, '']
    }));
  };

  const removeMaterialField = (index: number) => {
    if (formData.materials.length === 1) return;
    const newMaterials = formData.materials.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      materials: newMaterials
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('A foto principal deve ter no máximo 10MB');
        return;
      }
      setPhoto(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);

    const totalSize = [...gallery, ...newFiles].reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      setError('A galeria não pode exceder 50MB no total');
      return;
    }

    if (gallery.length + newFiles.length > 20) {
      setError('Máximo de 20 imagens na galeria');
      return;
    }

    setGallery((prevGallery) => {
      const allFiles = [...prevGallery, ...newFiles];
      const uniqueMap = new Map();
      allFiles.forEach((file) => {
        uniqueMap.set(file.name + file.size, file);
      });
      const uniqueFiles = Array.from(uniqueMap.values()) as File[];

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });

      return uniqueFiles;
    });
    setError('');
  };

  const removeGalleryImage = (index: number) => {
    setGallery((prevGallery) => prevGallery.filter((_, i) => i !== index));
    setGalleryPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const removeMainImage = () => {
    setPhoto(null);
    setMainImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.usage_types.length === 0) {
      setError('Selecione pelo menos um tipo de uso');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Usuário não autenticado');
      setIsSubmitting(false);
      return;
    }

    const finalUsageTypes = formData.usage_types.map(type => 
      type === 'Outro' ? formData.custom_usage_type : type
    ).filter(type => type.trim() !== '');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('location', formData.location);
    data.append('description', formData.description);
    data.append('status', formData.status);
    data.append('build_area', formData.build_area);
    data.append('terrain_area', formData.terrain_area);
    data.append('userId', userId);

    finalUsageTypes.forEach((type, index) => {
      data.append(`usage_types[${index}]`, type);
    });
    data.append('usage_type', finalUsageTypes.join(', '));

    if (!formData.isAuthor && formData.author) {
      data.append('author', formData.author);
    }

    if (formData.startDate) {
      data.append('startDate', formData.startDate);
    }
    if (formData.endDate && !formData.isOngoing) {
      data.append('endDate', formData.endDate);
    }

    formData.materials.forEach((material: string, index: number) => {
      if (material.trim()) {
        data.append(`materials[${index}]`, material);
      }
    });

    if (photo) {
      data.append('photo', photo);
    }

    gallery.forEach((file) => {
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
      
      setError('success: Projeto cadastrado com sucesso!');

      setTimeout(() => {
        const nickname = localStorage.getItem('nickname');
        if (nickname) {
          navigate(`/profile/${nickname}`);
        } else {
          navigate('/gallery');
        }
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#151B23]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-neutral-200 dark:bg-[#151B23] dark:border-[#3d444d] flex-col pt-16">
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-neutral-400 dark:hover:text-white transition-colors mb-4"
              >
                <i className="fas fa-arrow-left"></i>
                <span className="text-sm font-medium">Voltar</span>
              </button>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Novo Projeto</h1>
              <p className="text-sm text-zinc-500 dark:text-neutral-400 mt-1">Configure seu projeto</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {menuSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-left group ${
                    activeSection === section.id
                      ? 'bg-white dark:bg-[#202830] text-black dark:text-white shadow-sm border border-neutral-200 dark:border-none'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-[#202830] hover:text-black dark:hover:text-white'
                  }`}
                >
                  <i className={`${section.icon} text-lg ${
                    activeSection === section.id 
                      ? 'text-black dark:text-white' 
                      : 'text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white'
                  }`}></i>
                  <div className="flex-1">
                    <div className="font-medium text-[15px]">{section.label}</div>
                    {section.description && (
                      <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{section.description}</div>
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-80 bg-neutral-50 dark:bg-[#202830] pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {error && (
              <div
                className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
                  error.startsWith("success:")
                    ? "border-green-300 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-800"
                    : "border-red-300 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-800"
                }`}
              >
                <div className="flex items-center">
                  <i className={`fas ${error.startsWith('success:') ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
                  {error.replace("success: ", "")}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ABA GERAL */}
              {activeSection === 'geral' && (
                <GeneralSection
                  formData={formData}
                  handleChange={handleChange}
                  handleUsageTypeToggle={handleUsageTypeToggle}
                  mainImagePreview={mainImagePreview}
                  galleryPreviews={galleryPreviews}
                  handlePhotoChange={handlePhotoChange}
                  handleGalleryChange={handleGalleryChange}
                  removeMainImage={removeMainImage}
                  removeGalleryImage={removeGalleryImage}
                  handleMaterialChange={handleMaterialChange}
                  addMaterialField={addMaterialField}
                  removeMaterialField={removeMaterialField}
                  showCustomUsageType={showCustomUsageType}
                  usageTypeOptions={usageTypeOptions}
                />
              )}

              {/* PREVIEW */}
              {activeSection === 'preview' && (
                <PreviewSection
                  formData={formData}
                  mainImagePreview={mainImagePreview}
                  galleryPreviews={galleryPreviews}
                />
              )}

              {/* ABA INFORMAÇÕES BÁSICAS */}
              {activeSection === 'basic' && (
                <BasicInfoSection
                  formData={formData}
                  handleChange={handleChange}
                />
              )}

              {/* ABA FOTOS E MÍDIA */}
              {activeSection === 'media' && (
                <MediaSection
                  mainImagePreview={mainImagePreview}
                  galleryPreviews={galleryPreviews}
                  handlePhotoChange={handlePhotoChange}
                  handleGalleryChange={handleGalleryChange}
                  removeMainImage={removeMainImage}
                  removeGalleryImage={removeGalleryImage}
                />
              )}

              {/* ABA ESPECIFICAÇÕES TÉCNICAS */}
              {activeSection === 'technical' && (
                <TechnicalSpecsSection
                  formData={formData}
                  handleChange={handleChange}
                  handleUsageTypeToggle={handleUsageTypeToggle}
                  showCustomUsageType={showCustomUsageType}
                  usageTypeOptions={usageTypeOptions}
                />
              )}

              {/* ABA MATERIAIS */}
              {activeSection === 'materials' && (
                <MaterialsSection
                  materials={formData.materials}
                  handleMaterialChange={handleMaterialChange}
                  addMaterialField={addMaterialField}
                  removeMaterialField={removeMaterialField}
                />
              )}

              {/* Botões de ação */}
              <ActionButtons
                isSubmitting={isSubmitting}
                onCancel={() => navigate(-1)}
              />
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
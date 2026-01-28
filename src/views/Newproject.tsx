import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserIdFromToken } from '../utils/jwt';
import axios from 'axios';
import MediaSection from '../components/Project/MediaSection';
import TechnicalSpecsSection from '../components/Project/TechnicalSpecsSection';
import MaterialsSection from '../components/Project/MaterialsSection';
import GeneralSection from '../components/Project/GeneralSection';
import PreviewSection from '../components/Project/PreviewSection';
import RequirementsSection from '../components/Project/RequirementsSection';

export default function NewProject() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('geral');
  const [userName, setUserName] = useState('Usuário');
  const [nickName, setNickName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    author: '',
    isAuthor: false,
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
    { id: 'geral', label: 'Geral', icon: 'fa-solid fa-grip' },
    { id: 'media', label: 'Fotos e Mídia', icon: 'fa-solid fa-image' },
    { id: 'technical', label: 'Especificações Técnicas', icon: 'fa-solid fa-wrench' },
    { id: 'materials', label: 'Materiais', icon: 'fa-solid fa-cubes' },
    { id: 'requirements', label: 'Requisitos', icon: 'fa-solid fa-clipboard-check' },
    { id: 'preview', label: 'Visualizar Projeto', icon: 'fa-solid fa-eye' },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchUserNickname = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`);
        const userData = response.data;
        setNickName(userData.nickname || '');
      } catch (err) {
        console.error('Erro ao buscar nickname do usuário:', err);
      }
    };

    fetchUserNickname();
  }, []);

  useEffect(() => {
    const fetchUserNameIfAuthor = async () => {
      if (!formData.isAuthor) return;

      const userId = getUserIdFromToken();
      if (!userId) return;

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`);
        const userData = response.data;
        const resolvedName =
          userData.name || userData.username || userData.nickname || 'Usuário';

        setUserName(resolvedName);
        setFormData((prev) => ({
          ...prev,
          author: resolvedName,
        }));
      } catch (err) {
        console.error('Erro ao buscar dados do usuário para autor:', err);
      }
    };

    fetchUserNameIfAuthor();
  }, [formData.isAuthor]);

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

    if (newFiles.length === 0) {
      return;
    }

    newFiles.forEach((file, i) => {
      console.log(`  ${i + 1}. ${file.name} (${file.type}, ${(file.size / 1024).toFixed(2)}KB)`);
    });

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.status) {
      setError('Selecione o status do projeto');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (formData.usage_types.includes('Outro') && !formData.custom_usage_type.trim()) {
      setError('Especifique o tipo de uso "Outro"');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.name.trim()) {
      setError('Preencha o nome do projeto');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.location.trim()) {
      setError('Preencha a localização do projeto');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.description.trim()) {
      setError('Preencha a descrição do projeto');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!photo) {
      setError('Adicione uma foto principal do projeto');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setError('');

    const userId = getUserIdFromToken();

    if (!userId) {
      setError('Você precisa estar logado para cadastrar um projeto');
      setIsSubmitting(false);
      navigate('/login');
      return;
    }

    let finalUserName = userName;
    if (userName === 'Usuário' && userId) {
      try {
        const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`);
        const userData = userResponse.data;
        finalUserName = userData.name || 'Usuário';

      } catch (err) {
        console.error('Erro ao buscar nome do backend:', err);
      }
    }

    const finalUsageTypes = formData.usage_types.map(type => 
      type === 'Outro' ? formData.custom_usage_type : type
    ).filter(type => type.trim() !== '');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('location', formData.location);
    data.append('description', formData.description);
    data.append('status', formData.status);
    data.append('build_area', formData.build_area || '');
    data.append('terrain_area', formData.terrain_area || '');
    data.append('userId', userId);

    finalUsageTypes.forEach((type, index) => {
      data.append(`usage_types[${index}]`, type);
    });
    data.append('usage_type', finalUsageTypes.join(', '));

    if (formData.isAuthor) {
      data.append('author', finalUserName);
    } else if (formData.author && formData.author.trim()) {
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
      data.append('photo', photo, photo.name);
    } else {
      console.error('ERRO: Foto principal não encontrada!');
    }

    gallery.forEach((file, _) => {
      data.append('gallery', file, file.name);
    });

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/projects/`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (!nickName) {
        navigate('/profile/nickname');
      } else {
        navigate(`/profile/${nickName}`);
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error ||
        err?.message ||
        'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#202830]">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-neutral-200 dark:bg-[#151B23] dark:border-[#3d444d] flex-col pt-16 z-10">
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Navigation */}
            <nav className="space-y-1">
              {menuSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-left group ${
                    activeSection === section.id
                      ? 'bg-white dark:bg-[#202830] dark:border-none dark:text-white text-black shadow-sm border border-neutral-200'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-[#202830] dark:hover:text-white hover:text-black'
                  }`}
                >
                  <i className={`${section.icon} text-lg ${
                    activeSection === section.id 
                      ? 'text-black dark:text-white'
                      : 'text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white'
                  }`}></i>
                  <div className="flex-1">
                    <div className="font-medium text-[15px]">{section.label}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Footer - Action Buttons */}
          <div className="px-6 py-6 border-t border-zinc-200 dark:border-[#3d444d] bg-white dark:bg-[#151B23]">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="cursor-pointer px-4 py-3.5 border-2 border-zinc-300 dark:border-[#3d444d] text-zinc-900 dark:text-white rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-[#202830] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="cursor-pointer px-4 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Cadastrando...</span>
                  </>
                ) : (
                  <span>Cadastrar</span>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-80 pt-16 min-h-screen">
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
                  <i className={`fa-solid ${error.startsWith('success:') ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
                  {error.replace("success: ", "")}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 pb-8">
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

              {/* REQUISITOS */}
              {activeSection === 'requirements' && (
                <RequirementsSection
                  formData={formData}
                  photo={photo}
                  showCustomUsageType={showCustomUsageType}
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
                  setFormData={setFormData}
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
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
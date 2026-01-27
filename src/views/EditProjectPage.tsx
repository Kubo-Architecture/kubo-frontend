import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getUserIdFromToken } from '../utils/jwt';

// Componentes
import EditProjectSidebar from '../components/EditProject/EditProjectSidebar';
import GeneralSection from '../components/EditProject/GeneralSection';
import MediaSection from '../components/EditProject/MediaSection';
import TechnicalSection from '../components/EditProject/TechnicalSection';
import MaterialsSection from '../components/EditProject/MaterialsSection';
import RequirementsSection from '../components/EditProject/RequirementsSection';
import ProjectPreview from '../components/EditProject/ProjectPreview';

export default function EditProjectPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState('geral');
    const [showPreview, setShowPreview] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [isAuthor, setIsAuthor] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isOngoing, setIsOngoing] = useState(false);
    const [usageTypes, setUsageTypes] = useState<string[]>([]);
    const [customUsageType, setCustomUsageType] = useState('');
    const [showCustomUsageType, setShowCustomUsageType] = useState(false);
    const [terrainArea, setTerrainArea] = useState('');
    const [buildArea, setBuildArea] = useState('');
    const [status, setStatus] = useState('');
    const [materials, setMaterials] = useState<string[]>(['']);

    // Imagens
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string>('');
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [existingGallery, setExistingGallery] = useState<string[]>([]);

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

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`${API_URL}/projects/${projectId}`);
                const data = response.data;
                
                setName(data.name || '');
                setLocation(data.location || '');
                setDescription(data.description || '');
                setAuthor(data.author || '');
                setStartDate(data.startDate || '');
                setEndDate(data.endDate || '');
                setIsOngoing(data.isOngoing || false);
                setUsageTypes(data.usage_types || []);
                setTerrainArea(data.terrain_area || '');
                setBuildArea(data.build_area || '');
                setStatus(data.status || '');
                setMaterials(data.materials && data.materials.length > 0 ? data.materials : ['']);
                
                const userName = localStorage.getItem('name') || 
                                 localStorage.getItem('username') || 
                                 localStorage.getItem('nickname') || 
                                 'Usuário';
                setIsAuthor(data.author === userName);
                
                if (data.photo_url) {
                    setMainImagePreview(getImageUrl(data.photo_url));
                }
                
                if (data.gallery && data.gallery.length > 0) {
                    setExistingGallery(data.gallery);
                    setGalleryPreviews(data.gallery.map((url: string) => getImageUrl(url)));
                }
                
                if (data.usage_types && data.usage_types.includes('Outro')) {
                    setShowCustomUsageType(true);
                    setCustomUsageType(data.custom_usage_type || '');
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar projeto:', error);
                setError('Erro ao carregar projeto');
                navigate('/profile');
            }
        };

        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    const getImageUrl = (path: string | null | undefined): string => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${API_URL}${path}`;
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setError('A foto principal deve ter no máximo 10MB');
                return;
            }
            setMainImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        
        const totalSize = [...galleryImages, ...newFiles].reduce((acc, file) => acc + file.size, 0);
        if (totalSize > 50 * 1024 * 1024) {
            setError('A galeria não pode exceder 50MB no total');
            return;
        }

        if (galleryPreviews.length + newFiles.length > 20) {
            setError('Máximo de 20 imagens na galeria');
            return;
        }
        
        setGalleryImages(prev => [...prev, ...newFiles]);
        
        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGalleryPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
        setError('');
    };

    const removeGalleryImage = (index: number) => {
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
        
        if (index < existingGallery.length) {
            setExistingGallery(prev => prev.filter((_, i) => i !== index));
        } else {
            const newImageIndex = index - existingGallery.length;
            setGalleryImages(prev => prev.filter((_, i) => i !== newImageIndex));
        }
    };

    const removeMainImage = () => {
        setMainImage(null);
        setMainImagePreview('');
    };

    const handleUsageTypeToggle = (type: string) => {
        const currentTypes = usageTypes;
        
        if (currentTypes.includes(type)) {
            const newTypes = currentTypes.filter(t => t !== type);
            
            if (type === 'Outro') {
                setShowCustomUsageType(false);
                setCustomUsageType('');
            }
            
            setUsageTypes(newTypes);
        } else {
            if (currentTypes.length < 3) {
                const newTypes = [...currentTypes, type];
                
                if (type === 'Outro') {
                    setShowCustomUsageType(true);
                }
                
                setUsageTypes(newTypes);
            }
        }
    };

    const handleMaterialChange = (index: number, value: string) => {
        const newMaterials = [...materials];
        newMaterials[index] = value;
        setMaterials(newMaterials);
    };

    const addMaterialField = () => {
        setMaterials([...materials, '']);
    };

    const removeMaterialField = (index: number) => {
        if (materials.length === 1) return;
        setMaterials(materials.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (usageTypes.length === 0) {
            setError('Selecione pelo menos um tipo de uso');
            setActiveSection('technical');
            return;
        }

        if (!status) {
            setError('Selecione o status do projeto');
            setActiveSection('technical');
            return;
        }

        if (usageTypes.includes('Outro') && !customUsageType.trim()) {
            setError('Especifique o tipo de uso "Outro"');
            setActiveSection('technical');
            return;
        }

        if (!name.trim() || !location.trim() || !description.trim()) {
            setError('Preencha todos os campos obrigatórios');
            setActiveSection('geral');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const userId = getUserIdFromToken();
            const userName = localStorage.getItem('name') || 
                             localStorage.getItem('username') || 
                             localStorage.getItem('nickname') || 
                             'Usuário';

            const finalUsageTypes = usageTypes.map(type => 
                type === 'Outro' ? customUsageType : type
            ).filter(type => type.trim() !== '');

            const updateData = {
                id: projectId,
                name: name,
                location: location,
                description: description,
                status: status,
                build_area: buildArea || '',
                terrain_area: terrainArea || '',
                usage_type: finalUsageTypes.join(', '),
                materials: materials.filter((m: string) => m.trim())
            };

            if (isAuthor) {
                Object.assign(updateData, { author: userName });
            } else if (author && author.trim()) {
                Object.assign(updateData, { author: author });
            }

            if (startDate) {
                Object.assign(updateData, { startDate: startDate });
            }
            if (endDate && !isOngoing) {
                Object.assign(updateData, { endDate: endDate });
            }
            if (isOngoing) {
                Object.assign(updateData, { isOngoing: true });
            }

            const response = await axios.put(
                `${API_URL}/projects/`,
                updateData
            );

            if (response.status === 200 || response.status === 204) {
                if (mainImage || galleryImages.length > 0) {
                    const imageFormData = new FormData();
                    
                    if (mainImage) {
                        imageFormData.append('photo', mainImage, mainImage.name);
                    }

                    imageFormData.append('existingGallery', JSON.stringify(existingGallery));

                    galleryImages.forEach((file) => {
                        imageFormData.append('gallery', file, file.name);
                    });

                    try {
                        await axios.put(`${API_URL}/projects/${projectId}/images`, imageFormData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                    } catch (imgError) {
                        console.warn('Erro ao fazer upload de imagens:', imgError);
                    }
                }

                setError('success: Projeto atualizado com sucesso!');
                setTimeout(() => {
                    navigate(`/project/${projectId}`);
                }, 1500);
            }
        } catch (error: any) {
            console.error('Erro ao atualizar projeto:', error);
            setError(error.response?.data?.error || 'Erro ao atualizar projeto');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-[#202830]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-3 border-gray-200 dark:border-[#3d444d] border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-neutral-400 text-sm font-medium">Carregando projeto...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <link 
                rel="stylesheet" 
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
            />
            
            <div className="min-h-screen bg-neutral-50 dark:bg-[#202830]">
                <div className="flex min-h-screen">
                    {/* Sidebar Desktop */}
                    <EditProjectSidebar
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                        showPreview={showPreview}
                        setShowPreview={setShowPreview}
                        saving={saving}
                        onCancel={() => navigate(-1)}
                        onSubmit={handleSubmit}
                    />

                    {/* Main Content */}
                    <main className="flex-1 lg:ml-80 pt-16 min-h-screen">
                        <div className={`${showPreview ? 'max-w-7xl' : 'max-w-4xl'} mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8`}>
                            <div className={`${showPreview ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : ''}`}>
                                {/* Formulário */}
                                <div className={showPreview ? 'lg:pr-4' : ''}>
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
                                        {activeSection === 'geral' && (
                                            <GeneralSection
                                                name={name}
                                                setName={setName}
                                                location={location}
                                                setLocation={setLocation}
                                                description={description}
                                                setDescription={setDescription}
                                                author={author}
                                                setAuthor={setAuthor}
                                                isAuthor={isAuthor}
                                                setIsAuthor={setIsAuthor}
                                                startDate={startDate}
                                                setStartDate={setStartDate}
                                                endDate={endDate}
                                                setEndDate={setEndDate}
                                                isOngoing={isOngoing}
                                                setIsOngoing={setIsOngoing}
                                                mainImagePreview={mainImagePreview}
                                                galleryPreviews={galleryPreviews}
                                                handleMainImageChange={handleMainImageChange}
                                                handleGalleryImagesChange={handleGalleryImagesChange}
                                                removeMainImage={removeMainImage}
                                                removeGalleryImage={removeGalleryImage}
                                                usageTypes={usageTypes}
                                                usageTypeOptions={usageTypeOptions}
                                                handleUsageTypeToggle={handleUsageTypeToggle}
                                                showCustomUsageType={showCustomUsageType}
                                                customUsageType={customUsageType}
                                                setCustomUsageType={setCustomUsageType}
                                                status={status}
                                                setStatus={setStatus}
                                                terrainArea={terrainArea}
                                                setTerrainArea={setTerrainArea}
                                                buildArea={buildArea}
                                                setBuildArea={setBuildArea}
                                                materials={materials}
                                                handleMaterialChange={handleMaterialChange}
                                                addMaterialField={addMaterialField}
                                                removeMaterialField={removeMaterialField}
                                            />
                                        )}

                                        {activeSection === 'media' && (
                                            <MediaSection
                                                mainImagePreview={mainImagePreview}
                                                galleryPreviews={galleryPreviews}
                                                handleMainImageChange={handleMainImageChange}
                                                handleGalleryImagesChange={handleGalleryImagesChange}
                                                removeMainImage={removeMainImage}
                                                removeGalleryImage={removeGalleryImage}
                                            />
                                        )}

                                        {activeSection === 'technical' && (
                                            <TechnicalSection
                                                usageTypes={usageTypes}
                                                usageTypeOptions={usageTypeOptions}
                                                handleUsageTypeToggle={handleUsageTypeToggle}
                                                showCustomUsageType={showCustomUsageType}
                                                customUsageType={customUsageType}
                                                setCustomUsageType={setCustomUsageType}
                                                status={status}
                                                setStatus={setStatus}
                                                terrainArea={terrainArea}
                                                setTerrainArea={setTerrainArea}
                                                buildArea={buildArea}
                                                setBuildArea={setBuildArea}
                                            />
                                        )}

                                        {activeSection === 'materials' && (
                                            <MaterialsSection
                                                materials={materials}
                                                handleMaterialChange={handleMaterialChange}
                                                addMaterialField={addMaterialField}
                                                removeMaterialField={removeMaterialField}
                                            />
                                        )}

                                        {activeSection === 'requirements' && (
                                            <RequirementsSection
                                                name={name}
                                                location={location}
                                                description={description}
                                                mainImagePreview={mainImagePreview}
                                                usageTypes={usageTypes}
                                                status={status}
                                            />
                                        )}
                                    </form>
                                </div>

                                {/* Preview Lateral */}
                                {showPreview && (
                                    <ProjectPreview
                                        name={name}
                                        location={location}
                                        description={description}
                                        usageTypes={usageTypes}
                                        customUsageType={customUsageType}
                                        mainImagePreview={mainImagePreview}
                                        isAuthor={isAuthor}
                                        author={author}
                                        materials={materials}
                                        terrainArea={terrainArea}
                                        buildArea={buildArea}
                                        status={status}
                                        galleryPreviews={galleryPreviews}
                                    />
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
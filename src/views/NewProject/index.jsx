import React, { useState } from 'react';
import Logocontainer from "../../components/Universal/KuboLogo";
import { useNavigate } from 'react-router-dom';

export default function NewProject() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
        materials: [''],
        status: '',
        build_area: '',
        terrain_area: '',
        usage_type: '',
    });
    const [photo, setPhoto] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [touched, setTouched] = useState({});

    const handleBlur = (field) => {
        setTouched({...touched, [field]: true});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMaterialChange = (index, value) => {
        const newMaterials = [...formData.materials];
        newMaterials[index] = value;
        setFormData(prev => ({
            ...prev,
            materials: newMaterials
        }));
    };

    const addMaterialField = () => {
        setFormData(prev => ({
            ...prev,
            materials: [...prev.materials, '']
        }));
    };

    const removeMaterialField = (index) => {
        if (formData.materials.length === 1) return;
        const newMaterials = formData.materials.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            materials: newMaterials
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setError('A foto principal deve ter no máximo 10MB');
                return;
            }
            setPhoto(file);
            setError('');
        }
    };

    const handleGalleryChange = (e) => {
        const newFiles = Array.from(e.target.files);
        
        // Verificar tamanho total
        const totalSize = [...gallery, ...newFiles].reduce((acc, file) => acc + file.size, 0);
        if (totalSize > 50 * 1024 * 1024) {
            setError('A galeria não pode exceder 50MB no total');
            return;
        }

        // Verificar quantidade
        if (gallery.length + newFiles.length > 20) {
            setError('Máximo de 20 imagens na galeria');
            return;
        }

        setGallery(prevGallery => {
            const allFiles = [...prevGallery, ...newFiles];
            const uniqueMap = new Map();
            allFiles.forEach(file => {
                uniqueMap.set(file.name + file.size, file);
            });
            return Array.from(uniqueMap.values());
        });
        setError('');
    };

    const removeGalleryImage = (index) => {
        setGallery(prevGallery => prevGallery.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const idUser = localStorage.getItem('idUser');
        if (!idUser) {
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
        data.append('idUser', idUser);

        formData.materials.forEach((material, index) => {
            if (material.trim()) {
                data.append(`materials[${index}]`, material);
            }
        });

        if (photo) {
            data.append('photo', photo);
        }

        gallery.forEach(file => {
            data.append('gallery', file);
        });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/project`, {
                method: 'POST',
                body: data
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao cadastrar projeto');
            }

            // Feedback de sucesso
            setError('success: Projeto cadastrado com sucesso!');
            
            // Redirecionar após 1.5 segundos
            setTimeout(() => {
                const name = localStorage.getItem('name');
                navigate(`/profile/${name}`);
            }, 1500);

        } catch (err) {
            setError(err.message || 'Erro desconhecido');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Header mais clean */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between">
                        <Logocontainer />
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Voltar
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Progress indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                1
                            </div>
                            <div className="text-sm font-medium text-gray-900 ml-2">Informações do Projeto</div>
                        </div>
                        <div className="w-12 h-0.5 bg-gray-300"></div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">
                                2
                            </div>
                            <div className="text-sm text-gray-500 ml-2">Fotos e Mídia</div>
                        </div>
                    </div>
                </div>

                {/* Card principal */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header do card */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 sm:p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">Novo Projeto</h1>
                                <p className="text-blue-100 mt-2">Preencha as informações do seu projeto arquitetônico</p>
                            </div>
                            <div className="hidden sm:block">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mensagens de feedback */}
                    {error && (
                        <div className={`mx-6 mt-6 rounded-xl p-4 ${
                            error.startsWith('success:') 
                                ? 'bg-green-50 border border-green-200 text-green-800' 
                                : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                            <div className="flex items-center">
                                {error.startsWith('success:') ? (
                                    <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <span>{error.replace('success: ', '')}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
                        {/* Seção 1: Informações básicas */}
                        <div>
                            <div className="flex items-center mb-6">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></div>
                                <h2 className="text-xl font-semibold text-gray-900">Informações Básicas</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome do Projeto *
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('name')}
                                        required 
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                            touched.name && !formData.name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Ex: Casa Moderna em São Paulo"
                                    />
                                    {touched.name && !formData.name && (
                                        <p className="mt-1 text-sm text-red-600">Este campo é obrigatório</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Localização *
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="location" 
                                        value={formData.location} 
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('location')}
                                        required 
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                            touched.location && !formData.location ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Ex: São Paulo, SP"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descrição do Projeto
                                    </label>
                                    <textarea 
                                        name="description" 
                                        value={formData.description} 
                                        onChange={handleChange}
                                        rows={4} 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                        placeholder="Descreva os principais conceitos, inspirações e características do projeto..."
                                    ></textarea>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {formData.description.length}/500 caracteres
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Seção 2: Detalhes técnicos */}
                        <div>
                            <div className="flex items-center mb-6">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></div>
                                <h2 className="text-xl font-semibold text-gray-900">Detalhes Técnicos</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status do Projeto *
                                    </label>
                                    <select 
                                        name="status" 
                                        value={formData.status} 
                                        onChange={handleChange}
                                        required 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
                                    >
                                        <option value="">Selecione o status</option>
                                        <option value="Em planejamento">Em planejamento</option>
                                        <option value="Em construção">Em construção</option>
                                        <option value="Concluído">Concluído</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo de Uso *
                                    </label>
                                    <select 
                                        name="usage_type" 
                                        value={formData.usage_type} 
                                        onChange={handleChange}
                                        required 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
                                    >
                                        <option value="">Selecione o tipo de uso</option>
                                        <option value="Residencial">Residencial</option>
                                        <option value="Comercial">Comercial</option>
                                        <option value="Industrial">Industrial</option>
                                        <option value="Religioso">Religioso</option>
                                        <option value="Público">Público</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Área Construída (m²)
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            name="build_area" 
                                            value={formData.build_area} 
                                            onChange={handleChange}
                                            step="0.01" 
                                            min="0" 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="0,00"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-gray-500">m²</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Área do Terreno (m²)
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            name="terrain_area" 
                                            value={formData.terrain_area} 
                                            onChange={handleChange}
                                            step="0.01" 
                                            min="0" 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="0,00"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-gray-500">m²</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Materiais Utilizados
                                    </label>
                                    <div className="space-y-3">
                                        {formData.materials.map((material, index) => (
                                            <div key={index} className="flex items-center space-x-3 group">
                                                <div className="flex-1 relative">
                                                    <input 
                                                        type="text" 
                                                        value={material} 
                                                        onChange={(e) => handleMaterialChange(index, e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                        placeholder={`Material ${index + 1} (ex: Concreto armado, Vidro, Madeira...)`}
                                                    />
                                                    {formData.materials.length > 1 && (
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeMaterialField(index)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <button 
                                            type="button" 
                                            onClick={addMaterialField}
                                            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Adicionar outro material
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seção 3: Mídia */}
                        <div>
                            <div className="flex items-center mb-6">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></div>
                                <h2 className="text-xl font-semibold text-gray-900">Fotos e Mídia</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Foto Principal */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Foto Principal *
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <p className="text-sm text-gray-500 mb-3">Esta será a imagem de capa do projeto</p>
                                    </div>
                                    
                                    <label className={`
                                        flex flex-col items-center justify-center w-full h-64
                                        border-2 border-dashed rounded-2xl cursor-pointer
                                        transition-all duration-300 hover:border-blue-500 hover:bg-blue-50
                                        ${photo ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
                                    `}>
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                                            {photo ? (
                                                <>
                                                    <svg className="w-12 h-12 mb-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <p className="text-sm font-medium text-gray-900 mb-1">Foto selecionada</p>
                                                    <p className="text-xs text-gray-500">{photo.name}</p>
                                                    <p className="text-xs text-gray-500">({Math.round(photo.size / 1024)} KB)</p>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p className="text-sm font-medium text-gray-900 mb-1">Clique para selecionar</p>
                                                    <p className="text-xs text-gray-500">PNG, JPG (Máx. 10MB)</p>
                                                </>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            onChange={handlePhotoChange} 
                                            required 
                                            accept="image/jpeg,image/png,image/webp"
                                        />
                                    </label>
                                    {photo && (
                                        <button 
                                            type="button" 
                                            onClick={() => setPhoto(null)}
                                            className="text-sm text-red-600 hover:text-red-800 transition-colors"
                                        >
                                            Remover foto
                                        </button>
                                    )}
                                </div>

                                {/* Galeria */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Galeria de Fotos
                                        </label>
                                        <p className="text-sm text-gray-500 mb-3">Adicione até 20 imagens do projeto</p>
                                    </div>
                                    
                                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:border-blue-500">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                                            <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <p className="text-sm font-medium text-gray-900 mb-1">Adicionar imagens</p>
                                            <p className="text-xs text-gray-500">PNG, JPG (Máx. 50MB no total)</p>
                                        </div>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            onChange={handleGalleryChange} 
                                            multiple 
                                            accept="image/jpeg,image/png,image/webp"
                                        />
                                    </label>

                                    {gallery.length > 0 && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {gallery.length} {gallery.length === 1 ? 'imagem' : 'imagens'} selecionada{gallery.length > 1 ? 's' : ''}
                                                </p>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setGallery([])}
                                                    className="text-sm text-red-600 hover:text-red-800 transition-colors"
                                                >
                                                    Limpar todas
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-2">
                                                {gallery.map((file, index) => (
                                                    <div key={index} className="relative group">
                                                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeGalleryImage(index)}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                        <p className="text-xs text-gray-600 truncate mt-1">{file.name}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Ações do formulário */}
                        <div className="pt-8 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
                                <button 
                                    type="button" 
                                    onClick={() => navigate(-1)}
                                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className={`
                                        px-8 py-4 rounded-xl text-white font-medium
                                        transition-all duration-300 transform hover:scale-[1.02]
                                        ${isSubmitting 
                                            ? 'bg-blue-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                                        }
                                    `}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Criando Projeto...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Criar Projeto
                                        </span>
                                    )}
                                </button>
                            </div>
                            
                            <p className="text-sm text-gray-500 text-center mt-6">
                                Todos os campos marcados com <span className="text-red-500">*</span> são obrigatórios
                            </p>
                        </div>
                    </form>
                </div>

                {/* Dicas e informações úteis */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                    <div className="flex items-start">
                        <svg className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dicas para um bom cadastro</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <svg className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Use uma foto principal de alta qualidade que mostre o projeto em seu melhor ângulo</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Na descrição, inclua conceitos arquitetônicos, inspirações e características especiais</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Adicione múltiplos ângulos e detalhes na galeria para uma visualização completa</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos adicionais */}
            <style jsx global>{`
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                
                input[type="number"] {
                    -moz-appearance: textfield;
                }
                
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }
                
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 3px;
                }
                
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </div>
    );
}
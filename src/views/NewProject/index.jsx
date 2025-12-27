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
        
        const totalSize = [...gallery, ...newFiles].reduce((acc, file) => acc + file.size, 0);
        if (totalSize > 50 * 1024 * 1024) {
            setError('A galeria não pode exceder 50MB no total');
            return;
        }

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

            setError('success: Projeto cadastrado com sucesso!');
            
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
        <div className="min-h-screen bg-white">
            {/* Header minimalista */}
            <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between">
                        <Logocontainer />
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-black transition-colors group"
                        >
                            <svg 
                                className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="text-sm font-medium">Voltar</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Conteúdo principal */}
            <main className="pt-16 pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Cabeçalho minimalista */}
                    <div className="mb-10 pt-6">
                        <h1 className="text-3xl font-light text-gray-900 tracking-tight">Novo Projeto</h1>
                        <p className="text-gray-500 mt-2">Cadastre as informações do seu projeto arquitetônico</p>
                    </div>

                    {/* Linha progresso minimalista */}
                    <div className="mb-12">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center">
                                    <div className="w-2 h-2 bg-black rounded-full"></div>
                                </div>
                                <div className="text-sm font-medium text-black ml-3">Informações</div>
                            </div>
                            <div className="w-24 h-px bg-gray-300 mx-4"></div>
                            <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                </div>
                                <div className="text-sm text-gray-400 ml-3">Fotos</div>
                            </div>
                        </div>
                    </div>

                    {/* Mensagens de feedback */}
                    {error && (
                        <div className={`mb-8 p-4 rounded-lg ${
                            error.startsWith('success:') 
                                ? 'bg-green-50 border border-green-100' 
                                : 'bg-red-50 border border-red-100'
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
                                <span className="text-sm">{error.replace('success: ', '')}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Seção 1: Informações básicas */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">Informações Básicas</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nome do Projeto *
                                    </label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('name')}
                                        required 
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors ${
                                            touched.name && !formData.name ? 'border-red-300' : 'border-gray-300'
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
                                        value={formData.location} 
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('location')}
                                        required 
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors ${
                                            touched.location && !formData.location ? 'border-red-300' : 'border-gray-300'
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
                                        value={formData.description} 
                                        onChange={handleChange}
                                        rows={4} 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors resize-none"
                                        placeholder="Descreva os conceitos, inspirações e características principais..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Seção 2: Detalhes técnicos */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">Detalhes Técnicos</h2>
                            </div>
                            
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors appearance-none bg-white"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors appearance-none bg-white"
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
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            name="build_area" 
                                            value={formData.build_area} 
                                            onChange={handleChange}
                                            step="0.01" 
                                            min="0" 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">
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
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                                        placeholder={`Material ${index + 1}`}
                                                    />
                                                    {formData.materials.length > 1 && (
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeMaterialField(index)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-black"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                            className="text-sm text-gray-600 hover:text-black transition-colors flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Adicionar material
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seção 3: Mídia */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">Fotos e Mídia</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Foto Principal */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Foto Principal *
                                        </label>
                                        <p className="text-sm text-gray-500">Imagem de capa do projeto</p>
                                    </div>
                                    
                                    <label className={`
                                        flex flex-col items-center justify-center w-full h-64
                                        border border-dashed rounded-lg cursor-pointer
                                        transition-all duration-200 hover:border-black hover:bg-gray-50
                                        ${photo ? 'border-black bg-gray-50' : 'border-gray-300'}
                                    `}>
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                                            {photo ? (
                                                <>
                                                    <svg className="w-10 h-10 mb-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <p className="text-sm font-medium text-gray-900 mb-1">Arquivo selecionado</p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{photo.name}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p className="text-sm text-gray-900 mb-1">Selecionar arquivo</p>
                                                    <p className="text-xs text-gray-500">PNG, JPG (Max. 10MB)</p>
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
                                </div>

                                {/* Galeria */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Galeria de Fotos
                                        </label>
                                        <p className="text-sm text-gray-500">Até 20 imagens</p>
                                    </div>
                                    
                                    <label className="flex flex-col items-center justify-center w-full h-64 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black hover:bg-gray-50 transition-all duration-200">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                                            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <p className="text-sm text-gray-900 mb-1">Adicionar imagens</p>
                                            <p className="text-xs text-gray-500">Arraste ou clique para selecionar</p>
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
                                                    {gallery.length} {gallery.length === 1 ? 'imagem' : 'imagens'}
                                                </p>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setGallery([])}
                                                    className="text-sm text-gray-500 hover:text-black transition-colors"
                                                >
                                                    Limpar
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                                                {gallery.map((file, index) => (
                                                    <div key={index} className="relative group">
                                                        <div className="aspect-square bg-gray-100 rounded border border-gray-200 overflow-hidden">
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeGalleryImage(index)}
                                                            className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Ações do formulário */}
                        <div className="pt-10 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                                <button 
                                    type="button" 
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-3.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium text-sm"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className={`
                                        px-6 py-3.5 rounded-lg text-white font-medium text-sm
                                        transition-colors
                                        ${isSubmitting 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-black hover:bg-gray-800'
                                        }
                                    `}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Criando...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            Criar Projeto
                                        </span>
                                    )}
                                </button>
                            </div>
                            
                            <p className="text-xs text-gray-500 text-center mt-6">
                                Campos marcados com * são obrigatórios
                            </p>
                        </div>
                    </form>

                    {/* Informações úteis - mais discreto */}
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <div className="flex items-start space-x-3">
                            <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Recomendações</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start">
                                        <span className="text-gray-400 mr-2">•</span>
                                        <span>Use fotos de alta qualidade que representem bem o projeto</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-gray-400 mr-2">•</span>
                                        <span>Descreva os conceitos arquitetônicos principais</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-gray-400 mr-2">•</span>
                                        <span>Inclua múltiplos ângulos na galeria</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
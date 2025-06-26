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
        setPhoto(e.target.files[0]);
    };

    const handleGalleryChange = (e) => {
        const newFiles = Array.from(e.target.files);

        setGallery(prevGallery => {
            const allFiles = [...prevGallery, ...newFiles];
            const uniqueMap = new Map();
            allFiles.forEach(file => {
                uniqueMap.set(file.name + file.size, file);
            });
            return Array.from(uniqueMap.values());
        });
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
            data.append(`materials[${index}]`, material);
        });
        
        if (photo) {
            data.append('photo', photo);
        }
        
        gallery.forEach(file => {
            data.append('gallery', file);
        });

        try {
            const response = await fetch('http://localhost:8080/project', {
                method: 'POST',
                body: data
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao cadastrar projeto');
            }

            const name = localStorage.getItem('name');
            navigate(`/profile/${name}`);
        } catch (err) {
            setError(err.message || 'Erro desconhecido');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="h-[60px] flex justify-center shadow-sm bg-white">
                <Logocontainer />
            </header>
            
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="bg-[#4A4A4A] p-6">
                        <h1 className="text-2xl font-bold text-white">Cadastro de Novo Projeto</h1>
                        <p className="text-gray-300 mt-1">Preencha todos os campos abaixo para registrar seu projeto</p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-6">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Localização *</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Materiais</label>
                                <div className="space-y-2">
                                    {formData.materials.map((material, index) => (
                                        <div key={index} className="flex space-x-2">
                                            <input type="text" value={material} onChange={(e) => handleMaterialChange(index, e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder={`Material ${index + 1}`} />
                                            <button type="button" onClick={() => removeMaterialField(index)} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">×</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addMaterialField} className="mt-2 px-4 py-2 bg-blue-100 text-black rounded-lg hover:bg-blue-200 transition flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Adicionar Material
                                    </button>
                                </div>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                                <select name="status" value={formData.status} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                                    <option value="">Selecione o status</option>
                                    <option value="Em planejamento">Em planejamento</option>
                                    <option value="Em construção">Em construção</option>
                                    <option value="Concluído">Concluído</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Uso *</label>
                                <select name="usage_type" value={formData.usage_type} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                                    <option value="">Selecione o tipo de uso</option>
                                    <option value="Residencial">Residencial</option>
                                    <option value="Comercial">Comercial</option>
                                    <option value="Industrial">Industrial</option>
                                    <option value="Religioso">Religioso</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Área Construída (m²)</label>
                                <input type="number" name="build_area" value={formData.build_area} onChange={handleChange} step="0.01" min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Área do Terreno (m²)</label>
                                <input type="number" name="terrain_area" value={formData.terrain_area} onChange={handleChange} step="0.01" min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Principal *</label>
                                <label className="flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition p-6">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg className="w-10 h-10 mb-2 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                        </svg>
                                        <p className="text-sm text-gray-500 text-center">
                                            <span className="font-semibold">Clique para enviar</span><br />
                                            <span className="text-xs">(Formatos: JPG, PNG)</span>
                                        </p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handlePhotoChange} required accept="image/jpeg,image/png" />
                                </label>
                                {photo && <p className="mt-2 text-sm text-gray-600 truncate">{photo.name} ({Math.round(photo.size / 1024)} KB)</p>}
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Galeria de Fotos</label>
                                <label className="flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition p-6">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg className="w-10 h-10 mb-2 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                        </svg>
                                        <p className="text-sm text-gray-500 text-center">
                                            <span className="font-semibold">Clique para enviar</span><br />
                                            <span className="text-xs">(Múltiplos arquivos permitidos)</span>
                                        </p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleGalleryChange} multiple accept="image/jpeg,image/png" />
                                </label>

                                {gallery.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        <p className="text-sm text-gray-700 font-medium">Arquivos selecionados:</p>
                                        <ul className="text-sm text-gray-600 max-h-40 overflow-auto pr-2">
                                            {gallery.map((file, index) => (
                                                <li key={index} className="flex justify-between items-center py-1 border-b border-gray-200">
                                                    <span className="truncate">{file.name} ({Math.round(file.size / 1024)} KB)</span>
                                                    <button type="button" onClick={() => removeGalleryImage(index)} className="ml-3 px-2 py-1 text-xs text-red-600 hover:underline">Remover</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                                <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancelar</button>
                                <button type="submit" disabled={isSubmitting} className={`px-6 py-3 rounded-lg text-white transition ${isSubmitting ? 'bg-[#585858] cursor-not-allowed' : 'bg-[#4A4A4A] hover:bg-[#5e5e5e]'}`}>
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Cadastrando...
                                        </span>
                                    ) : (
                                        'Cadastrar Projeto'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

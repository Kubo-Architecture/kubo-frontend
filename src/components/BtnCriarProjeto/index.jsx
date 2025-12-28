import React, { useState, useEffect, useRef } from 'react';

export default function Btncriarprojeto({ onProjectCreated }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    location: '',
    architect: '',
    year: '',
    description: '',
    category: 'residencial',
    style: '',
    tags: '',
    startDate: '',
    endDate: '',
    isAuthor: false,
    inProgress: false
  });
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const modalRef = useRef(null);
  const mainImageInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const contentRef = useRef(null);

  // Fechar modal ao clicar fora ou pressionar ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowCreateModal(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setShowCreateModal(false);
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

  // Handlers para upload de imagens
  const handleMainImageClick = () => {
    mainImageInputRef.current?.click();
  };

  const handleGalleryClick = () => {
    galleryInputRef.current?.click();
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setGalleryImages(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryPreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview(null);
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = '';
    }
  };

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.location || !newProject.architect) {
      alert('Por favor, preencha os campos obrigatórios');
      return;
    }

    const tagsArray = newProject.tags.length > 0 
      ? newProject.tags.split(',').map(tag => tag.trim()) 
      : [];

    const projectData = {
      ...newProject,
      tags: tagsArray,
      startDate: newProject.startDate || '',
      endDate: newProject.inProgress ? '' : newProject.endDate,
      status: newProject.inProgress ? 'Em andamento' : 'Concluído',
      mainImage: mainImage,
      galleryImages: galleryImages
    };

    delete projectData.isAuthor;
    delete projectData.inProgress;

    if (onProjectCreated) {
      onProjectCreated(projectData);
    }

    setShowCreateModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewProject({
      title: '',
      location: '',
      architect: '',
      year: '',
      description: '',
      category: 'residencial',
      style: '',
      tags: '',
      startDate: '',
      endDate: '',
      isAuthor: false,
      inProgress: false
    });
    setMainImage(null);
    setMainImagePreview(null);
    setGalleryImages([]);
    setGalleryPreviews([]);
    if (mainImageInputRef.current) mainImageInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleDateChange = (e, field) => {
    let value = e.target.value;
    
    if (field === 'startDate' || field === 'endDate') {
      value = value.replace(/\D/g, '');
      if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      if (value.length > 5) {
        value = value.slice(0, 5) + '/' + value.slice(5, 9);
      }
    }
    
    setNewProject({...newProject, [field]: value});
  };

  return (
    <>
      <button
        onClick={() => setShowCreateModal(true)}
        className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
        title="Criar projeto"
      >
        <i className="fas fa-plus text-base sm:text-lg"></i>
      </button>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div 
            ref={modalRef}
            className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col"
          >
            {/* Header simplificado */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-8 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Publicar projeto</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  aria-label="Fechar"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-1">Preencha as informações do projeto</p>
            </div>

            {/* Conteúdo com scroll - ALTURA AJUSTADA */}
            <div 
              ref={contentRef}
              className="flex-1 overflow-y-auto px-8 py-4" // py-4 em vez de py-6
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna 1 - Informações principais */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Título e Localização na mesma linha */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Título da obra *
                      </label>
                      <input
                        type="text"
                        value={newProject.title}
                        onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                        placeholder="Digite o título"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Localização *
                      </label>
                      <input
                        type="text"
                        value={newProject.location}
                        onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                        placeholder="Cidade, Estado"
                      />
                    </div>
                  </div>

                  {/* Descrição */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Descrição do projeto
                    </label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white resize-none"
                      placeholder="Descreva o projeto, suas características principais, materiais utilizados, etc."
                    />
                  </div>

                  {/* Datas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Data de início
                      </label>
                      <input
                        type="text"
                        value={newProject.startDate}
                        onChange={(e) => handleDateChange(e, 'startDate')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                        placeholder="DD/MM/AAAA"
                        maxLength="10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Data de término
                      </label>
                      <input
                        type="text"
                        value={newProject.endDate}
                        onChange={(e) => handleDateChange(e, 'endDate')}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white ${newProject.inProgress ? 'bg-gray-100 text-gray-500' : ''}`}
                        placeholder="DD/MM/AAAA"
                        maxLength="10"
                        disabled={newProject.inProgress}
                      />
                      <div className="mt-3 flex items-center">
                        <input
                          type="checkbox"
                          id="inProgress"
                          checked={newProject.inProgress}
                          onChange={(e) => setNewProject({...newProject, inProgress: e.target.checked})}
                          className="rounded border-gray-300 text-black focus:ring-black h-4 w-4"
                        />
                        <label htmlFor="inProgress" className="ml-2 text-sm text-gray-700">
                          Projeto em andamento
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Autor e checkbox */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Autor/Arquiteto responsável *
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        value={newProject.architect}
                        onChange={(e) => setNewProject({...newProject, architect: e.target.value})}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                        placeholder="Nome do arquiteto/autor"
                      />
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isAuthor"
                          checked={newProject.isAuthor}
                          onChange={(e) => setNewProject({...newProject, isAuthor: e.target.checked})}
                          className="rounded border-gray-300 text-black focus:ring-black h-4 w-4"
                        />
                        <label htmlFor="isAuthor" className="ml-2 text-sm text-gray-700 whitespace-nowrap">
                          Eu sou o autor
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna 2 - Imagens e detalhes */}
                <div className="space-y-6">
                  {/* Foto principal */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Foto principal *
                    </label>
                    <p className="text-xs text-gray-500 mb-3">Esta será a imagem destacada do projeto</p>
                    <input
                      type="file"
                      ref={mainImageInputRef}
                      onChange={handleMainImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    {mainImagePreview ? (
                      <div className="relative">
                        <img 
                          src={mainImagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          onClick={removeMainImage}
                          className="absolute top-2 right-2 bg-black/80 text-white p-2 rounded-full hover:bg-black transition-colors"
                          title="Remover imagem"
                        >
                          <i className="fas fa-times text-sm"></i>
                        </button>
                        <p className="text-xs text-gray-500 mt-2 truncate px-1">
                          {mainImage?.name}
                        </p>
                      </div>
                    ) : (
                      <div 
                        onClick={handleMainImageClick}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <i className="fas fa-camera text-3xl text-gray-400 mb-3"></i>
                        <p className="text-sm text-gray-600 font-medium mb-1">Adicionar foto principal</p>
                        <p className="text-xs text-gray-500">Clique para selecionar uma imagem</p>
                      </div>
                    )}
                  </div>

                  {/* Categoria e Estilo */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Categoria
                      </label>
                      <select
                        value={newProject.category}
                        onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                      >
                        <option value="residencial">Residencial</option>
                        <option value="cultural">Cultural</option>
                        <option value="religioso">Religioso</option>
                        <option value="comercial">Comercial</option>
                        <option value="institucional">Institucional</option>
                        <option value="paisagismo">Paisagismo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Estilo
                      </label>
                      <input
                        type="text"
                        value={newProject.style}
                        onChange={(e) => setNewProject({...newProject, style: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                        placeholder="Moderno, Contemporâneo..."
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Tags
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Separe as tags por vírgula</p>
                    <input
                      type="text"
                      value={newProject.tags}
                      onChange={(e) => setNewProject({...newProject, tags: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                      placeholder="concreto, madeira, sustentável, moderno"
                    />
                  </div>

                  {/* Galeria de imagens */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        Galeria de imagens
                      </label>
                      <span className="text-xs text-gray-500">
                        {galleryImages.length} selecionada{galleryImages.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {/* Previews da galeria */}
                    {galleryPreviews.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {galleryPreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img 
                                src={preview} 
                                alt={`Preview ${index}`}
                                className="w-16 h-16 object-cover rounded border border-gray-300"
                              />
                              <button
                                onClick={() => removeGalleryImage(index)}
                                className="absolute -top-1 -right-1 bg-black/80 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black"
                                title="Remover imagem"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={galleryInputRef}
                      onChange={handleGalleryChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    
                    <div 
                      onClick={handleGalleryClick}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <i className="fas fa-images text-xl text-gray-400 mb-2"></i>
                      <p className="text-sm text-gray-600 font-medium">Adicionar mais imagens</p>
                      <p className="text-xs text-gray-500 mt-1">Clique para selecionar múltiplas imagens</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nota sobre campos obrigatórios */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  * Campos obrigatórios
                </p>
              </div>
            </div>

            {/* Footer com botões - ALTURA ADEQUADA */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 px-8 py-5">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateProject}
                  className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm hover:shadow"
                >
                  Publicar projeto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
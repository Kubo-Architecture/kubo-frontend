import React from 'react';

interface MenuSection {
    id: string;
    label: string;
    icon: string;
}

interface EditProjectSidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    showPreview: boolean;
    setShowPreview: (show: boolean) => void;
    saving: boolean;
    onCancel: () => void;
    onSubmit: () => void;
}

const menuSections: MenuSection[] = [
    { id: 'geral', label: 'Geral', icon: 'fa-solid fa-grip' },
    { id: 'media', label: 'Fotos e Mídia', icon: 'fa-solid fa-image' },
    { id: 'technical', label: 'Especificações Técnicas', icon: 'fa-solid fa-wrench' },
    { id: 'materials', label: 'Materiais', icon: 'fa-solid fa-cubes' },
    { id: 'requirements', label: 'Requisitos', icon: 'fa-solid fa-clipboard-check' },
];

export default function EditProjectSidebar({
    activeSection,
    setActiveSection,
    showPreview,
    setShowPreview,
    saving,
    onCancel,
    onSubmit,
}: EditProjectSidebarProps) {
    return (
        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-neutral-200 dark:bg-[#151B23] dark:border-[#3d444d] flex-col pt-16 z-10">
            <div className="flex-1 p-6 overflow-y-auto">
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

                <div className="border-t border-gray-200 dark:border-[#3d444d] mt-4 pt-4">
                    <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
                            showPreview
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                                : 'bg-gray-100 dark:bg-[#202830] text-gray-700 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-[#2a3340]'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <i className={`fas fa-eye text-lg`}></i>
                            <span className="font-medium text-[15px]">
                                {showPreview ? 'Ocultar Preview' : 'Mostrar Preview'}
                            </span>
                        </div>
                        <i className={`fas fa-chevron-${showPreview ? 'up' : 'down'} text-sm`}></i>
                    </button>
                </div>
            </div>

            {/* Footer - Botões */}
            <div className="px-6 py-6 border-t border-zinc-200 dark:border-[#3d444d] bg-white dark:bg-[#151B23]">
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving}
                        className="px-4 py-3.5 border-2 border-zinc-300 dark:border-[#3d444d] text-zinc-900 dark:text-white rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-[#202830] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onSubmit}
                        disabled={saving}
                        className="px-4 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Salvando...</span>
                            </>
                        ) : (
                            <span>Salvar</span>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
}
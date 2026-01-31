interface VisibilitySectionProps {
    accountVisibility: string;
    onVisibilityChange: (visibility: string) => void;
  }
  
  export default function VisibilitySection({ accountVisibility, onVisibilityChange }: VisibilitySectionProps) {
    return (
      <section className="bg-white dark:bg-[#151B23] dark:border-[#3d444d] rounded-2xl overflow-hidden border border-neutral-200">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-2">Visibilidade da Conta</h2>
            <p className="text-sm sm:text-base text-neutral-500">Controle quem pode ver seu perfil</p>
          </div>
  
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => onVisibilityChange('public')}
              className={`relative p-4 sm:p-5 cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                accountVisibility === 'public'
                  ? 'bg-black dark:bg-black border-black dark:border-black shadow-lg'
                  : 'bg-white dark:bg-[#202830] border-neutral-200 dark:border-[#3d444d] hover:border-neutral-300 dark:hover:border-[#3d444d] hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <i className={`fa-solid fa-globe text-xl sm:text-2xl ${accountVisibility === 'public' ? 'text-white' : 'text-black dark:text-neutral-400'}`}></i>
                <div className={`font-semibold text-sm sm:text-base ${accountVisibility === 'public' ? 'text-white' : 'text-black dark:text-neutral-400'}`}>
                  Pública
                </div>
                <div className={`text-xs sm:text-sm ${accountVisibility === 'public' ? 'text-neutral-300' : 'text-neutral-500 dark:text-neutral-500'}`}>
                  Visível para todos
                </div>
              </div>
            </button>
  
            <button
              onClick={() => onVisibilityChange('private')}
              className={`relative p-4 sm:p-5 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                accountVisibility === 'private'
                  ? 'bg-black dark:bg-black border-black dark:border-black shadow-lg'
                  : 'bg-white dark:bg-[#202830] border-neutral-200 dark:border-[#3d444d] hover:border-neutral-300 dark:hover:border-[#3d444d] hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <i className={`fa-solid fa-lock text-xl sm:text-2xl ${accountVisibility === 'private' ? 'text-white' : 'text-black dark:text-neutral-400'}`}></i>
                <div className={`font-semibold text-sm sm:text-base ${accountVisibility === 'private' ? 'text-white' : 'text-black dark:text-neutral-400'}`}>
                  Privada
                </div>
                <div className={`text-xs sm:text-sm ${accountVisibility === 'private' ? 'text-neutral-300' : 'text-neutral-500 dark:text-neutral-500'}`}>
                  Apenas você
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>
    );
  }
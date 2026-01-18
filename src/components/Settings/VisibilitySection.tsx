interface VisibilitySectionProps {
    accountVisibility: string;
    onVisibilityChange: (visibility: string) => void;
  }
  
  export default function VisibilitySection({ accountVisibility, onVisibilityChange }: VisibilitySectionProps) {
    return (
      <section className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-2">Visibilidade da Conta</h2>
            <p className="text-base text-neutral-500">Controle quem pode ver seu perfil</p>
          </div>
  
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onVisibilityChange('public')}
              className={`relative p-5 rounded-xl border-2 transition-all duration-200 ${
                accountVisibility === 'public'
                  ? 'bg-black border-black shadow-lg'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <i className={`fa-solid fa-globe text-2xl ${accountVisibility === 'public' ? 'text-white' : 'text-black'}`}></i>
                <div className={`font-semibold text-base ${accountVisibility === 'public' ? 'text-white' : 'text-black'}`}>
                  Pública
                </div>
                <div className={`text-sm ${accountVisibility === 'public' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  Visível para todos
                </div>
              </div>
            </button>
  
            <button
              onClick={() => onVisibilityChange('private')}
              className={`relative p-5 rounded-xl border-2 transition-all duration-200 ${
                accountVisibility === 'private'
                  ? 'bg-black border-black shadow-lg'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <i className={`fa-solid fa-lock text-2xl ${accountVisibility === 'private' ? 'text-white' : 'text-black'}`}></i>
                <div className={`font-semibold text-base ${accountVisibility === 'private' ? 'text-white' : 'text-black'}`}>
                  Privada
                </div>
                <div className={`text-sm ${accountVisibility === 'private' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  Apenas você
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>
    );
  }
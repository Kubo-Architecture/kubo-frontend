import Universo from "../../../assets/images/Universo.svg"

export default function Projetos() {
    return (
        <section className="px-4 mb-8 sm:px-6 md:px-8 lg:px-16 xl:px-25 w-full md:mt-20 min-w-[400px] flex flex-col items-center">
            {/* Card principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 shadow-[6px_6px_12px_rgba(0,0,0,0.45)] rounded-2xl bg-[#F4F4F4] overflow-hidden max-w-6xl w-full mx-auto">
                {/* Container do Conteúdo */}
                <div className="order-2 lg:order-1 flex flex-col justify-center p-4 md:p-6 lg:p-8 space-y-4">
                    {/* Título e descrição */}
                    <div className="text-center lg:text-left space-y-3 md:space-y-4">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-tight">
                            Crie com os{" "}
                            <span className="text-[#0B85FF] font-bold bg-gradient-to-r from-[#0B85FF] to-[#0969CC] bg-clip-text text-transparent">
                                Projetos
                            </span>
                        </h2>

                        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light leading-relaxed text-gray-700">
                            Deixe sua criatividade fluir e popule seu perfil com suas próprias obras de arte. 
                            Transforme ideias em realidade e compartilhe sua visão única com o mundo.
                        </p>
                    </div>

                    {/* Call to Action */}
                    <div className="flex justify-center pt-2">
                        <a
                            className="
                                group relative bg-[#0B85FF] hover:bg-[#0969CC] 
                                transition-all duration-300 ease-in-out
                                px-26
                                py-2 md:py-3 
                                text-white rounded-2xl 
                                text-sm sm:text-base md:text-lg font-semibold
                                shadow-lg hover:shadow-xl
                                transform hover:-translate-y-1
                                focus:outline-none focus:ring-4 focus:ring-[#0B85FF]/30
                                active:scale-95
                            "
                            href="/register"
                            aria-label="Criar um novo projeto"
                        >
                            <span className="relative z-10">Crie já</span>
                            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </a>
                    </div>
                </div>

                {/* Container da Imagem */}
                <div className="
                    order-1 lg:order-2
                    flex justify-center items-center 
                    p-3 sm:p-4 md:p-5 lg:p-6
                ">
                    <div className="relative w-full max-w-xs">
                        <img 
                            src={Universo} 
                            alt="Universo criativo dos projetos" 
                            className="
                                rounded-xl w-full h-auto object-contain
                                drop-shadow-lg
                                transition-transform duration-300 hover:scale-102
                            " 
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
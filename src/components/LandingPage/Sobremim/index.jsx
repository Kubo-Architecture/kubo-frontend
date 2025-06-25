import Mesa from "../../../assets/images/mesa.svg"

export default function SobreNos() {
    return (
        <section id="sobre-nos" className="px-4 py-12 sm:px-6 md:px-8 lg:px-16 xl:px-25 min-w-[400px] w-full">
            <div className="max-w-7xl mx-auto">
                {/* Grid principal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Conteúdo de texto */}
                    <div className="order-2 lg:order-1 space-y-6 lg:space-y-8">
                        {/* Título principal */}
                        <header>
                            <h1 id="Sobre" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-montserrat font-light text-gray-900 mb-4">
                                Sobre nós
                            </h1>
                        </header>

                        {/* Subtítulo com destaque */}
                        <div className="relative">
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-tight text-gray-800">
                                A jornada que moldou{" "}
                                <span className="relative inline-block">
                                    <span className="text-[#0B85FF] font-semibold bg-gradient-to-r from-[#0B85FF] to-[#0969CC] bg-clip-text text-transparent">
                                        nossa
                                    </span>
                                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#0B85FF] to-[#0969CC] opacity-30"></div>
                                </span>
                                {" "}plataforma
                            </h2>
                        </div>

                        {/* Texto descritivo com melhor estrutura */}
                        <div className="prose prose-lg lg:prose-xl max-w-none text-gray-700 leading-relaxed space-y-4">
                            <div className="bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-l-lg border-l-4 border-[#0B85FF]">
                                <p className="text-base sm:text-lg lg:text-xl font-light mb-0">
                                    <span className="font-semibold text-[#0B85FF]">Kubo</span> é uma plataforma web criada com o propósito de 
                                    facilitar a conexão, o compartilhamento de ideias e a valorização de projetos no 
                                    campo da <strong className="text-gray-800">Arquitetura</strong>.
                                </p>
                            </div>
                            
                            <p className="text-base sm:text-lg lg:text-xl font-light">
                                Pensada especialmente para <em>estudantes e jovens profissionais</em> da área, 
                                o Kubo funciona como uma rede social temática, onde os usuários podem publicar 
                                seus trabalhos acadêmicos e pessoais, trocar referências e acompanhar as 
                                produções de colegas de diferentes instituições e regiões.
                            </p>
                            
                            <p className="text-base sm:text-lg lg:text-xl font-light">
                                A proposta central da plataforma é criar um <strong className="text-gray-800">ambiente 
                                colaborativo e inspirador</strong>, no qual estudantes possam divulgar seus projetos 
                                de maquetes, renders, croquis, plantas baixas e outras produções arquitetônicas. 
                                Além disso, o Kubo permite que os usuários organizem seus trabalhos em portfólios 
                                públicos, criando oportunidades de <span className="text-[#0B85FF] font-medium">networking 
                                e visibilidade</span>.
                            </p>
                        </div>

                        {/* Call to action sutil */}
                        <div className="pt-4">
                            <div className="inline-flex items-center space-x-2 text-[#0B85FF] font-medium">
                                <span className="text-sm uppercase tracking-wider">Conecte-se conosco</span>
                                <div className="w-8 h-px bg-gradient-to-r from-[#0B85FF] to-transparent"></div>
                            </div>
                        </div>
                    </div>

                    {/* Container da Imagem */}
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                            {/* Elemento decorativo de fundo */}
                            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-[#0B85FF]/10 to-[#0969CC]/5 rounded-2xl -z-10"></div>
                            
                            <div className="relative bg-white rounded-2xl p-4 shadow-lg">
                                <img 
                                    src={Mesa} 
                                    alt="Mesa de trabalho de arquitetura com projetos e ferramentas de design" 
                                    className="
                                        w-full h-auto object-contain rounded-xl
                                        transition-transform duration-500 hover:scale-102
                                        drop-shadow-lg
                                    "
                                    loading="lazy"
                                />
                            </div>
                            
                            {/* Elemento decorativo flutuante */}
                            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-[#0B85FF] to-[#0969CC] rounded-full opacity-20 blur-xl"></div>
                        </div>
                    </div>
                </div>

                {/* Seção de estatísticas ou destaques */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#0B85FF] to-[#0969CC] rounded-full mx-auto flex items-center justify-center">
                                <span className="text-white font-bold text-lg">🎨</span>
                            </div>
                            <h3 className="font-semibold text-gray-800">Criatividade</h3>
                            <p className="text-sm text-gray-600">Expresse sua visão arquitetônica única</p>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#0B85FF] to-[#0969CC] rounded-full mx-auto flex items-center justify-center">
                                <span className="text-white font-bold text-lg">🤝</span>
                            </div>
                            <h3 className="font-semibold text-gray-800">Colaboração</h3>
                            <p className="text-sm text-gray-600">Conecte-se com profissionais da área</p>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#0B85FF] to-[#0969CC] rounded-full mx-auto flex items-center justify-center">
                                <span className="text-white font-bold text-lg">🚀</span>
                            </div>
                            <h3 className="font-semibold text-gray-800">Crescimento</h3>
                            <p className="text-sm text-gray-600">Desenvolva sua carreira profissional</p>
                        </div>
                    </div>
                </div>

                {/* Elemento decorativo final */}
                <div className="mt-12 flex justify-center opacity-30">
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#0B85FF] to-transparent rounded-full"></div>
                </div>
            </div>
        </section>
    );
}
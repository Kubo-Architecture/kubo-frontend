import IconWithPanel from "../../components/Universal/MainHeader";
import ProjectImage from "../../assets/images/project.svg";

export default function ProjectPage() {
    return (
        <>
        <IconWithPanel />
        <div className="flex flex-col w-full min-h-[calc(100vh-5rem)]">
            <div className="flex w-full h-12 justify-end items-center px-5 gap-10">
                <div className="flex h-full items-center gap-2">
                    <span>Postagem verificada</span>
                    <div className="w-5 h-5 bg-gray-100"></div>
                </div>
                <div className="flex h-full items-center gap-2">
                    <span>Favorito</span>
                    <div className="w-5 h-5 bg-gray-100"></div>
                </div>
            </div>

            <div className="min-w-full h-70 md:h-90 lg:h-140 bg-blue-500">
                <img className="w-full h-full object-cover" src={ProjectImage}/>
            </div>

            <div className="flex w-full h-12 justify-end items-center px-5 gap-10">
                <div className="flex h-full items-center gap-2">
                    <div className="w-5 h-5 bg-gray-100"></div>
                    <span className="font-light text-sm">João Figueiras Lima</span>
                </div>
            </div>

            <div className="flex flex-col w-full px-12">
                <span className="text-4xl font-medium">Mansão dos Arcos</span>
                <span>por Lele</span>
                <div className="flex gap-2">
                    <span>Stockholm, Suécia 2021</span>
                    <div className="w-5 h-5 bg-gray-100"></div>
                </div>

                <span className="text-sm text-[#4f4f4f] mt-10 text-justify md:text-start
                                md:text-lg">
                    A Mansão dos Arcos é uma construção arquitetônica que se destaca por sua
                    grandiosidade e elementos clássicos, muitas vezes associados a estilos  
                    como o neoclássico, barroco ou até mesmo revivalista, dependendo da  
                    interpretação e contexto em que foi projetada. Abaixo, descrevo uma  
                    versão detalhada e específica dessa mansão, considerando características 
                    comuns de propriedades luxuosas e imponentes que carregam o nome "dos  
                    Arcos":A Mansão dos Arcos é uma construção arquitetônica que se destaca 
                    por sua grandiosidade e elementos clássicos, muitas vezes associados a 
                    estilos  como o neoclássico, barroco ou até mesmo revivalista, dependendo da  
                    interpretação e contexto em que foi projetada. Abaixo, descrevo uma  versão 
                    detalhada e específica dessa mansão, considerando características comuns de 
                    propriedades luxuosas e imponentes que carregam o nome "dos  Arcos":
                </span>
            </div>

            <div className="grid grid-cols-2 gap-y-5 p-12 text-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100"></div>
                    <div className="flex flex-col">
                        <span>Materiais</span>
                        <span className="font-light text-xs">Concreto, cimento e vidro</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100"></div>
                    <div className="flex flex-col">
                        <span>Realização</span>
                        <span className="font-light text-xs">Grupo Souza Lima</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100"></div>
                    <div className="flex flex-col">
                        <span>Status</span>
                        <span className="font-light text-xs">Em construção</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100"></div>
                    <div className="flex flex-col">
                        <span>Uso</span>
                        <span className="font-light text-xs">Escolar, esportivo</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100"></div>
                    <div className="flex flex-col">
                        <span>Área construída</span>
                        <span className="font-light text-xs">92.102km²</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100"></div>
                    <div className="flex flex-col">
                        <span>Área construída</span>
                        <span className="font-light text-xs">20.232km²</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col p-12">
                <span className="text-3xl font-medium mb-5">Galeria</span>
                <div className="grid grid-cols-1 sm:grid-rows-2 sm:grid-cols-3 gap-1
                                lg:grid-rows-3">
                    <div className="rounded-sm sm:row-span-2 lg:row-span-3">
                        <img className="w-full h-full object-cover rounded-sm" src={ProjectImage}/>
                    </div>
                    <div className="rounded-sm">
                        <img className="w-full h-full object-cover rounded-sm" src={ProjectImage}/>
                    </div>
                    <div className="rounded-sm lg:row-span-2">
                        <img className="w-full h-full object-cover rounded-sm" src={ProjectImage}/>
                    </div>
                    <div className="rounded-sm lg:row-span-2">
                        <img className="w-full h-full object-cover rounded-sm" src={ProjectImage}/>
                    </div>
                    <div className="rounded-sm">
                        <img className="w-full h-full object-cover rounded-sm" src={ProjectImage}/>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
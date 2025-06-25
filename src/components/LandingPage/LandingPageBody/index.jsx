import ImgFaixa from "../../../assets/icons/Universal/ImgFaixa.svg";
import ImgOnda from "../../../assets/icons/Universal/ImgOnda.svg";
import ImgPredio from "../../../assets/icons/Universal/ImgPredio.svg";
import SobreNos from "../../../components/LandingPage/Sobremim/index"
import Novidades from "../../../components/LandingPage/Novidades/index"
import Projetos from "../../../components/LandingPage/projetos/index"

export default function HomeBody() {
  return (
    <main >
      {/* Kubo: O maior banco de dados de arquitetura do país*/}

      <div className="overflow-hidden min-w-[422px] w-full">
        <div className="grid grid-cols-2 ">
          <div className="px-9 pt-18 h-162 md:px-20">
            <h1 className="
            text-5xl mb-5
            md:text-7xl
            xl:text-7xl  
             ">
              Kubo</h1>

            <div className="
             text-2xl w-60 font-normal font-mont
             md:text-3xl md:w-80
             xl:text-5xl xl:w-120
             
             ">
              O maior banco de dados de arquitetura do país
            </div>
          </div>

          {/*imagens*/}
          <div className="overflow-h min-h-[705px] md:min-h-[800px]">
            <div className="flex flex-col relative h-[100vh] ">
              <img
                src={ImgFaixa}
                alt="Imagem faixa"
                className="w-60 h-40 object-cover rounded-xl absolute top-40 left-17
                 md:top-15 md:left-3 md:h-50 md:w-auto
                 xl:h-60 xl:w-auto xl xl:top-10 xl:left-10
                 "
              />
              <img
                src={ImgOnda}
                alt="Imagem onda"
                className="w-60 h-40 object-cover rounded-xl absolute top-68 -left-23 z-1
                 md:top-50 md:left-48 md:h-50 md:w-auto 
                 xl:h-60 xl:w-auto xl:top-50 xl:left-65
                 "
              />
              <img
                src={ImgPredio}
                alt="Imagem predio"
                className="w-60 h-40 object-cover rounded-xl absolute top-88 left-5 
                md:top-80 md:-left-10 md:h-50 md:w-auto 
                xl:h-60 xl:w-auto xl:top-90 xl:-left-7
                "
              />
            </div>
          </div>

          {/*container projetos*/}
          <div className="bg-[#4A4A4A] h-40 flex items-center justify-center col-span-2">
            <p className="text-white font-light 
            text-2xl  
            sm:text-3xl
            2xl:text-4xl 2xl:h-30 2xl:pt-10">
              + de <span className="text-blue-400">1000</span> projetos documentados
            </p>
          </div>
        </div>
      </div>

      <div id="sobre nos">
        <SobreNos/>
      </div>

      <div id="novidades">
        <Novidades/>
      </div>

      <div id="projetos">
        <Projetos/>
      </div>
    </main>
  )
}
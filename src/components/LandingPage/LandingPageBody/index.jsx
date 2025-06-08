import ImgFaixa from "../../../assets/icons/Universal/ImgFaixa.svg";
import ImgOnda from "../../../assets/icons/Universal/ImgOnda.svg";
import ImgPredio from "../../../assets/icons/Universal/ImgPredio.svg";

export default function HomeBody() {
  return (
    <main>
      {/* Kubo: O maior banco de dados de arquitetura do país*/}

      <div className="overflow-hidden font-monospace min-w-[422px] md:min-w-[960px] lg:min-w-[1090px] ">
        <div className="grid grid-cols-2 ">
          <div className="px-9 pt-10 h-162 md:px-20">
            <h1 className="text-5xl md:text-7xl mb-5  2xl:text-9xl">Kubo</h1>
            <div className="text-2xl w-60 md:text-4xl md:w-90 2xl:text-6xl 2xl:w-140">
              O maior banco de dados de arquitetura do país
            </div>
          </div>

          {/*imagens*/}
          <div className="flex flex-col relative h-[100vh] ">
            <img
              src={ImgFaixa}
              alt="Imagem faixa"
              className="w-60 h-40 object-cover rounded-xl absolute top-40 left-17 md:top-10 md:-left-9 md:h-60 md:w-auto 2xl:top-20 2xl:left-35 2xl:w-auto 2xl:h-80 "
            />
            <img
              src={ImgOnda}
              alt="Imagem onda"
              className="w-60 h-40 object-cover rounded-xl absolute top-68 -left-23 z-1 md:top-50 md:left-47 md:h-60 md:w-auto 2xl:w-auto 2xl:h-80 2xl:top-75 2xl:left-105"
            />
            <img
              src={ImgPredio}
              alt="Imagem predio"
              className="w-60 h-40 object-cover rounded-xl absolute top-88 left-5 md:top-85 md:-left-30 md:h-60 md:w-auto 2xl:w-auto 2xl:h-80 2xl:top-125 2xl:left-5"
            />
          </div>
        </div>
         
         {/*container projetos*/}
        <div className="bg-black w-full h-20 flex items-center justify-center">
          <p className="text-white text-2xl font-light 2xl:text-4xl">
            + de <span className="text-blue-400">1000</span> projetos documentados
          </p>
        </div>
      </div>
    </main>
  )
}
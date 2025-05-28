import ImgFaixa from "../../../assets/icons/Universal/ImgFaixa.svg";
import ImgOnda from "../../../assets/icons/Universal/ImgOnda.svg";
import ImgPredio from "../../../assets/icons/Universal/ImgPredio.svg";

export default function HomeBody() {
  return (
    <main>

      {/* Texto */}
      <div className="overflow-hidden font-monospace">
        <div className="grid grid-cols-2 ">
          <div className="px-9 pt-10 h-162 md:px-20">
            <h1 className="text-5xl md:text-7xl mb-5">Kubo</h1>
            <div className="text-2xl w-55 mb-200 md:text-4xl md:w-90">
              O maior banco de dados de arquitetura do país
            </div>
          </div>
          <div className="flex flex-col relative">
            <img
              src={ImgFaixa}
              alt="Imagem faixa"
              className="w-60 h-40 object-cover rounded-xl absolute top-40 left-17 md:top-10 md:-left-9 md:h-60 md:w-auto"
            />
            <img
              src={ImgOnda}
              alt="Imagem onda"
              className="w-60 h-40 object-cover rounded-xl absolute top-68 -left-23 z-1 md:top-50 md:left-47 md:h-60 md:w-auto"
            />
            <img
              src={ImgPredio}
              alt="Imagem predio"
              className="w-60 h-40 object-cover rounded-xl absolute top-88 left-5 md:top-85 md:-left-30 md:h-60 md:w-auto"
            />
          </div>
        </div>
        <div className="bg-black w-full h-20 flex items-center justify-center">
          <p className="text-white text-2xl font-light ">
            + de <span className="text-blue-400">1000</span> projetos documentados
          </p>
        </div>
      </div>
    </main>
  )
}
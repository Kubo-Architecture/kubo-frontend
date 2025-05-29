import ImgFaixa from "../../../assets/icons/Universal/ImgFaixa.svg";
import ImgOnda from "../../../assets/icons/Universal/ImgOnda.svg";
import ImgPredio from "../../../assets/icons/Universal/ImgPredio.svg";

export default function HomeBody() {
  return (
    <main>

      {/* Texto */}
      <div className="overflow-hidden font-monospace">
        <div className="grid grid-cols-2 ">
          <div className="px-9 pt-10">
            <h1 className="text-5xl md:text-6xl mb-5">Kubo</h1>
            <div className="text-xl w-50 mb-200">
              O maior banco de dados de arquitetura do país
            </div>
          </div>
          <div className="flex flex-col relative">
            <img
              src={ImgFaixa}
              alt="Imagem faixa"
              className="w-60 h-40 object-cover rounded-xl absolute top-40 left-17 "
            />
            <img
              src={ImgOnda}
              alt="Imagem onda"
              className="w-60 h-40 object-cover rounded-xl absolute top-68 -left-23 z-1"
            />
            <img
              src={ImgPredio}
              alt="Imagem predio"
              className="w-60 h-40 object-cover rounded-xl absolute top-88 left-5 "
            />
          </div>
        </div>
        <div className="bg-black w-full h-20 flex items-center justify-center">
          <p className="text-white !text-xl ">
            + de <span className="text-blue-400">1000</span> projetos documentados
          </p>
        </div>
      </div>
    </main>
  )
}
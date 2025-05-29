import ImageNovidades from "../../../assets/icons/Universal/ImageNovidades.svg";
import ImgFaixa from "../../../assets/icons/Universal/ImgFaixa.svg";
import ImgOnda from "../../../assets/icons/Universal/ImgOnda.svg";
import ImgPredio from "../../../assets/icons/Universal/ImgPredio.svg";

export default function HomeBody() {
  return (
    <main>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* Texto */}
          <div>
            <h1 className="text-6xl mb-5">Kubo</h1>
            <div className="w-90 text-4xl leading-9">
              O maior banco de
              dados de arquitetura
              do país
            </div>
          </div>

          <div className="relative w-full h-[400px]">
            <img
              src={ImgFaixa}
              alt="Imagem faixa"
              className="absolute md:-top-20 left-0 w-80 h-60 object-cover rounded-xl shadow-lg"
            />
            <img
              src={ImgOnda}
              alt="Imagem onda"
              className="absolute md:top-20 left-50 w-80 h-60 object-cover rounded-xl shadow-lg"
            />
            <img
              src={ImgPredio}
              alt="Imagem predio"
              className="absolute top-60 -left-20 w-80 h-60 object-cover rounded-xl shadow-lg"
            />
          </div>

        </div>
      </div>
      <div className="bg-black w-full h-20">
        <p className="text-white leading-none text-[10rem] flex justify-center">
          + de <span className="text-blue-400">1000</span> projetos documentados
        </p>
      </div>
    </main>
  )
}
import Kuboempty from "../assets/icons/Universal/kubo-empty.svg"
import Manutencao from "../assets/icons/Universal/manutencao.png"

export default function MaintenanceScreen(): JSX.Element {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        {/* Ícone de Manutenção */}
        <div className="mb-8 sm:mb-12">
          <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 flex items-center justify-center relative">
            <img 
              src={Kuboempty} 
              alt="Kubo" 
              className="w-full h-full absolute"
            />
            <img 
              src={Manutencao} 
              alt="Manutenção" 
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mt-6 sm:mt-8 md:mt-10 relative z-10"
            />
          </div>
        </div>

        {/* Texto */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-gray-800 text-center max-w-2xl leading-tight px-4">
          Estamos fazendo
          <br />
          melhorias no sistema
        </h1>
      </div>
    );
}
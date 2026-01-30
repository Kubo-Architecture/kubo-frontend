import Kubo404 from '../assets/icons/Universal/Kubo404.png';
import Kubo500 from '../assets/icons/Universal/Kubo500.png';

export default function ErrorPage() {
  const is500 = window.location.pathname.includes('500');

  const errorCode = is500 ? '500' : '404';
  const errorMessage = is500
    ? 'Erro interno no servidor'
    : 'Página não encontrada';

  const errorImage = is500 ?  Kubo500 : Kubo404;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        {/* IMAGEM — QUASE COLADA */}
        <img
          src={errorImage}
          alt="Erro"
          className="
            mx-auto
            w-[500px]
            md:w-[650px]
            lg:w-[750px]
            -mb-12
          "
        />

        {/* CÓDIGO — SEM ESPAÇO */}
        <h1 className="text-6xl font-bold text-gray-900 leading-none mb-0">
          {errorCode}
        </h1>

        {/* TEXTO */}
        <p className="text-sm tracking-widest text-gray-600 uppercase mt-0">
          {errorMessage}
        </p>
      </div>
    </div>
  );
}
